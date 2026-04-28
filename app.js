// ============================================
// ФАНИС PWA v2.5 — ВСЕ ФИКСЫ
// ============================================

const API_URL = 'https://fanis-api.onrender.com';

const App = {
    data: { breakdowns: [], errors: [], contacts: {} },
    currentBreakdown: null,
    currentError: null,
    currentSystem: null,
    history: [],
    isAdmin: false,
    editingId: null,

    async init() {
        await this.loadData();
        this.setupServiceWorker();
        this.showSplash();
    },

    async loadData() {
        try {
            const bdResponse = await fetch(`${API_URL}/api/breakdowns`);
            if (bdResponse.ok) this.data.breakdowns = await bdResponse.json();

            const contactsResponse = await fetch(`${API_URL}/api/contacts`);
            if (contactsResponse.ok) this.data.contacts = await contactsResponse.json();
        } catch (e) {
            this.loadFromCache();
            this.showToast('⚠️ Офлайн-режим');
        }
        this.saveToCache();
    },

    saveToCache() {
        localStorage.setItem('fanis_cache', JSON.stringify(this.data));
    },

    loadFromCache() {
        const cached = localStorage.getItem('fanis_cache');
        if (cached) this.data = JSON.parse(cached);
    },

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    },

    showSplash() {
        setTimeout(() => this.goTo('home'), 2500);
    },

    goTo(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId + '-screen');
        if (screen) screen.classList.add('active');
        
        if (screenId !== 'splash') this.history.push(screenId);
        
        // Рендеры
        if (screenId === 'breakdowns') this.renderBreakdowns();
        if (screenId === 'systems') this.renderSystems();
        if (screenId === 'admin') this.updateAdminCounts();
        if (screenId === 'admin-breakdowns') this.renderAdminBreakdowns();
        if (screenId === 'admin-errors') this.renderAdminErrors();
        if (screenId === 'admin-contacts') this.loadContacts();
        if (screenId === 'admin-password') this.loadPasswordScreen();
    },

    goBack() {
        this.history.pop();
        const prev = this.history.pop() || 'home';
        this.goTo(prev);
    },

    // ========== ВИДЕО ==========
    playVideo(url) {
        const container = document.getElementById('video-container');
        let embedUrl = '';

        if (url.includes('rutube.ru')) {
            // Обычное видео: rutube.ru/video/xxx/
            let match = url.match(/video\/([a-f0-9]+)/i);
            // Shorts: rutube.ru/shorts/xxx/
            if (!match) match = url.match(/shorts\/([a-f0-9]+)/i);
            // Плейлист с video: rutube.ru/play/embed/xxx
            if (!match) match = url.match(/\/([a-f0-9]{20,})/i);
            
            if (match) embedUrl = `https://rutube.ru/play/embed/${match[1]}`;
        } 
        else if (url.includes('vk.com') || url.includes('vkvideo.ru')) {
            const match = url.match(/video(-?\d+)_(-?\d+)/);
            if (match) embedUrl = `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`;
        }
        else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        }

        if (embedUrl) {
            container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay; encrypted-media" style="width:100%;height:100%;border:none;"></iframe>`;
            document.getElementById('video-modal').classList.add('active');
        } else {
            this.showToast('Не удалось открыть видео. Проверьте ссылку.');
            console.log('Video URL failed:', url);
        }
    },

    closeVideo() {
        document.getElementById('video-modal').classList.remove('active');
        document.getElementById('video-container').innerHTML = '';
    },

    // ========== РЕНДЕРЫ ==========
    renderBreakdowns() {
        const grid = document.getElementById('breakdowns-grid');
        const active = this.data.breakdowns.filter(b => b.active !== false);
        
        if (active.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:40px;">Нет поломок</p>';
            return;
        }

        grid.innerHTML = active.map(b => `
            <div class="grid-item" onclick="app.openBreakdown(${b.id})">
                <span class="emoji">${b.emoji || '🔧'}</span>
                <span class="name">${b.name}</span>
            </div>
        `).join('');
    },

    openBreakdown(id) {
        const bd = this.data.breakdowns.find(b => b.id === id);
        if (!bd) return;
        this.currentBreakdown = bd;

        document.getElementById('bd-card-title').textContent = bd.name + ' ' + (bd.emoji || '🔧');
        const contact = this.data.contacts[bd.contact] || this.data.contacts.fanis || '';
        const contactName = bd.contact === 'vildan' ? 'Вильдану' : 'Фанису';

        let html = '';
        if (bd.image_url) html += `<div class="card-mem"><img src="${bd.image_url}" alt="мем" loading="lazy"></div>`;
        
        if (bd.video_url) {
            html += `
                <div class="card-video-thumb" onclick="app.playVideo('${bd.video_url.replace(/'/g, "\\'")}')">
                    <span class="play-icon">▶️</span>
                    <span class="video-label">▶️ Смотреть видео</span>
                </div>
            `;
        }

        html += `
            <div class="card-section">
                <h3>📋 Пошаговая инструкция</h3>
                <ol>${(bd.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
        `;

        if (bd.extra) {
            html += `
                <div class="card-section card-extra">
                    <h3>💡 Фишка</h3>
                    <p>${bd.extra}</p>
                </div>
            `;
        }

        html += `
            <a href="tel:${contact}" class="action-btn btn-call">📞 Позвонить ${contactName}</a>
            <button class="action-btn btn-back" onclick="app.goTo('breakdowns')">⬅️ Назад в Поломки</button>
            <button class="action-btn btn-start" onclick="app.goTo('home')">🏠 В начало</button>
        `;

        document.getElementById('bd-card-content').innerHTML = html;
        this.goTo('breakdown-card');
    },

    renderSystems() {
        const systems = ['UMAR', 'CLE', 'UMAR_new', 'CLE_new'];
        const grid = document.getElementById('systems-grid');
        grid.innerHTML = systems.map(s => `
            <div class="grid-item" onclick="app.openSystem('${s}')">
                <span class="name">${s}</span>
            </div>
        `).join('');
    },

    async openSystem(system) {
        this.currentSystem = system;
        document.getElementById('errors-system-title').textContent = system + ' — Коды ошибок';
        try {
            const response = await fetch(`${API_URL}/api/errors/${system}`);
            if (response.ok) {
                const errors = await response.json();
                const grid = document.getElementById('errors-grid');
                grid.innerHTML = errors.length === 0 
                    ? '<p style="color:var(--text-secondary);text-align:center;padding:20px;">Нет ошибок</p>'
                    : errors.map(e => `
                        <div class="grid-item" onclick="app.openError(${e.id})">
                            <span class="name">${e.code}</span>
                        </div>
                    `).join('');
                this.goTo('errors');
            }
        } catch (e) {
            this.showToast('❌ Ошибка загрузки');
        }
    },

    openError(id) {
        const err = this.data.errors.find(e => e.id === id);
        if (!err) return;
        this.currentError = err;
        document.getElementById('err-card-title').textContent = err.code;
        const contact = this.data.contacts[err.contact] || this.data.contacts.fanis || '';
        const contactName = err.contact === 'vildan' ? 'Вильдану' : 'Фанису';

        let html = '';
        if (err.image_url) html += `<div class="card-mem"><img src="${err.image_url}" alt="мем" loading="lazy"></div>`;
        html += `
            <div class="card-section"><h3>❌ Описание</h3><p>${err.description}</p></div>
        `;
        if (err.period) html += `<div class="card-section"><h3>⏰ Период</h3><p>${err.period}</p></div>`;
        html += `
            <div class="card-section">
                <h3>🔧 Решение</h3>
                <ol>${(err.solution || []).map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
        `;
        html += `
            <a href="tel:${contact}" class="action-btn btn-call">📞 Позвонить ${contactName}</a>
            <button class="action-btn btn-back" onclick="app.goTo('errors')">⬅️ Назад</button>
            <button class="action-btn btn-start" onclick="app.goTo('home')">🏠 В начало</button>
        `;
        document.getElementById('err-card-content').innerHTML = html;
        this.goTo('error-card');
    },

    // ========== АДМИНКА (ФИКС: всегда работает) ==========
    toggleAdmin() {
        // Фикс: всегда показываем логин, если не админ
        if (!this.isAdmin) {
            this.goTo('admin-login');
        } else {
            this.isAdmin = false;
            this.goTo('home');
        }
    },

    togglePasswordVisibility() {
        const input = document.getElementById('admin-password');
        const btn = document.getElementById('password-toggle-btn');
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    },

    async checkAdminPassword() {
        const pass = document.getElementById('admin-password').value;
        try {
            const response = await fetch(`${API_URL}/api/admin/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pass })
            });
            const result = await response.json();
            if (result.valid) {
                this.isAdmin = true;
                document.getElementById('admin-password').value = '';
                this.goTo('admin');
                this.showToast('✅ Вход выполнен');
            } else {
                this.showToast('❌ Неверный пароль');
            }
        } catch (e) {
            this.showToast('❌ Ошибка сервера');
        }
    },

    updateAdminCounts() {
        document.getElementById('admin-bd-count').textContent = this.data.breakdowns.length;
        document.getElementById('admin-err-count').textContent = this.data.errors.length;
    },

    showAdminSection(section) {
        this.goTo('admin-' + section);
    },

    // ========== АДМИН: ПОЛОМКИ + СОРТИРОВКА ==========
    async renderAdminBreakdowns() {
        try {
            const response = await fetch(`${API_URL}/api/breakdowns/all`);
            if (response.ok) this.data.breakdowns = await response.json();
        } catch (e) {}
        
        const list = document.getElementById('admin-bd-list');
        if (this.data.breakdowns.length === 0) {
            list.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;">Нет поломок. Нажмите ➕</p>';
            return;
        }

        list.innerHTML = this.data.breakdowns.map((b, index) => `
            <div class="admin-list-item" style="display:flex;align-items:center;gap:8px;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                    <button onclick="app.moveBreakdown(${b.id}, -1)" style="background:var(--bg-input);border:none;color:var(--text-secondary);padding:2px 6px;border-radius:4px;font-size:12px;cursor:pointer;">↑</button>
                    <button onclick="app.moveBreakdown(${b.id}, 1)" style="background:var(--bg-input);border:none;color:var(--text-secondary);padding:2px 6px;border-radius:4px;font-size:12px;cursor:pointer;">↓</button>
                </div>
                <div style="flex:1;" onclick="app.editBreakdown(${b.id})">
                    <span class="item-emoji">${b.emoji || '🔧'}</span>
                    <div class="item-info">
                        <div class="item-name">${b.name}</div>
                        <div class="item-meta">${(b.steps || []).length} шагов · ${b.video_url ? '🎬' : ''} ${b.extra ? '💡' : ''}</div>
                    </div>
                </div>
                <span class="item-status ${b.active !== false ? '' : 'inactive'}">${b.active !== false ? 'Активно' : 'Скрыто'}</span>
            </div>
        `).join('');
    },

    async moveBreakdown(id, direction) {
        const idx = this.data.breakdowns.findIndex(b => b.id === id);
        if (idx === -1) return;
        
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= this.data.breakdowns.length) return;
        
        const temp = this.data.breakdowns[idx];
        this.data.breakdowns[idx] = this.data.breakdowns[newIdx];
        this.data.breakdowns[newIdx] = temp;
        
        const order = this.data.breakdowns.map((b, i) => ({ id: b.id, sort_order: i }));
        
        try {
            await fetch(`${API_URL}/api/breakdowns/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
            this.showToast(direction === -1 ? '↑ Перемещено' : '↓ Перемещено');
        } catch (e) {
            this.showToast('❌ Ошибка сохранения порядка');
        }
        
        this.renderAdminBreakdowns();
    },

    editBreakdown(id = null) {
        this.editingId = id;
        const bd = id ? this.data.breakdowns.find(b => b.id === id) : null;
        document.getElementById('bd-edit-title').textContent = bd ? 'Редактировать' : 'Новая поломка';
        document.getElementById('bd-edit-name').value = bd ? bd.name : '';
        document.getElementById('bd-edit-emoji').value = bd ? bd.emoji : '';
        document.getElementById('bd-edit-steps').value = bd ? (bd.steps || []).join('\n') : '';
        document.getElementById('bd-edit-video').value = bd ? bd.video_url : '';
        document.getElementById('bd-edit-image').value = bd ? bd.image_url : '';
        document.getElementById('bd-edit-extra').value = bd ? bd.extra : '';
        document.getElementById('bd-edit-contact').value = bd ? bd.contact : 'fanis';
        document.getElementById('bd-edit-active').value = bd ? String(bd.active !== false) : 'true';
        document.getElementById('bd-delete-btn').style.display = bd ? 'block' : 'none';
        this.goTo('admin-bd-edit');
    },

    async saveBreakdown() {
        const name = document.getElementById('bd-edit-name').value.trim();
        if (!name) { this.showToast('❌ Введите название'); return; }

        const steps = document.getElementById('bd-edit-steps').value.split('\n').map(s => s.trim()).filter(s => s);

        const data = {
            name: name,
            emoji: document.getElementById('bd-edit-emoji').value.trim() || '🔧',
            steps: steps,
            video_url: document.getElementById('bd-edit-video').value.trim(),
            image_url: document.getElementById('bd-edit-image').value.trim(),
            extra: document.getElementById('bd-edit-extra').value.trim(),
            contact: document.getElementById('bd-edit-contact').value,
            active: document.getElementById('bd-edit-active').value === 'true'
        };

        try {
            const url = this.editingId ? `${API_URL}/api/breakdowns/${this.editingId}` : `${API_URL}/api/breakdowns`;
            const method = this.editingId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showToast('✅ Сохранено');
                await this.loadData();
                this.goTo('admin-breakdowns');
            } else {
                const text = await response.text();
                this.showToast('❌ Ошибка ' + response.status);
            }
        } catch (e) {
            this.showToast('❌ Нет связи с сервером');
        }
    },

    async deleteBreakdown() {
        if (!this.editingId || !confirm('Удалить?')) return;
        try {
            await fetch(`${API_URL}/api/breakdowns/${this.editingId}`, { method: 'DELETE' });
            this.showToast('🗑️ Удалено');
            await this.loadData();
            this.goTo('admin-breakdowns');
        } catch (e) {
            this.showToast('❌ Ошибка удаления');
        }
    },

    // ========== АДМИН: ОШИБКИ ==========
    async renderAdminErrors() {
        try {
            const response = await fetch(`${API_URL}/api/errors/all`);
            if (response.ok) this.data.errors = await response.json();
        } catch (e) {}
        
        const list = document.getElementById('admin-err-list');
        list.innerHTML = this.data.errors.map(e => `
            <div class="admin-list-item" onclick="app.editError(${e.id})">
                <div class="item-info">
                    <div class="item-name">${e.code} · ${e.system}</div>
                    <div class="item-meta">${e.description}</div>
                </div>
                <span class="item-status ${e.active !== false ? '' : 'inactive'}">${e.active !== false ? 'Активно' : 'Скрыто'}</span>
            </div>
        `).join('');
    },

    editError(id = null) {
        this.editingId = id;
        const err = id ? this.data.errors.find(e => e.id === id) : null;
        document.getElementById('err-edit-title').textContent = err ? 'Редактировать' : 'Новая ошибка';
        document.getElementById('err-edit-system').value = err ? err.system : 'UMAR';
        document.getElementById('err-edit-code').value = err ? err.code : '';
        document.getElementById('err-edit-desc').value = err ? err.description : '';
        document.getElementById('err-edit-period').value = err ? err.period : '';
        document.getElementById('err-edit-solution').value = err ? (err.solution || []).join('\n') : '';
        document.getElementById('err-edit-image').value = err ? err.image_url : '';
        document.getElementById('err-edit-contact').value = err ? err.contact : 'fanis';
        document.getElementById('err-edit-active').value = err ? String(err.active !== false) : 'true';
        document.getElementById('err-delete-btn').style.display = err ? 'block' : 'none';
        this.goTo('admin-err-edit');
    },

    async saveError() {
        const code = document.getElementById('err-edit-code').value.trim();
        if (!code) { this.showToast('❌ Введите код'); return; }

        const solution = document.getElementById('err-edit-solution').value.split('\n').map(s => s.trim()).filter(s => s);

        const data = {
            system: document.getElementById('err-edit-system').value,
            code: code,
            description: document.getElementById('err-edit-desc').value.trim(),
            period: document.getElementById('err-edit-period').value.trim(),
            solution: solution,
            image_url: document.getElementById('err-edit-image').value.trim(),
            contact: document.getElementById('err-edit-contact').value,
            active: document.getElementById('err-edit-active').value === 'true'
        };

        try {
            const url = this.editingId ? `${API_URL}/api/errors/${this.editingId}` : `${API_URL}/api/errors`;
            const method = this.editingId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showToast('✅ Сохранено');
                await this.loadData();
                this.goTo('admin-errors');
            } else {
                this.showToast('❌ Ошибка ' + response.status);
            }
        } catch (e) {
            this.showToast('❌ Нет связи');
        }
    },

    async deleteError() {
        if (!this.editingId || !confirm('Удалить?')) return;
        try {
            await fetch(`${API_URL}/api/errors/${this.editingId}`, { method: 'DELETE' });
            this.showToast('🗑️ Удалено');
            await this.loadData();
            this.goTo('admin-errors');
        } catch (e) {
            this.showToast('❌ Ошибка');
        }
    },

    // ========== КОНТАКТЫ ==========
    loadContacts() {
        document.getElementById('contact-fanis').value = this.data.contacts.fanis || '';
        document.getElementById('contact-vildan').value = this.data.contacts.vildan || '';
    },

    async saveContacts() {
        const fanis = document.getElementById('contact-fanis').value.trim();
        const vildan = document.getElementById('contact-vildan').value.trim();

        try {
            const [r1, r2] = await Promise.all([
                fetch(`${API_URL}/api/contacts/fanis`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: fanis })
                }),
                fetch(`${API_URL}/api/contacts/vildan`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: vildan })
                })
            ]);

            if (r1.ok && r2.ok) {
                this.data.contacts.fanis = fanis;
                this.data.contacts.vildan = vildan;
                this.saveToCache();
                this.showToast('✅ Контакты сохранены');
            } else {
                this.showToast('❌ Ошибка сохранения');
            }
        } catch (e) {
            this.showToast('❌ Ошибка');
        }
    },

    // ========== СМЕНА ПАРОЛЯ ==========
    loadPasswordScreen() {
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    },

    togglePasswordField(id) {
        const input = document.getElementById(id);
        input.type = input.type === 'password' ? 'text' : 'password';
    },

    async changePassword() {
        const oldPass = document.getElementById('old-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;

        if (!oldPass || !newPass) { this.showToast('❌ Заполните все поля'); return; }
        if (newPass !== confirmPass) { this.showToast('❌ Пароли не совпадают'); return; }
        if (newPass.length < 4) { this.showToast('❌ Минимум 4 символа'); return; }

        try {
            const response = await fetch(`${API_URL}/api/admin/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
            });

            if (response.ok) {
                this.showToast('✅ Пароль изменён');
                this.goTo('admin');
            } else {
                const result = await response.json();
                this.showToast('❌ ' + (result.error || 'Ошибка'));
            }
        } catch (e) {
            this.showToast('❌ Ошибка сервера');
        }
    },

    // ========== ЭКСПОРТ/ИМПОРТ ==========
    exportData() {
        const data = {
            breakdowns: this.data.breakdowns,
            errors: this.data.errors,
            contacts: this.data.contacts,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fanis-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('💾 Экспортировано');
    },

    showImport() {
        this.goTo('admin-import');
    },

    async importData() {
        const raw = document.getElementById('import-data').value.trim();
        if (!raw) { this.showToast('❌ Вставьте данные'); return; }
        try {
            const data = JSON.parse(raw);
            let saved = 0;
            if (data.breakdowns) {
                for (const bd of data.breakdowns) {
                    try {
                        const r = await fetch(`${API_URL}/api/breakdowns`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: bd.name, emoji: bd.emoji || '🔧', steps: bd.steps || [],
                                video_url: bd.video_url || '', image_url: bd.image_url || '',
                                extra: bd.extra || '', contact: bd.contact || 'fanis', active: bd.active !== false
                            })
                        });
                        if (r.ok) saved++;
                    } catch (e) {}
                }
            }
            await this.loadData();
            this.showToast(`✅ Импортировано ${saved}`);
            this.goTo('admin');
        } catch (e) {
            this.showToast('❌ Неверный JSON');
        }
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

const app = App;
document.addEventListener('DOMContentLoaded', () => app.init());
