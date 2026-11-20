const STORAGE_KEY = 'NQ_BARBER_APP_DATA_FINAL';

const BANK_NAMES = {
    MB: 'MB Bank',
    VCB: 'Vietcombank',
    TCB: 'Techcombank',
    BIDV: 'BIDV',
    ICB: 'VietinBank',
    ACB: 'ACB',
    VPB: 'VPBank',
    TPB: 'TPBank',
    STB: 'Sacombank',
    VIB: 'VIB',
    MSB: 'MSB',
    OCB: 'OCB',
    SHB: 'SHB',
    AGRI: 'Agribank'
};

const DEFAULT_DATA = {
    users: [
        { username: 'admin', password: '123456', role: 'admin', displayName: 'Quản Trị Viên (Chủ Tiệm)', isRoot: true },
        { username: 'nhanvien', password: '123456', role: 'staff', displayName: 'Nhân Viên Thu Ngân', isRoot: false }
    ],
    shopInfo: {
        name: 'NQ BARBER',
        tagline: 'Đẳng Cấp Phái Mạnh - Chuẩn Phong Cách',
        address: 'NQ Barber Shop - Xem vị trí trực tiếp trên Google Maps',
        bankId: 'MB',
        bankAcc: '0971886269',
        accountHolder: 'NGUYEN MINH QUAN',
        barbers: ['Minh Quân (Master)', 'Hoàng Nam', 'Tuấn Anh', 'Đức Huy']
    },
    services: [
        { id: 'srv-1', name: 'Cắt Tóc Tạo Kiểu VIP', price: 80000, desc: 'Tư vấn + Cắt + Xả sạch + Vuốt sáp (40p)' },
        { id: 'srv-2', name: 'Combo Đế Vương (Full)', price: 150000, desc: 'Cắt VIP + Cạo mặt + Ráy tai + Gội dưỡng sinh' },
        { id: 'srv-3', name: 'Cạo Mặt & Ráy Tai Thư Giãn', price: 50000, desc: 'Khăn nóng + Cạo râu + Lấy ráy tai êm ái' },
        { id: 'srv-4', name: 'Gội Đầu Dưỡng Sinh Cổ Vai Gáy', price: 70000, desc: 'Massage bấm huyệt thư giãn 30 phút' },
        { id: 'srv-5', name: 'Uốn Tóc Hàn Quốc / Premlock', price: 300000, desc: 'Thuốc uốn cao cấp giữ nếp chuẩn form' },
        { id: 'srv-6', name: 'Nhuộm Màu Thời Trang', price: 350000, desc: 'Lên màu chuẩn, bóng mượt, bảo vệ tóc' },
        { id: 'srv-7', name: 'Tẩy Tóc & Nhuộm Bạch Kim', price: 550000, desc: 'Kỹ thuật tẩy an toàn không rát da đầu' },
        { id: 'srv-8', name: 'Đắp Mặt Nạ Than Hoạt Tính', price: 40000, desc: 'Hút mụn cám, sáng da mặt sau khi cắt' }
    ],
    transactions: [
        {
            id: 'tx-101',
            type: 'income',
            title: 'Combo Đế Vương (Full) x1, Đắp Mặt Nạ Than Hoạt Tính x1',
            customer: 'Anh Hoàng Tuấn',
            staff: 'Minh Quân (Master)',
            amount: 190000,
            date: '19/11/2026 18:45'
        },
        {
            id: 'tx-102',
            type: 'income',
            title: 'Uốn Tóc Hàn Quốc / Premlock x1, Cắt Tóc Tạo Kiểu VIP x1',
            customer: 'Bạn Đức Anh',
            staff: 'Hoàng Nam',
            amount: 380000,
            date: '19/11/2026 16:20'
        },
        {
            id: 'tx-103',
            type: 'expense',
            title: 'Nhập 3 hũ sáp vuốt tóc Volcanic Clay + 2 hộp dao lam',
            customer: 'Vật tư tóc (Sáp, gôm, thuốc uốn/nhuộm)',
            staff: 'Admin',
            amount: 420000,
            date: '19/11/2026 10:15'
        }
    ],
    gallery: [
        {
            id: 'img-1',
            caption: 'Không gian ghế cắt sang trọng tại NQ Barber',
            url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'img-2',
            caption: 'Khu vực tạo kiểu & dụng cụ chuyên nghiệp',
            url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'img-3',
            caption: 'Đường cắt Fade sắc nét chuẩn Barber',
            url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'img-4',
            caption: 'Trải nghiệm dịch vụ VIP đẳng cấp phái mạnh',
            url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'
        }
    ]
};

