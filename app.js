// ===== DỮ LIỆU MẶC ĐỊNH =====
const DEFAULT_SERVICES = [
    { id: 1, name: 'Cắt tóc nam', price: 50000, img: '💇' },
    { id: 2, name: 'Cắt tóc cao cấp', price: 80000, img: '✂️' },
    { id: 3, name: 'Cắt tóc + Râu', price: 70000, img: '🧔' },
    { id: 4, name: 'Gội đầu', price: 30000, img: '🚿' },
    { id: 5, name: 'Gội đầu chăm sóc', price: 120000, img: '🧴' },
    { id: 6, name: 'Nhuộm tóc', price: 300000, img: '🎨' },
    { id: 7, name: 'Uốn tóc', price: 350000, img: '🌀' },
    { id: 8, name: 'Dưỡng tóc', price: 400000, img: '✨' },
    { id: 9, name: 'Combo VIP', price: 500000, img: '👑' }
];

const ADMIN_USER = { username: 'admin', password: '123456', name: 'Quản Trị Viên' };

// ===== TRẠNG THÁI =====
let currentUser = null;
let services = JSON.parse(localStorage.getItem('nq_services')) || DEFAULT_SERVICES;
let customers = JSON.parse(localStorage.getItem('nq_customers')) || [];
let invoices = JSON.parse(localStorage.getItem('nq_invoices')) || [];
let cart = [];
let editingId = null;

// ===== LƯU DỮ LIỆU =====
function saveData() {
    localStorage.setItem('nq_services', JSON.stringify(services));
    localStorage.setItem('nq_customers', JSON.stringify(customers));
    localStorage.setItem('nq_invoices', JSON.stringify(invoices));
}

function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

function getToday() {
    return new Date().toLocaleDateString('vi-VN');
}

function generateId() {
    return Date.now().toString(36).toUpperCase();
}

// ===== ĐĂNG NHẬP =====
function login() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
        currentUser = ADMIN_USER;
        document.getElementById('adminName').textContent = currentUser.name;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('mainApp').classList.remove('hidden');
        initApp();
    } else {
        alert('❌ Sai tên đăng nhập hoặc mật khẩu!\n\nTài khoản: admin\nMật khẩu: 123456');
    }
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        currentUser = null;
        location.reload();
    }
}

// ===== CHUYỂN TRANG =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    event.target.classList.add('active');
    
    if (pageId === 'invoices') renderInvoices();
    if (pageId === 'customers') renderCustomers();
    if (pageId === 'services') renderServiceAdmin();
    if (pageId === 'reports') renderReports();
}

// ===== KHÁCH HÀNG =====
function openCustomerModal(id = null) {
    editingId = id;
    const modal = document.getElementById('customerModal');
    modal.classList.add('active');
    document.getElementById('customerModalTitle').textContent = id ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng';
    
    if (id) {
        const c = customers.find(x => x.id === id);
        document.getElementById('custName').value = c.name;
        document.getElementById('custPhone').value = c.phone;
        document.getElementById('custNote').value = c.note || '';
    } else {
        document.getElementById('custName').value = '';
        document.getElementById('custPhone').value = '';
        document.getElementById('custNote').value = '';
    }
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('active');
    editingId = null;
}

function saveCustomer() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const note = document.getElementById('custNote').value.trim();
    
    if (!name) { alert('Vui lòng nhập tên khách hàng!'); return; }
    
    if (editingId) {
        const idx = customers.findIndex(x => x.id === editingId);
        customers[idx] = { ...customers[idx], name, phone, note };
    } else {
        customers.unshift({ id: generateId(), name, phone, note, created: getToday() });
    }
    
    saveData();
    closeCustomerModal();
    renderCustomers();
    updateCustomerSelect();
}

function deleteCustomer(id) {
    if (confirm('Xóa khách hàng này?')) {
        customers = customers.filter(x => x.id !== id);
        saveData();
        renderCustomers();
        updateCustomerSelect();
    }
}

