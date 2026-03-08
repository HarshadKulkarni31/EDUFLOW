/**
 * Shared UI utilities — Toast, Modal, Notifications, Sidebar, Avatar
 */

/* ===================== TOAST ===================== */
const Toast = (() => {
    let container;
    function getContainer() {
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
    function show(message, type = 'info', duration = 3500) {
        const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="font-size:1.1rem;font-weight:700;color:var(--color-${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'})">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
        getContainer().appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 350);
        }, duration);
        return toast;
    }
    return { success: (m) => show(m, 'success'), error: (m) => show(m, 'error'), warning: (m) => show(m, 'warning'), info: (m) => show(m, 'info') };
})();

/* ===================== MODAL ===================== */
const Modal = (() => {
    function create(title, bodyHTML, footerHTML = '') {
        const id = 'modal_' + Date.now();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = id;
        overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="Modal.close('${id}')">✕</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => { if (e.target === overlay) Modal.close(id); });
        requestAnimationFrame(() => overlay.classList.add('active'));
        return id;
    }
    function close(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('active');
        setTimeout(() => el.remove(), 300);
    }
    return { create, close };
})();

/* ===================== NOTIFICATIONS ===================== */
function initNotifications(userId) {
    const btn = document.getElementById('notifBtn');
    const drawer = document.getElementById('notifDrawer');
    const count = document.getElementById('notifCount');
    if (!btn || !drawer) return;

    function renderCount() {
        const n = LMS.Notifications.getUnreadCount(userId);
        if (count) count.textContent = n > 0 ? (n > 9 ? '9+' : n) : '';
    }

    function renderDrawer() {
        const body = document.getElementById('notifDrawerBody');
        if (!body) return;
        const notifs = LMS.Notifications.getByUser(userId);
        if (!notifs.length) {
            body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔔</div><h3>No notifications</h3><p>You are all caught up!</p></div>';
            return;
        }
        const typeIcons = { assignment: '📝', grade: '⭐', announcement: '📢', submission: '📤', message: '💬' };
        body.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead('${n.id}', this)">
        <div class="notif-icon">${typeIcons[n.type] || '🔔'}</div>
        <div>
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${LMS.Helpers.timeAgo(n.timestamp)}</div>
        </div>
      </div>`).join('');
    }

    window.markNotifRead = (id, el) => {
        LMS.Notifications.markRead(id);
        el.classList.remove('unread');
        renderCount();
    };

    btn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        if (isOpen) renderDrawer();
    });

    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !drawer.contains(e.target)) drawer.classList.remove('open');
    });

    document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
        LMS.Notifications.markAllRead(userId);
        renderDrawer(); renderCount();
        Toast.success('All notifications marked as read');
    });

    renderCount();

    // Poll for updates
    setInterval(renderCount, 10000);
}

/* ===================== SIDEBAR ===================== */
function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('active');
    });
    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

/* ===================== TABS ===================== */
function initTabs(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const buttons = container.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
            // Persist active tab in URL hash
            window.history.replaceState(null, null, '#' + btn.dataset.tab);
        });
    });
    // Restore from hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        const btn = container.querySelector(`[data-tab="${hash}"]`);
        if (btn) btn.click();
    } else {
        buttons[0]?.click();
    }
}

/* ===================== AVATAR ===================== */
function avatarHTML(name, size = '') {
    const initials = LMS.Helpers.getInitials(name);
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#38bdf8', '#a855f7', '#ec4899'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return `<div class="avatar ${size}" style="background:linear-gradient(135deg,${color},${color}99)">${initials}</div>`;
}

/* ===================== NAVIGATION BAR INIT ===================== */
function initNavbar(user) {
    const el = document.getElementById('navbarUser');
    if (el) el.innerHTML = `${avatarHTML(user.name)} <span style="font-size:0.85rem;font-weight:600;color:var(--text-secondary)">${user.name.split(' ')[0]}</span>`;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => LMS.Auth.logout());
}

/* ===================== SIDEBAR USER INFO ===================== */
function initSidebarUser(user) {
    const el = document.getElementById('sidebarUser');
    if (!el) return;
    el.innerHTML = `${avatarHTML(user.name)} <div class="user-info"><div class="user-name">${user.name}</div><div class="user-role">${user.role}</div></div>`;
}

/* ===================== SIDEBAR CLASSES ===================== */
function initSidebarClasses(classes, basePath) {
    const el = document.getElementById('sidebarClasses');
    if (!el) return;
    if (!classes.length) { el.innerHTML = '<p class="text-xs text-muted" style="padding:8px 12px">No classes</p>'; return; }
    el.innerHTML = classes.map(c => `
    <a class="class-nav-item" href="${basePath}class.html?id=${c.id}">
      <div class="class-dot" style="background:${c.color}"></div>
      <span>${c.name}</span>
    </a>`).join('');
}

/* ===================== COLOR FOR CLASS ===================== */
function setClassColor(color) {
    document.documentElement.style.setProperty('--class-color', color || '#6366f1');
}

/* ===================== CONFIRM DIALOG ===================== */
function confirmAction(message, onConfirm) {
    const id = Modal.create('Confirm', `<p style="font-size:0.9rem">${message}</p>`,
        `<button class="btn btn-secondary btn-sm" onclick="Modal.close('${id}')">Cancel</button>
     <button class="btn btn-danger btn-sm" id="confirmOkBtn">Confirm</button>`
    );
    setTimeout(() => {
        document.getElementById('confirmOkBtn')?.addEventListener('click', () => {
            Modal.close(id);
            onConfirm();
        });
    }, 50);
}

/* ===================== COPY TO CLIPBOARD ===================== */
function copyText(text) {
    navigator.clipboard?.writeText(text).then(() => Toast.success('Copied to clipboard!')).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); Toast.success('Copied!');
    });
}

/* ===================== NAVBAR TEMPLATE ===================== */
function renderSidebarNotifDrawer(userId) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="notif-drawer" id="notifDrawer">
      <div class="notif-drawer-header">
        <h3 style="font-size:1rem;font-weight:700">Notifications</h3>
        <button class="btn btn-ghost btn-sm" id="markAllReadBtn">Mark all read</button>
      </div>
      <div class="notif-drawer-body" id="notifDrawerBody"></div>
    </div>`);
    initNotifications(userId);
}