let appData = loadData();
let currentUser = null;
// Map { serviceId: quantity }
let selectedServices = {};
let revealedPasswords = {};

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
                parsed.users = JSON.parse(JSON.stringify(DEFAULT_DATA.users));
            }
            return parsed;
        }
    } catch (e) {
        console.error(e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
        console.error(e);
    }
}

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function getCurrentTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function removeAccents(str) {
    return (str || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function getSelectedServiceItems() {
    const items = [];
    for (const srv of appData.services) {
        const qty = Number(selectedServices[srv.id]) || 0;
        if (qty > 0) {
            items.push({
                ...srv,
                qty: qty,
                subtotal: (Number(srv.price) || 0) * qty
            });
        }
    }
    return items;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const colors = {
        success: 'border-barber-gold bg-barber-dark text-white',
        error: 'border-barber-red bg-barber-dark text-white',
        info: 'border-blue-500 bg-barber-dark text-white'
    };
    const icons = {
        success: '<i class="fa-solid fa-circle-check text-barber-gold text-lg"></i>',
        error: '<i class="fa-solid fa-circle-exclamation text-barber-red text-lg"></i>',
        info: '<i class="fa-solid fa-circle-info text-blue-400 text-lg"></i>'
    };

    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${colors[type] || colors.success}`;
    toast.innerHTML = `${icons[type]}<span class="text-xs sm:text-sm font-medium">${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

// ==========================================
// AUTHENTICATION & ROLE MANAGEMENT
// ==========================================
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim().toLowerCase();
    const p = document.getElementById('login-password').value.trim();
    handleLogin(u, p);
});

function handleLogin(username, password) {
    const account = (appData.users || []).find(
        acc => acc.username.toLowerCase() === username && acc.password === password
    );
    if (account) {
        currentUser = account;
        document.getElementById('login-form').reset();
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        applyRoleUI();
        renderAll();
        showToast(`Chào mừng ${account.displayName} đến với NQ BARBER!`, 'success');
    } else {
        showToast('Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra lại.', 'error');
    }
}

function logout() {
    currentUser = null;
    selectedServices = {};
    revealedPasswords = {};
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    showToast('Đã đăng xuất khỏi hệ thống.', 'info');
}

function applyRoleUI() {
    const isAdmin = currentUser && currentUser.role === 'admin';
    const badge = document.getElementById('user-role-badge');

    if (isAdmin) {
        badge.innerHTML = `<i class="fa-solid fa-crown text-barber-gold"></i> <span class="font-bold text-barber-gold">${currentUser.displayName}</span>`;
        document.getElementById('btn-admin-accounts').classList.remove('hidden');
        document.getElementById('btn-admin-settings').classList.remove('hidden');
        document.getElementById('admin-finance-controls').classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    } else {
        badge.innerHTML = `<i class="fa-solid fa-user-tie text-emerald-400"></i> <span class="font-bold text-white">${currentUser ? currentUser.displayName : 'NHÂN VIÊN'}</span>`;
        document.getElementById('btn-admin-accounts').classList.add('hidden');
        document.getElementById('btn-admin-settings').classList.add('hidden');
        document.getElementById('admin-finance-controls').classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
    }
}

// ==========================================
// ADMIN ACCOUNT & PASSWORD MANAGER
// ==========================================
function openAccountManagerModal() {
    if (!currentUser || currentUser.role !== 'admin') return;
    document.getElementById('add-account-form').reset();
    renderAccountsTable();
    openModal('modal-accounts');
}

function renderAccountsTable() {
    const tbody = document.getElementById('accounts-tbody');
    if (!tbody) return;

    tbody.innerHTML = (appData.users || []).map((u, idx) => {
        const isRevealed = !!revealedPasswords[u.username];
        const isAdminRole = u.role === 'admin';
        return `
            <tr class="hover:bg-barber-dark/70 transition">
                <td class="py-3 px-3.5 font-bold text-white whitespace-nowrap">
                    ${u.username}
                    ${u.isRoot ? '<span class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-barber-gold/20 text-barber-gold">GỐC</span>' : ''}
                </td>
                <td class="py-3 px-3.5 text-gray-200">${u.displayName}</td>
                <td class="py-3 px-3.5 whitespace-nowrap">
                    ${isAdminRole
                        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-barber-gold/20 text-barber-gold border border-barber-gold/40">ADMIN</span>'
                        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">NHÂN VIÊN</span>'}
                </td>
                <td class="py-3 px-3.5">
                    <div class="flex items-center gap-1.5">
                        <div class="relative flex items-center">
                            <input type="${isRevealed ? 'text' : 'password'}" id="pwd-input-${idx}" value="${u.password}"
                                class="w-28 sm:w-32 px-2.5 py-1.5 pr-7 bg-barber-black border border-gray-700 rounded-lg text-xs text-barber-gold font-bold focus:border-barber-gold focus:outline-none">
                            <button type="button" onclick="toggleRevealPassword('${u.username}')"
                                class="absolute right-2 text-gray-400 hover:text-white text-[11px]" title="Hiện/Ẩn mật khẩu">
                                <i class="fa-solid ${isRevealed ? 'fa-eye-slash' : 'fa-eye'}"></i>
                            </button>
                        </div>
                        <button type="button" onclick="updateMemberPassword(${idx})"
                            class="px-2.5 py-1.5 rounded-lg bg-barber-gold hover:bg-barber-goldHover text-barber-black font-extrabold text-[11px] whitespace-nowrap transition shadow">
                            Đổi MK
                        </button>
                    </div>
                </td>
                <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    ${u.isRoot
                        ? '<span class="text-gray-600 text-[11px]" title="Không thể xóa tài khoản Admin gốc"><i class="fa-solid fa-shield"></i></span>'
                        : `<button type="button" onclick="deleteMemberAccount('${u.username}')" class="p-1.5 rounded-lg bg-gray-800 hover:bg-barber-red text-gray-300 hover:text-white transition" title="Xóa tài khoản này">
                            <i class="fa-solid fa-trash"></i>
                           </button>`}
                </td>
            </tr>
        `;
    }).join('');
}

function toggleRevealPassword(username) {
    revealedPasswords[username] = !revealedPasswords[username];
    renderAccountsTable();
}

function updateMemberPassword(idx) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const inputEl = document.getElementById(`pwd-input-${idx}`);
    if (!inputEl) return;

    const newPwd = inputEl.value.trim();
    if (!newPwd || newPwd.length < 4) {
        showToast('Mật khẩu mới phải có ít nhất 4 ký tự!', 'error');
        return;
    }

    const targetUser = appData.users[idx];
    if (!targetUser) return;

    targetUser.password = newPwd;
    if (currentUser.username === targetUser.username) {
        currentUser.password = newPwd;
    }
    saveData();
    renderAccountsTable();
    showToast(`Đã đổi mật khẩu thành công cho "${targetUser.displayName}" (${targetUser.username})!`, 'success');
}

document.getElementById('add-account-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;

    const username = document.getElementById('new-acc-username').value.trim().toLowerCase().replace(/\s+/g, '');
    const displayName = document.getElementById('new-acc-name').value.trim();
    const password = document.getElementById('new-acc-password').value.trim();
    const role = document.getElementById('new-acc-role').value;

    if (!username || !displayName || password.length < 4) {
        showToast('Vui lòng nhập đầy đủ thông tin và mật khẩu tối thiểu 4 ký tự!', 'error');
        return;
    }

    const exists = (appData.users || []).some(u => u.username.toLowerCase() === username);
    if (exists) {
        showToast(`Tên đăng nhập "${username}" đã tồn tại!`, 'error');
        return;
    }

    appData.users.push({
        username,
        password,
        role,
        displayName,
        isRoot: false
    });

    saveData();
    document.getElementById('add-account-form').reset();
    renderAccountsTable();
    showToast(`Đã tạo tài khoản "${username}" cho ${displayName}!`, 'success');
});