function renderCustomers() {
    const tbody = document.getElementById('customerList');
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Chưa có khách hàng nào</td></tr>';
        return;
    }
    tbody.innerHTML = customers.map(c => `
        <tr class="border-b border-gray-800">
            <td class="py-2">${c.name}</td>
            <td class="py-2">${c.phone || '-'}</td>
            <td class="py-2 text-sm text-gray-400">${c.note || '-'}</td>
            <td class="py-2 text-center text-sm">${c.created}</td>
            <td class="py-2 text-center">
                <button onclick="openCustomerModal('${c.id}')" class="text-yellow-400 text-xs mr-2">Sửa</button>
                <button onclick="deleteCustomer('${c.id}')" class="text-red-400 text-xs">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function updateCustomerSelect() {
    const select = document.getElementById('selectedCustomer');
    select.innerHTML = '<option value="">-- Chọn khách hàng --</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// ===== DỊCH VỤ =====
function openServiceModal(id = null) {
    editingId = id;
    const modal = document.getElementById('serviceModal');
    modal.classList.add('active');
    document.getElementById('serviceModalTitle').textContent = id ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ';
    
    if (id) {
        const s = services.find(x => x.id === id);
        document.getElementById('servImg').value = s.img;
        document.getElementById('servName').value = s.name;
        document.getElementById('servPrice').value = s.price;
    } else {
        document.getElementById('servImg').value = '';
        document.getElementById('servName').value = '';
        document.getElementById('servPrice').value = '';
    }
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
    editingId = null;
}

function saveService() {
    const img = document.getElementById('servImg').value.trim() || '📷';
    const name = document.getElementById('servName').value.trim();
    const price = parseInt(document.getElementById('servPrice').value) || 0;
    
    if (!name || price <= 0) { alert('Vui lòng nhập đủ thông tin!'); return; }
    
    if (editingId) {
        const idx = services.findIndex(x => x.id === editingId);
        services[idx] = { ...services[idx], img, name, price };
    } else {
        services.push({ id: generateId(), img, name, price });
    }
    
    saveData();
    closeServiceModal();
    renderServices();
    renderServiceAdmin();
}

function deleteService(id) {
    if (confirm('Xóa dịch vụ này?')) {
        services = services.filter(x => x.id !== id);
        saveData();
        renderServices();
        renderServiceAdmin();
    }
}

function renderServiceAdmin() {
    const tbody = document.getElementById('serviceAdminList');
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">Chưa có dịch vụ nào</td></tr>';
        return;
    }
    tbody.innerHTML = services.map(s => `
        <tr class="border-b border-gray-800">
            <td class="py-2 text-2xl">${s.img}</td>
            <td class="py-2">${s.name}</td>
            <td class="py-2 text-right text-gold">${formatMoney(s.price)}</td>
            <td class="py-2 text-center">
                <button onclick="openServiceModal('${s.id}')" class="text-yellow-400 text-xs mr-2">Sửa</button>
                <button onclick="deleteService('${s.id}')" class="text-red-400 text-xs">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// ===== GIỎ HÀNG & THANH TOÁN =====
function renderServices(filter = '') {
    const grid = document.getElementById('servicesGrid');
    const filtered = services.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="col-span-3 text-center py-8 text-gray-500">Không tìm thấy dịch vụ</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(s => `
        <div class="service-card bg-input rounded-lg p-4 text-center border border-gray-700 hover:border-gold" onclick="addToCart(${s.id})">
            <div class="text-3xl mb-2">${s.img}</div>
            <h4 class="text-sm font-medium mb-1">${s.name}</h4>
            <p class="text-gold text-sm font-bold">${formatMoney(s.price)}</p>
            <button class="mt-2 text-xs bg-gold/20 text-gold px-2 py-1 rounded">+ Thêm</button>
        </div>
    `).join('');
}

function filterServices() {
    const keyword = document.getElementById('searchInput').value;
    renderServices(keyword);
}

function addToCart(id) {
    const s = services.find(x => x.id === id);
    const exist = cart.find(x => x.id === id);
    if (exist) exist.qty++;
    else cart.push({ ...s, qty: 1 });
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cartItems');
    if (cart.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-sm italic">Chọn dịch vụ...</p>';
        document.getElementById('subtotal').textContent = '0 ₫';
        document.getElementById('totalAmount').textContent = '0 ₫';
        return;
    }
    
    list.innerHTML = cart.map(i => `
        <div class="grid grid-cols-4 gap-2 items-center text-sm">
            <span>${i.name}</span>
            <span class="text-center">${formatMoney(i.price)}</span>
            <span class="text-center">${i.qty}</span>
            <span class="text-right text-gold">${formatMoney(i.price * i.qty)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    document.getElementById('subtotal').textContent = formatMoney(total);
    document.getElementById('totalAmount').textContent = formatMoney(total);
}

function clearCart() {
    cart = [];
    updateCart();
    document.getElementById('noteInput').value = '';
    document.getElementById('selectedCustomer').value = '';
}

function checkout() {
    if (cart.length === 0) { alert('Chưa chọn dịch vụ!'); return; }
    
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const custId = document.getElementById('selectedCustomer').value;
    const custName = custId ? customers.find(c => c.id === custId)?.name : 'Khách vãng lai';
    const note = document.getElementById('noteInput').value.trim();
    const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
    
    const invoice = {
        id: 'HD-' + generateId(),
        customerId: custId || '',
        customerName: custName,
        items: items,
        total: total,
        note: note,
        date: getToday()
    };
    
    invoices.unshift(invoice);
    saveData();
    
    alert(`✅ Thanh toán thành công!\n\nMã hóa đơn: ${invoice.id}\nKhách hàng: ${custName}\nTổng tiền: ${formatMoney(total)}\nNgày: ${invoice.date}`);
    
    clearCart();
}

// ===== HÓA ĐƠN =====
function renderInvoices() {
    const tbody = document.getElementById('invoiceList');
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">Chưa có hóa đơn nào</td></tr>';
        return;
    }
    tbody.innerHTML = invoices.map(inv => `
        <tr class="border-b border-gray-800">
            <td class="py-2 text-sm font-mono">${inv.id}</td>
            <td class="py-2">${inv.customerName}</td>
            <td class="py-2 text-sm text-gray-400 max-w-xs truncate">${inv.items}</td>
            <td class="py-2 text-right text-gold font-bold">${formatMoney(inv.total)}</td>
            <td class="py-2 text-center text-sm">${inv.date}</td>
            <td class="py-2 text-center">
                <button onclick="deleteInvoice('${inv.id}')" class="text-red-400 text-xs">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function deleteInvoice(id) {
    if (confirm('Xóa hóa đơn này?')) {
        invoices = invoices.filter(x => x.id !== id);
        saveData();
        renderInvoices();
    }
}

// ===== BÁO CÁO =====
function renderReports() {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const topService = getTopService();
    
    document.getElementById('totalRevenue').textContent = formatMoney(totalRevenue);
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalInvoices').textContent = invoices.length;
    document.getElementById('topService').textContent = topService || '-';
}

function getTopService() {
    if (invoices.length === 0) return null;
    const count = {};
    invoices.forEach(inv => {
        const names = inv.items.split(', ').map(i => i.split(' x')[0]);
        names.forEach(n => { count[n] = (count[n] || 0) + 1; });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0];
}

// ===== KHỞI TẠO =====
function initApp() {
    renderServices();
    renderCustomers();
    updateCustomerSelect();
    renderInvoices();
    renderServiceAdmin();
    renderReports();
}

// Đóng modal khi nhấn ra ngoài
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        editingId = null;
    }
}
