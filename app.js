// ============================================
// ФАНИС PWA v2 — Работа с бэкендом
// ============================================

const API_URL = 'https://fanis-api.onrender.com'; // ЗАМЕНИТЕ на ваш URL бэкенда

const App = {
    // === ДАННЫЕ ===
    data: {
        breakdowns: [],
        errors: [],
        contacts: {}
    },
    currentBreakdown: null,
    currentError: null,
    currentSystem: null,
    history: [],
    isAdmin: false,
    editingId: null,

    // === ИНИЦИАЛИЗАЦИЯ ===
    async init() {
        await this.loadData();
        this.setupServiceWorker();
        this.showSplash();
    },

    // === ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ===
    async loadData() {
        try {
            // Загружаем поломки
            const bdResponse = await fetch(`${API_URL}/api/breakdowns`);
            if (bdResponse.ok) {
                this.data.breakdowns = await bdResponse.json();
            }

            // Загружаем контакты
            const contactsResponse = await fetch(`${API_URL}/api/contacts`);
            if (contactsResponse.ok) {
                this.data.contacts = await contactsResponse.json();
            }

            // Сохраняем в кэш для офлайн-режима
            this.saveToCache();
        } catch (e) {
            console.error('API error:', e);
            // Если нет сети — загружаем из кэша
            this.loadFromCache();
            this.showToast('⚠️ Офлайн-режим');
        }
    },

    // === КЭШ ДЛЯ ОФЛАЙНА ===
    saveToCache() {
        localStorage.setItem('fanis_cache', JSON.stringify(this.data));
        localStorage.setItem('fanis_cache_time', Date.now());
    },

    loadFromCache() {
        const cached = localStorage.getItem('fanis_cache');
        if (cached) {
            this.data = JSON.parse(cached);
        }
    },

    // === SERVICE WORKER ===
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    },

    // === ЗАСТАВКА ===
    showSplash() {
        setTimeout(() => {
            this.goTo('home');
        }, 2500);
    },

    // === НАВИГАЦИЯ ===
    goTo(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId + '-screen').classList.add('active');

        if (screenId !== 'splash') {
            this.history.push(screenId);
        }

        if (screenId === 'breakdowns') this.renderBreakdowns();
        if (screenId === 'systems') this.renderSystems();
        if (screenId === 'admin') this.updateAdminCounts();
        if (screenId === 'admin-breakdowns') this.renderAdminBreakdowns();
        if (screenId === 'admin-errors') this.renderAdminErrors();
        if (screenId === 'admin-contacts') this.loadContacts();
        if (screenId === 'admin-settings') this.loadSettings();
    },

    goBack() {
        this.history.pop();
        const prev = this.history.pop() || 'home';
        this.goTo(prev);
    },

    // === РЕНДЕР ПОЛОМОК ===
    renderBreakdowns() {
        const grid = document.getElementById('breakdowns-grid');
        const active = this.data.breakdowns.filter(b => b.active);

        grid.innerHTML = active.map(b => `
            <div class="grid-item" onclick="app.openBreakdown(${b.id})">
                <span class="emoji">${b.emoji}</span>
                <span class="name">${b.name}</span>
            </div>
        `).join('');
    },

    openBreakdown(id) {
        const bd = this.data.breakdowns.find(b => b.id === id);
        if (!bd) return;
        this.currentBreakdown = bd;

        document.getElementById('bd-card-title').textContent = bd.name + ' ' + bd.emoji;

        const contact = this.data.contacts[bd.contact] || this.data.contacts.fanis || '';
        const contactName = bd.contact === 'vildan' ? 'Вильдану' : 'Фанису';

        let html = '';

        if (bd.image_url) {
            html += `<div class="card-mem"><img src="${bd.image_url}" alt="мем" loading="lazy"></div>`;
        }

        if (bd.video_url) {
            html += `
                <div class="card-video-thumb" onclick="app.playVideo('${bd.video_url}')">
                    <span class="play-icon">▶️</span>
                    <span class="video-label">▶️ Смотреть видео</span>
                </div>
            `;
        }

        html += `
            <div class="card-section">
                <h3>📋 Пошаговая инструкция</h3>
                <ol>
                    ${bd.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
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

    // === РЕНДЕР СИСТЕМ ===
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

                grid.innerHTML = errors.map(e => `
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

        if (err.image_url) {
            html += `<div class="card-mem"><img src="${err.image_url}" alt="мем" loading="lazy"></div>`;
        }

        html += `
            <div class="card-section">
                <h3>❌ Описание ошибки</h3>
                <p>${err.description}</p>
            </div>
        `;

        if (err.period) {
            html += `
                <div class="card-section">
                    <h3>⏰ Период появления</h3>
                    <p>${err.period}</p>
                </div>
            `;
        }

        html += `
            <div class="card-section">
                <h3>🔧 Возможные пути устранения</h3>
                <ol>
                    ${err.solution.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `;

        html += `
            <a href="tel:${contact}" class="action-btn btn-call">📞 Позвонить ${contactName}</a>
            <button class="action-btn btn-back" onclick="app.goTo('errors')">⬅️ Назад к кодам ошибок</button>
            <button class="action-btn btn-start" onclick="app.goTo('home')">🏠 В начало</button>
        `;

        document.getElementById('err-card-content').innerHTML = html;
        this.goTo('error-card');
    },

    // === ВИДЕО ===
    playVideo(url) {
        const container = document.getElementById('video-container');
        let embedUrl = '';

        if (url.includes('rutube.ru')) {
            const match = url.match(/video\/([a-f0-9]+)/);
            if (match) {
                embedUrl = `https://rutube.ru/play/embed/${match[1]}`;
            }
        }
        else if (url.includes('vk.com') || url.includes('vkvideo.ru')) {
            const match = url.match(/video(-?\d+)_(-?\d+)/);
            if (match) {
                embedUrl = `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`;
            }
        }

        if (embedUrl) {
            container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
            document.getElementById('video-modal').classList.add('active');
        } else {
            this.showToast('Не удалось открыть видео. Проверьте ссылку.');
        }
    },

    closeVideo() {
        document.getElementById('video-modal').classList.remove('active');
        document.getElementById('video-container').innerHTML = '';
    },

    // === АДМИНКА ===
    toggleAdmin() {
        if (this.isAdmin) {
            this.isAdmin = false;
            this.goTo('home');
        } else {
            this.goTo('admin-login');
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

    // === АДМИН: ПОЛОМКИ ===
    async renderAdminBreakdowns() {
        // Перезагружаем с сервера для актуальности
        try {
            const response = await fetch(`${API_URL}/api/breakdowns/all`);
            if (response.ok) {
                this.data.breakdowns = await response.json();
            }
        } catch (e) {}

        const list = document.getElementById('admin-bd-list');
        list.innerHTML = this.data.breakdowns.map(b => `
            <div class="admin-list-item" onclick="app.editBreakdown(${b.id})">
                <span class="item-emoji">${b.emoji}</span>
                <div class="item-info">
                    <div class="item-name">${b.name}</div>
                    <div class="item-meta">${b.steps.length} шагов · ${b.video_url ? '🎬' : ''} ${b.extra ? '💡' : ''}</div>
                </div>
                <span class="item-status ${b.active ? '' : 'inactive'}">${b.active ? 'Активно' : 'Скрыто'}</span>
            </div>
        `).join('');
    },

    editBreakdown(id = null) {
        this.editingId = id;
        const bd = id ? this.data.breakdowns.find(b => b.id === id) : null;

        document.getElementById('bd-edit-title').textContent = bd ? 'Редактировать' : 'Новая поломка';
        document.getElementById('bd-edit-name').value = bd ? bd.name : '';
        document.getElementById('bd-edit-emoji').value = bd ? bd.emoji : '';
        document.getElementById('bd-edit-steps').value = bd ? bd.steps.join('\n') : '';
        document.getElementById('bd-edit-video').value = bd ? bd.video_url : '';
        document.getElementById('bd-edit-image').value = bd ? bd.image_url : '';
        document.getElementById('bd-edit-extra').value = bd ? bd.extra : '';
        document.getElementById('bd-edit-contact').value = bd ? bd.contact : 'fanis';
        document.getElementById('bd-edit-active').value = bd ? String(bd.active) : 'true';

        document.getElementById('bd-delete-btn').style.display = bd ? 'block' : 'none';

        this.goTo('admin-bd-edit');
    },

    async saveBreakdown() {
        const name = document.getElementById('bd-edit-name').value.trim();
        if (!name) {
            this.showToast('❌ Введите название');
            return;
        }

        const steps = document.getElementById('bd-edit-steps').value
            .split('\n')
            .map(s => s.trim())
            .filter(s => s);

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
            let response;
            if (this.editingId) {
                response = await fetch(`${API_URL}/api/breakdowns/${this.editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`${API_URL}/api/breakdowns`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (response.ok) {
                this.showToast('✅ Сохранено');
                await this.loadData(); // Перезагружаем данные
                this.goTo('admin-breakdowns');
            } else {
                this.showToast('❌ Ошибка сохранения');
            }
        } catch (e) {
            this.showToast('❌ Нет связи с сервером');
        }
    },

    async deleteBreakdown() {
        if (!this.editingId) return;
        if (!confirm('Удалить поломку?')) return;

        try {
            await fetch(`${API_URL}/api/breakdowns/${this.editingId}`, { method: 'DELETE' });
            this.showToast('🗑️ Удалено');
            await this.loadData();
            this.goTo('admin-breakdowns');
        } catch (e) {
            this.showToast('❌ Ошибка удаления');
        }
    },

    // === АДМИН: ОШИБКИ ===
    async renderAdminErrors() {
        try {
            const response = await fetch(`${API_URL}/api/errors/all`);
            if (response.ok) {
                this.data.errors = await response.json();
            }
        } catch (e) {}

        const list = document.getElementById('admin-err-list');
        list.innerHTML = this.data.errors.map(e => `
            <div class="admin-list-item" onclick="app.editError(${e.id})">
                <div class="item-info">
                    <div class="item-name">${e.code} · ${e.system}</div>
                    <div class="item-meta">${e.description}</div>
                </div>
                <span class="item-status ${e.active ? '' : 'inactive'}">${e.active ? 'Активно' : 'Скрыто'}</span>
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
        document.getElementById('err-edit-solution').value = err ? err.solution.join('\n') : '';
        document.getElementById('err-edit-image').value = err ? err.image_url : '';
        document.getElementById('err-edit-contact').value = err ? err.contact : 'fanis';
        document.getElementById('err-edit-active').value = err ? String(err.active) : 'true';

        document.getElementById('err-delete-btn').style.display = err ? 'block' : 'none';

        this.goTo('admin-err-edit');
    },

    async saveError() {
        const code = document.getElementById('err-edit-code').value.trim();
        if (!code) {
            this.showToast('❌ Введите код ошибки');
            return;
        }

        const solution = document.getElementById('err-edit-solution').value
            .split('\n')
            .map(s => s.trim())
            .filter(s => s);

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
            let response;
            if (this.editingId) {
                response = await fetch(`${API_URL}/api/errors/${this.editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`${API_URL}/api/errors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (response.ok) {
                this.showToast('✅ Сохранено');
                await this.loadData();
                this.goTo('admin-errors');
            } else {
                this.showToast('❌ Ошибка сохранения');
            }
        } catch (e) {
            this.showToast('❌ Нет связи с сервером');
        }
    },

    async deleteError() {
        if (!this.editingId) return;
        if (!confirm('Удалить ошибку?')) return;

        try {
            await fetch(`${API_URL}/api/errors/${this.editingId}`, { method: 'DELETE' });
            this.showToast('🗑️ Удалено');
            await this.loadData();
            this.goTo('admin-errors');
        } catch (e) {
            this.showToast('❌ Ошибка удаления');
        }
    },

    // === АДМИН: КОНТАКТЫ ===
    loadContacts() {
        document.getElementById('contact-fanis').value = this.data.contacts.fanis || '';
        document.getElementById('contact-vildan').value = this.data.contacts.vildan || '';
    },

    async saveContacts() {
        const fanis = document.getElementById('contact-fanis').value.trim();
        const vildan = document.getElementById('contact-vildan').value.trim();

        try {
            await Promise.all([
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

            this.data.contacts.fanis = fanis;
            this.data.contacts.vildan = vildan;
            this.saveToCache();
            this.showToast('✅ Контакты сохранены');
        } catch (e) {
            this.showToast('❌ Ошибка сохранения');
        }
    },

    // === АДМИН: НАСТРОЙКИ (пароль) ===
    loadSettings() {
        document.getElementById('settings-old-pass').value = '';
        document.getElementById('settings-new-pass').value = '';
        document.getElementById('settings-confirm-pass').value = '';
    },

    async changePassword() {
        const oldPass = document.getElementById('settings-old-pass').value;
        const newPass = document.getElementById('settings-new-pass').value;
        const confirmPass = document.getElementById('settings-confirm-pass').value;

        if (!oldPass || !newPass) {
            this.showToast('❌ Заполните все поля');
            return;
        }

        if (newPass !== confirmPass) {
            this.showToast('❌ Пароли не совпадают');
            return;
        }

        if (newPass.length < 4) {
            this.showToast('❌ Пароль минимум 4 символа');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
            });

            if (response.ok) {
                this.showToast('✅ Пароль изменён');
                document.getElementById('settings-old-pass').value = '';
                document.getElementById('settings-new-pass').value = '';
                document.getElementById('settings-confirm-pass').value = '';
            } else {
                const result = await response.json();
                this.showToast('❌ ' + (result.error || 'Ошибка'));
            }
        } catch (e) {
            this.showToast('❌ Ошибка сервера');
        }
    },

    async resetPassword() {
        if (!confirm('Сбросить пароль на стандартный (fanis2024)?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirm: 'RESET' })
            });

            if (response.ok) {
                this.showToast('✅ Пароль сброшен на fanis2024');
            } else {
                this.showToast('❌ Ошибка сброса');
            }
        } catch (e) {
            this.showToast('❌ Ошибка сервера');
        }
    },

    // === TOAST ===
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

// === ИНИЦИАЛИЗАЦИЯ ===
const app = App;
document.addEventListener('DOMContentLoaded', () => app.init());