function deleteMemberAccount(username) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const target = (appData.users || []).find(u => u.username === username);
    if (!target || target.isRoot) return;

    if (target.username === currentUser.username) {
        showToast('Không thể tự xóa tài khoản đang đăng nhập!', 'error');
        return;
    }

    appData.users = appData.users.filter(u => u.username !== username);
    saveData();
    renderAccountsTable();
    showToast(`Đã xóa tài khoản "${username}".`, 'info');
}

// ==========================================
// RENDER DASHBOARD, SERVICES, BILL & HISTORY
// ==========================================
function renderAll() {
    renderShopHeader();
    renderStats();
    renderServices();
    renderCurrentBill();
    renderTransactions();
    renderGallery();
}

function renderShopHeader() {
    document.getElementById('header-shop-name').textContent = appData.shopInfo.name;
    document.getElementById('header-shop-tagline').textContent = appData.shopInfo.tagline;
    document.getElementById('display-shop-address').textContent = appData.shopInfo.address;

    const barberSelect = document.getElementById('bill-barber');
    barberSelect.innerHTML = appData.shopInfo.barbers
        .map(b => `<option value="${b}">${b}</option>`)
        .join('');
}

function renderStats() {
    let totalRev = 0;
    let totalExp = 0;
    let billCount = 0;
    let expCount = 0;

    appData.transactions.forEach(tx => {
        if (tx.type === 'income') {
            totalRev += Number(tx.amount) || 0;
            billCount++;
        } else {
            totalExp += Number(tx.amount) || 0;
            expCount++;
        }
    });

    const profit = totalRev - totalExp;
    const margin = totalRev > 0 ? Math.round((profit / totalRev) * 100) : 0;

    document.getElementById('stat-revenue').textContent = formatVND(totalRev);
    document.getElementById('stat-expense').textContent = formatVND(totalExp);
    document.getElementById('stat-profit').textContent = formatVND(profit);
    document.getElementById('stat-bill-count').innerHTML = `<i class="fa-solid fa-receipt mr-1"></i>${billCount} hóa đơn dịch vụ`;
    document.getElementById('stat-expense-count').innerHTML = `<i class="fa-solid fa-box-open mr-1"></i>${expCount} khoản chi`;
    document.getElementById('stat-margin').textContent = `Tỷ suất lợi nhuận: ${margin}%`;
}

function renderServices() {
    const grid = document.getElementById('services-grid');
    const isAdmin = currentUser && currentUser.role === 'admin';

    grid.innerHTML = appData.services.map(srv => {
        const qty = Number(selectedServices[srv.id]) || 0;
        const isSelected = qty > 0;
        return `
            <div onclick="incrementServiceQty('${srv.id}')"
                class="cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between relative group select-none
                ${isSelected
                    ? 'bg-barber-gold/15 border-barber-gold shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                    : 'bg-barber-dark border-gray-800 hover:border-barber-gold/50'}">
                <div>
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-bold text-sm sm:text-base ${isSelected ? 'text-barber-gold' : 'text-white'}">${srv.name}</h3>
                        ${isSelected
                            ? `<span class="px-2 py-0.5 rounded-full bg-barber-gold text-barber-black font-extrabold text-xs shrink-0 shadow">x${qty}</span>`
                            : `<div class="w-5 h-5 rounded-md flex items-center justify-center border border-gray-600 text-gray-500 shrink-0 group-hover:border-barber-gold group-hover:text-barber-gold transition">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                               </div>`}
                    </div>
                    <p class="text-xs text-gray-400 mt-1 line-clamp-2">${srv.desc || 'Dịch vụ tiêu chuẩn NQ Barber'}</p>
                </div>

                <div class="mt-3 pt-2.5 border-t border-gray-800/80 flex items-center justify-between gap-2">
                    <span class="font-display text-lg font-bold text-barber-gold">${formatVND(srv.price)}</span>
                    <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                        ${isSelected ? `
                            <div class="inline-flex items-center bg-barber-black border border-barber-gold/50 rounded-lg overflow-hidden">
                                <button type="button" onclick="changeServiceQty('${srv.id}', -1)"
                                    class="w-7 h-7 flex items-center justify-center text-gray-300 hover:bg-barber-red hover:text-white font-bold text-xs transition" title="Giảm số lượng">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span class="px-2.5 text-xs font-extrabold text-barber-gold">${qty}</span>
                                <button type="button" onclick="changeServiceQty('${srv.id}', 1)"
                                    class="w-7 h-7 flex items-center justify-center text-gray-300 hover:bg-barber-gold hover:text-barber-black font-bold text-xs transition" title="Tăng số lượng">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        ` : `
                            <button type="button" onclick="incrementServiceQty('${srv.id}')"
                                class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-barber-gold hover:text-barber-black text-[11px] font-bold text-gray-300 transition">
                                + Chọn
                            </button>
                        `}
                        ${isAdmin ? `
                            <button type="button" onclick="openServiceModal('${srv.id}')" class="p-1.5 rounded-lg bg-gray-800 hover:bg-barber-gold hover:text-barber-black text-gray-300 text-xs transition" title="Sửa dịch vụ">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button type="button" onclick="deleteService('${srv.id}')" class="p-1.5 rounded-lg bg-gray-800 hover:bg-barber-red text-gray-300 hover:text-white text-xs transition" title="Xóa dịch vụ">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function incrementServiceQty(id) {
    selectedServices[id] = (Number(selectedServices[id]) || 0) + 1;
    renderServices();
    renderCurrentBill();
}

function changeServiceQty(id, delta) {
    const nextQty = (Number(selectedServices[id]) || 0) + delta;
    if (nextQty <= 0) {
        delete selectedServices[id];
    } else {
        selectedServices[id] = nextQty;
    }
    renderServices();
    renderCurrentBill();
}

function removeServiceFromBill(id) {
    delete selectedServices[id];
    renderServices();
    renderCurrentBill();
}

function clearCurrentBill() {
    selectedServices = {};
    document.getElementById('bill-customer').value = '';
    renderServices();
    renderCurrentBill();
}

function renderCurrentBill() {
    const listEl = document.getElementById('selected-services-list');
    const selectedItems = getSelectedServiceItems();
    const totalQty = selectedItems.reduce((sum, s) => sum + s.qty, 0);
    const totalAmount = selectedItems.reduce((sum, s) => sum + s.subtotal, 0);

    document.getElementById('selected-count').textContent = totalQty;
    document.getElementById('bill-total-amount').textContent = formatVND(totalAmount);

    if (selectedItems.length === 0) {
        listEl.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-gray-500 py-8 text-center">
                <i class="fa-solid fa-scissors text-2xl mb-2 opacity-40"></i>
                <p class="text-xs">Chưa chọn dịch vụ nào.<br>Vui lòng chọn dịch vụ &amp; số lượng ở bảng bên trái.</p>
            </div>
        `;
        return;
    }

    listEl.innerHTML = selectedItems.map(item => `
        <div class="flex items-center justify-between gap-2 bg-barber-card px-3 py-2.5 rounded-lg border border-gray-800">
            <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-white truncate">${item.name}</p>
                <p class="text-[11px] text-gray-400">
                    ${formatVND(item.price)} x <span class="text-barber-gold font-bold">${item.qty}</span> =
                    <span class="text-barber-gold font-extrabold">${formatVND(item.subtotal)}</span>
                </p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="changeServiceQty('${item.id}', -1)"
                    class="w-6 h-6 rounded bg-barber-dark border border-gray-700 hover:border-barber-red hover:text-barber-red text-gray-300 text-[10px] flex items-center justify-center transition" title="Giảm 1">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <span class="w-6 text-center text-xs font-extrabold text-white">${item.qty}</span>
                <button type="button" onclick="changeServiceQty('${item.id}', 1)"
                    class="w-6 h-6 rounded bg-barber-dark border border-gray-700 hover:border-barber-gold hover:text-barber-gold text-gray-300 text-[10px] flex items-center justify-center transition" title="Tăng 1">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button type="button" onclick="removeServiceFromBill('${item.id}')"
                    class="ml-1 text-gray-500 hover:text-barber-red p-1 transition" title="Xóa dịch vụ này">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// VIETQR CHECKOUT & TRANSFER SUCCESS MODAL
// ==========================================
function openQRCheckoutModal() {
    const selectedItems = getSelectedServiceItems();
    if (selectedItems.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 dịch vụ khách đã làm!', 'error');
        return;
    }

    const customer = document.getElementById('bill-customer').value.trim() || 'Khách lẻ';
    const barber = document.getElementById('bill-barber').value;
    const total = selectedItems.reduce((sum, s) => sum + s.subtotal, 0);

    document.getElementById('qr-customer-info').textContent = `Khách: ${customer} • Thợ thực hiện: ${barber}`;
    document.getElementById('qr-total-display').textContent = formatVND(total);

    const bankId = appData.shopInfo.bankId || 'MB';
    const bankAcc = appData.shopInfo.bankAcc || '0971886269';
    const holder = (appData.shopInfo.accountHolder || 'NGUYEN MINH QUAN').toUpperCase();
    const bankDisplay = BANK_NAMES[bankId] || bankId;

    document.getElementById('qr-bank-info').textContent = `${bankDisplay} • STK: ${bankAcc}`;
    document.getElementById('qr-holder-info').textContent = holder;

    const serviceNamesClean = removeAccents(selectedItems.map(s => `${s.name} x${s.qty}`).join(', '));
    const rawInfo = `NQ BARBER ${removeAccents(customer)} - ${serviceNamesClean}`.slice(0, 50);
    document.getElementById('qr-note-display').textContent = `ND: ${rawInfo}`;

    document.getElementById('qr-services-summary').innerHTML = selectedItems.map((s, idx) => `
        <div class="flex items-center justify-between text-gray-300">
            <span>${idx + 1}. ${s.name} <strong class="text-white">(x${s.qty})</strong></span>
            <span class="font-semibold text-barber-gold">${formatVND(s.subtotal)}</span>
        </div>
    `).join('');

    // Generate Official VietQR Image URL
    const vietQrUrl = `https://img.vietqr.io/image/${encodeURIComponent(bankId)}-${encodeURIComponent(bankAcc)}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(rawInfo)}&accountName=${encodeURIComponent(holder)}`;

    const imgEl = document.getElementById('vietqr-img');
    const fallbackEl = document.getElementById('qrcode-fallback');

    imgEl.classList.remove('hidden');
    fallbackEl.classList.add('hidden');
    fallbackEl.innerHTML = '';

    imgEl.onerror = function() {
        imgEl.classList.add('hidden');
        fallbackEl.classList.remove('hidden');
        try {
            new QRCode(fallbackEl, {
                text: `VIETQR|${bankId}|${bankAcc}|${total}|${rawInfo}`,
                width: 210,
                height: 210,
                colorDark: '#0A0A0A',
                colorLight: '#FFFFFF',
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (err) {
            console.error(err);
        }
    };

    imgEl.src = vietQrUrl;
    openModal('modal-qr');
}

function confirmBillPayment() {
    const selectedItems = getSelectedServiceItems();
    if (selectedItems.length === 0) return;

    const customer = document.getElementById('bill-customer').value.trim() || 'Khách lẻ';
    const barber = document.getElementById('bill-barber').value;
    const total = selectedItems.reduce((sum, s) => sum + s.subtotal, 0);
    const serviceTitles = selectedItems.map(s => `${s.name} x${s.qty}`).join(', ');
    const txId = 'tx-' + Date.now();
    const txTime = getCurrentTimestamp();

    const newTx = {
        id: txId,
        type: 'income',
        title: serviceTitles,
        customer: customer,
        staff: barber,
        amount: total,
        date: txTime
    };

    appData.transactions.unshift(newTx);
    saveData();
    closeModal('modal-qr');

    // Populate Transfer Success Receipt Modal
    document.getElementById('success-tx-amount').textContent = formatVND(total);
    document.getElementById('success-tx-id').textContent = '#' + txId.toUpperCase();
    document.getElementById('success-tx-customer').textContent = customer;
    document.getElementById('success-tx-staff').textContent = barber;
    document.getElementById('success-tx-time').textContent = txTime;
    document.getElementById('success-tx-services').textContent = serviceTitles;

    clearCurrentBill();
    renderStats();
    renderTransactions();
    openModal('modal-transfer-success');
    showToast(`Chuyển khoản đã thành công! Đã cộng ${formatVND(total)} vào doanh thu.`, 'success');
}

// ==========================================
// TRANSACTIONS TABLE & EXPENSE FORM
// ==========================================
function renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    const search = (document.getElementById('tx-search').value || '').toLowerCase();
    const filter = document.getElementById('tx-filter').value;
    const isAdmin = currentUser && currentUser.role === 'admin';

    const filtered = appData.transactions.filter(tx => {
        const matchType = filter === 'all' || tx.type === filter;
        const matchSearch =
            tx.title.toLowerCase().includes(search) ||
            (tx.customer || '').toLowerCase().includes(search) ||
            (tx.staff || '').toLowerCase().includes(search);
        return matchType && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-500 text-xs">Không tìm thấy giao dịch phù hợp.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(tx => {
        const isIncome = tx.type === 'income';
        return `
            <tr class="hover:bg-barber-dark/70 transition">
                <td class="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">${tx.date}</td>
                <td class="py-3.5 px-4 whitespace-nowrap">
                    ${isIncome
                        ? '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">+ THU DỊCH VỤ</span>'
                        : '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-barber-red/15 text-barber-red border border-barber-red/30">- CHI TIÊU</span>'}
                </td>
                <td class="py-3.5 px-4">
                    <p class="font-semibold text-white text-xs sm:text-sm">${tx.title}</p>
                    <p class="text-[11px] text-gray-400">${isIncome ? 'Khách hàng: ' : 'Danh mục: '}${tx.customer || 'N/A'}</p>
                </td>
                <td class="py-3.5 px-4 text-xs text-gray-300 whitespace-nowrap">${tx.staff}</td>
                <td class="py-3.5 px-4 text-right font-display text-base font-bold whitespace-nowrap ${isIncome ? 'text-barber-gold' : 'text-barber-red'}">
                    ${isIncome ? '+' : '-'}${formatVND(tx.amount)}
                </td>
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                    ${isAdmin ? `
                        <div class="inline-flex items-center gap-1.5">
                            <button type="button" onclick="openEditTxModal('${tx.id}')" class="p-1.5 rounded-lg bg-gray-800 hover:bg-barber-gold hover:text-barber-black text-gray-300 text-xs transition" title="Admin sửa số tiền">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" onclick="deleteTransaction('${tx.id}')" class="p-1.5 rounded-lg bg-gray-800 hover:bg-barber-red text-gray-300 hover:text-white text-xs transition" title="Admin xóa giao dịch">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ` : `<span class="text-[11px] text-gray-600"><i class="fa-solid fa-lock"></i></span>`}
                </td>
            </tr>
        `;
    }).join('');
}

function openExpenseModal() {
    document.getElementById('expense-form').reset();
    openModal('modal-expense');
}

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('exp-category').value;
    const desc = document.getElementById('exp-desc').value.trim();
    const amount = Number(document.getElementById('exp-amount').value);

    appData.transactions.unshift({
        id: 'tx-' + Date.now(),
        type: 'expense',
        title: desc,
        customer: category,
        staff: currentUser ? currentUser.displayName : 'Nhân viên',
        amount: amount,
        date: getCurrentTimestamp()
    });

    saveData();
    closeModal('modal-expense');
    renderStats();
    renderTransactions();
    showToast(`Đã ghi nhận khoản chi ${formatVND(amount)}!`, 'info');
});

// ==========================================
// ADMIN CONTROLS (SERVICES, TX, DIRECT BALANCE, SETTINGS)
// ==========================================
function openServiceModal(id = null) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const form = document.getElementById('service-form');
    form.reset();

    if (id) {
        const srv = appData.services.find(s => s.id === id);
        if (!srv) return;
        document.getElementById('modal-service-title').textContent = 'Chỉnh Sửa Dịch Vụ';
        document.getElementById('srv-id').value = srv.id;
        document.getElementById('srv-name').value = srv.name;
        document.getElementById('srv-price').value = srv.price;
        document.getElementById('srv-desc').value = srv.desc || '';
    } else {
        document.getElementById('modal-service-title').textContent = 'Thêm Dịch Vụ Mới';
        document.getElementById('srv-id').value = '';
    }
    openModal('modal-service');
}

document.getElementById('service-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('srv-id').value;
    const name = document.getElementById('srv-name').value.trim();
    const price = Number(document.getElementById('srv-price').value);
    const desc = document.getElementById('srv-desc').value.trim();

    if (id) {
        const idx = appData.services.findIndex(s => s.id === id);
        if (idx > -1) appData.services[idx] = { id, name, price, desc };
        showToast('Đã cập nhật dịch vụ!', 'success');
    } else {
        appData.services.push({ id: 'srv-' + Date.now(), name, price, desc });
        showToast('Đã thêm dịch vụ mới!', 'success');
    }

    saveData();
    closeModal('modal-service');
    renderServices();
    renderCurrentBill();
});

function deleteService(id) {
    if (!currentUser || currentUser.role !== 'admin') return;
    appData.services = appData.services.filter(s => s.id !== id);
    delete selectedServices[id];
    saveData();
    renderServices();
    renderCurrentBill();
    showToast('Đã xóa dịch vụ khỏi bảng giá.', 'info');
}

function openEditTxModal(id) {
    if (!currentUser || currentUser.role !== 'admin') return;
    const tx = appData.transactions.find(t => t.id === id);
    if (!tx) return;
    document.getElementById('edit-tx-id').value = tx.id;
    document.getElementById('edit-tx-title').value = tx.title;
    document.getElementById('edit-tx-customer').value = tx.customer || '';
    document.getElementById('edit-tx-amount').value = tx.amount;
    openModal('modal-edit-tx');
}

document.getElementById('edit-tx-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-tx-id').value;
    const idx = appData.transactions.findIndex(t => t.id === id);
    if (idx > -1) {
        appData.transactions[idx].title = document.getElementById('edit-tx-title').value.trim();
        appData.transactions[idx].customer = document.getElementById('edit-tx-customer').value.trim();
        appData.transactions[idx].amount = Number(document.getElementById('edit-tx-amount').value);
        saveData();
        renderStats();
        renderTransactions();
        showToast('Admin đã cập nhật số tiền & thông tin giao dịch!', 'success');
    }
    closeModal('modal-edit-tx');
});

function deleteTransaction(id) {
    if (!currentUser || currentUser.role !== 'admin') return;
    appData.transactions = appData.transactions.filter(t => t.id !== id);
    saveData();
    renderStats();
    renderTransactions();
    showToast('Đã xóa giao dịch khỏi lịch sử.', 'info');
}

function openDirectAdjustModal() {
    if (!currentUser || currentUser.role !== 'admin') return;
    let rev = 0;
    let exp = 0;
    appData.transactions.forEach(t => {
        if (t.type === 'income') rev += Number(t.amount) || 0;
        else exp += Number(t.amount) || 0;
    });
    document.getElementById('adj-revenue').value = rev;
    document.getElementById('adj-expense').value = exp;
    openModal('modal-direct-adjust');
}

document.getElementById('direct-adjust-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const targetRev = Number(document.getElementById('adj-revenue').value);
    const targetExp = Number(document.getElementById('adj-expense').value);

    let currentRev = 0;
    let currentExp = 0;
    appData.transactions.forEach(t => {
        if (t.type === 'income') currentRev += Number(t.amount) || 0;
        else currentExp += Number(t.amount) || 0;
    });

    const diffRev = targetRev - currentRev;
    const diffExp = targetExp - currentExp;

    if (diffRev !== 0) {
        appData.transactions.unshift({
            id: 'tx-adj-' + Date.now(),
            type: 'income',
            title: 'Admin điều chỉnh số dư doanh thu trực tiếp',
            customer: 'Điều chỉnh hệ thống',
            staff: 'Admin',
            amount: diffRev,
            date: getCurrentTimestamp()
        });
    }

    if (diffExp !== 0) {
        appData.transactions.unshift({
            id: 'tx-adj-exp-' + (Date.now() + 1),
            type: 'expense',
            title: 'Admin điều chỉnh số dư chi tiêu trực tiếp',
            customer: 'Điều chỉnh hệ thống',
            staff: 'Admin',
            amount: diffExp,
            date: getCurrentTimestamp()
        });
    }

    saveData();
    closeModal('modal-direct-adjust');
    renderStats();
    renderTransactions();
    showToast('Đã cập nhật tổng số tiền quỹ tiệm theo thiết lập của Admin!', 'success');
});

function openShopSettingsModal() {
    if (!currentUser || currentUser.role !== 'admin') return;
    document.getElementById('set-shop-name').value = appData.shopInfo.name;
    document.getElementById('set-shop-tagline').value = appData.shopInfo.tagline;
    document.getElementById('set-shop-address').value = appData.shopInfo.address;
    document.getElementById('set-bank-id').value = appData.shopInfo.bankId || 'MB';
    document.getElementById('set-bank-acc').value = appData.shopInfo.bankAcc || '0971886269';
    document.getElementById('set-bank-holder').value = appData.shopInfo.accountHolder || 'NGUYEN MINH QUAN';
    document.getElementById('set-barbers').value = appData.shopInfo.barbers.join(', ');
    openModal('modal-shop-settings');
}

document.getElementById('shop-settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.shopInfo.name = document.getElementById('set-shop-name').value.trim() || 'NQ BARBER';
    appData.shopInfo.tagline = document.getElementById('set-shop-tagline').value.trim();
    appData.shopInfo.address = document.getElementById('set-shop-address').value.trim();
    appData.shopInfo.bankId = document.getElementById('set-bank-id').value;
    appData.shopInfo.bankAcc = document.getElementById('set-bank-acc').value.trim();
    appData.shopInfo.accountHolder = removeAccents(document.getElementById('set-bank-holder').value.trim()).toUpperCase();

    const barberList = document.getElementById('set-barbers').value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    if (barberList.length > 0) appData.shopInfo.barbers = barberList;

    saveData();
    closeModal('modal-shop-settings');
    renderShopHeader();
    showToast('Đã lưu cấu hình tiệm & tài khoản ngân hàng VietQR!', 'success');
});

function resetDemoData() {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
    closeModal('modal-shop-settings');
    renderAll();
    showToast('Đã khôi phục toàn bộ dữ liệu mặc định ban đầu!', 'info');
}

// ==========================================
// GALLERY & LIGHTBOX
// ==========================================
function renderGallery() {
    const grid = document.getElementById('shop-gallery-grid');
    const isAdmin = currentUser && currentUser.role === 'admin';

    grid.innerHTML = appData.gallery.map(img => `
        <div class="relative group rounded-xl overflow-hidden border border-gray-800 aspect-video bg-barber-dark cursor-pointer"
            onclick="openLightbox('${img.url}', '${img.caption.replace(/'/g, "\'")}')">
            <img src="${img.url}" alt="${img.caption}" loading="lazy"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition"></div>
            <p class="absolute bottom-2 left-2.5 right-2.5 text-[11px] font-medium text-white line-clamp-1">${img.caption}</p>
            ${isAdmin ? `
                <button type="button" onclick="event.stopPropagation(); deleteGalleryPhoto('${img.id}')"
                    class="absolute top-2 right-2 w-7 h-7 rounded-full bg-barber-red/90 hover:bg-barber-red text-white text-xs flex items-center justify-center shadow-lg transition"
                    title="Xóa ảnh">
                    <i class="fa-solid fa-trash"></i>
                </button>
            ` : ''}
        </div>
    `).join('');
}

function openAddPhotoModal() {
    document.getElementById('add-photo-form').reset();
    openModal('modal-add-photo');
}

document.getElementById('add-photo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const caption = document.getElementById('photo-caption').value.trim();
    const url = document.getElementById('photo-url').value.trim();
    appData.gallery.unshift({ id: 'img-' + Date.now(), caption, url });
    saveData();
    closeModal('modal-add-photo');
    renderGallery();
    showToast('Đã thêm ảnh mới vào bộ sưu tập tiệm!', 'success');
});

function deleteGalleryPhoto(id) {
    appData.gallery = appData.gallery.filter(g => g.id !== id);
    saveData();
    renderGallery();
    showToast('Đã xóa ảnh khỏi bộ sưu tập.', 'info');
}

function openLightbox(url, caption) {
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox-caption').textContent = caption;
    openModal('modal-lightbox');
}
