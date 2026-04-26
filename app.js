// ============================================
// ФАНИС PWA - Главный JavaScript файл
// ============================================

const App = {
    // === ДАННЫЕ ПО УМОЛЧАНИЮ (примеры) ===
    defaultData: {
        breakdowns: [
            {
                id: 'bd_1',
                name: 'Монетник',
                emoji: '💰',
                steps: [
                    'Открутить два шурупа (не потерять!)',
                    'Отсоединить штекер',
                    'Поставить новый монетник',
                    'Закрутить два шурупа',
                    'Присоединить штекер (диод должен светиться)',
                    'Пробросить монету, проверив работоспособность'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: 'Про фишку монетника: при установке обратите внимание на направление штекера — диод должен быть сверху.',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_2',
                name: 'Купюрник',
                emoji: '💵',
                steps: [
                    'Отключить питание аппарата',
                    'Открутить крепёжные винты купюрника',
                    'Аккуратно извлечь старый купюрник',
                    'Установить новый, соблюдая полярность',
                    'Подключить шлейф и питание',
                    'Включить аппарат и проверить приём купюр'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_3',
                name: 'Безнал',
                emoji: '💳',
                steps: [
                    'Проверить подключение антенны',
                    'Перезагрузить терминал безналичной оплаты',
                    'Проверить баланс на счету',
                    'При неисправности — заменить терминал'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'vildan',
                active: true
            },
            {
                id: 'bd_4',
                name: 'Джойстик',
                emoji: '🕹️',
                steps: [
                    'Открутить декоративную накладку',
                    'Отсоединить разъём джойстика',
                    'Извлечь старый джойстик',
                    'Установить новый в посадочное место',
                    'Подключить разъём',
                    'Закрутить накладку',
                    'Проверить все направления движения'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_5',
                name: 'Лампа',
                emoji: '💡',
                steps: [
                    'Отключить питание',
                    'Открутить защитный кожух',
                    'Вывернуть перегоревшую лампу',
                    'Установить новую лампу аналогичной мощности',
                    'Закрутить кожух',
                    'Включить и проверить'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_6',
                name: 'Кнопка',
                emoji: '🔘',
                steps: [
                    'Снять панель управления',
                    'Отпаять провода от старой кнопки',
                    'Установить новую кнопку',
                    'Припаять провода (соблюдая полярность)',
                    'Установить панель на место',
                    'Проверить нажатие и срабатывание'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_7',
                name: 'Верёвка',
                emoji: '📿',
                steps: [
                    'Открыть заднюю панель аппарата',
                    'Ослабить натяжение старой верёвки',
                    'Снять старую верёвку с блоков',
                    'Надеть новую верёвку по схеме',
                    'Натянуть верёвку',
                    'Проверить ход каретки'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_8',
                name: 'Замок',
                emoji: '🔒',
                steps: [
                    'Вставить ключ в замок',
                    'Проверить проворачивание',
                    'При заклинивании — смазать WD-40',
                    'При поломке — выпрессовать старый замок',
                    'Установить новый замок',
                    'Проверить работу ключом'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: false
            },
            {
                id: 'bd_9',
                name: 'Катушка',
                emoji: '🧵',
                steps: [
                    'Открыть отсек катушки',
                    'Снять старую катушку',
                    'Установить новую катушку',
                    'Направить ленту в зажим',
                    'Проверить натяжение',
                    'Закрыть отсек'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'bd_10',
                name: 'Каретка',
                emoji: '🦀',
                steps: [
                    'Отключить питание',
                    'Снять переднюю панель',
                    'Открутить крепление каретки',
                    'Аккуратно извлечь каретку',
                    'Установить новую каретку',
                    'Закрутить крепление',
                    'Проверить движение по всей длине'
                ],
                videoUrl: '',
                imageUrl: '',
                extra: '',
                contact: 'fanis',
                active: true
            }
        ],
        errors: [
            {
                id: 'err_1',
                system: 'UMAR',
                code: 'ER 01',
                description: 'Ошибка в работе процессора',
                period: 'При запуске аппарата',
                solution: [
                    'Замените процессор (U1)',
                    'Замените плату управления'
                ],
                imageUrl: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'err_2',
                system: 'UMAR',
                code: 'ER 02',
                description: 'Ошибка датчика положения',
                period: 'Во время игры',
                solution: [
                    'Проверить подключение датчика',
                    'Очистить датчик от пыли',
                    'При необходимости заменить датчик'
                ],
                imageUrl: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'err_3',
                system: 'UMAR',
                code: 'ER 03',
                description: 'Ошибка двигателя',
                period: 'При движении каретки',
                solution: [
                    'Проверить питание двигателя',
                    'Проверить ремень привода',
                    'Заменить двигатель при необходимости'
                ],
                imageUrl: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'err_4',
                system: 'UMAR',
                code: 'ER 05',
                description: 'Ошибка монетника',
                period: 'При оплате',
                solution: [
                    'Почистить монетоприёмник',
                    'Проверить подключение штекера',
                    'Заменить монетник'
                ],
                imageUrl: '',
                contact: 'fanis',
                active: true
            },
            {
                id: 'err_5',
                system: 'CLE',
                code: 'ER 01',
                description: 'Ошибка инициализации',
                period: 'При включении',
                solution: [
                    'Перезагрузить аппарат',
                    'Проверить все разъёмы',
                    'Обновить прошивку'
                ],
                imageUrl: '',
                contact: 'fanis',
                active: true
            }
        ],
        contacts: {
            fanis: '+79991234567',
            vildan: '+79997654321'
        }
    },

    // === ТЕКУЩИЕ ДАННЫЕ ===
    data: null,
    currentBreakdown: null,
    currentError: null,
    currentSystem: null,
    history: [],
    isAdmin: false,
    editingId: null,

    // === ИНИЦИАЛИЗАЦИЯ ===
    init() {
        this.loadData();
        this.setupServiceWorker();
        this.showSplash();
        this.updateAdminCounts();
    },

    // === ЗАГРУЗКА ДАННЫХ ===
    loadData() {
        const saved = localStorage.getItem('fanis_data');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
                // Проверяем, что все поля есть
                if (!this.data.breakdowns) this.data.breakdowns = [];
                if (!this.data.errors) this.data.errors = [];
                if (!this.data.contacts) this.data.contacts = this.defaultData.contacts;
            } catch (e) {
                this.data = JSON.parse(JSON.stringify(this.defaultData));
            }
        } else {
            this.data = JSON.parse(JSON.stringify(this.defaultData));
            this.saveData();
        }
    },

    saveData() {
        localStorage.setItem('fanis_data', JSON.stringify(this.data));
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

        // Обновляем контент
        if (screenId === 'breakdowns') this.renderBreakdowns();
        if (screenId === 'systems') this.renderSystems();
        if (screenId === 'admin') this.updateAdminCounts();
        if (screenId === 'admin-breakdowns') this.renderAdminBreakdowns();
        if (screenId === 'admin-errors') this.renderAdminErrors();
        if (screenId === 'admin-contacts') this.loadContacts();
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
            <div class="grid-item" onclick="app.openBreakdown('${b.id}')">
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

        const contact = this.data.contacts[bd.contact] || this.data.contacts.fanis;
        const contactName = bd.contact === 'vildan' ? 'Вильдану' : 'Фанису';

        let html = '';

        // Картинка-мем
        if (bd.imageUrl) {
            html += `<div class="card-mem"><img src="${bd.imageUrl}" alt="мем" loading="lazy"></div>`;
        }

        // Видео
        if (bd.videoUrl) {
            html += `
                <div class="card-video-thumb" onclick="app.playVideo('${bd.videoUrl}')">
                    <span class="play-icon">▶️</span>
                    <span class="video-label">▶️ Смотреть видео</span>
                </div>
            `;
        }

        // Шаги
        html += `
            <div class="card-section">
                <h3>📋 Пошаговая инструкция</h3>
                <ol>
                    ${bd.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `;

        // Доп. инфо
        if (bd.extra) {
            html += `
                <div class="card-section card-extra">
                    <h3>💡 Фишка</h3>
                    <p>${bd.extra}</p>
                </div>
            `;
        }

        // Кнопки действий
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

    openSystem(system) {
        this.currentSystem = system;
        document.getElementById('errors-system-title').textContent = system + ' — Коды ошибок';

        const errors = this.data.errors.filter(e => e.system === system && e.active);
        const grid = document.getElementById('errors-grid');

        grid.innerHTML = errors.map(e => `
            <div class="grid-item" onclick="app.openError('${e.id}')">
                <span class="name">${e.code}</span>
            </div>
        `).join('');

        this.goTo('errors');
    },

    openError(id) {
        const err = this.data.errors.find(e => e.id === id);
        if (!err) return;
        this.currentError = err;

        document.getElementById('err-card-title').textContent = err.code;

        const contact = this.data.contacts[err.contact] || this.data.contacts.fanis;
        const contactName = err.contact === 'vildan' ? 'Вильдану' : 'Фанису';

        let html = '';

        // Картинка-мем
        if (err.imageUrl) {
            html += `<div class="card-mem"><img src="${err.imageUrl}" alt="мем" loading="lazy"></div>`;
        }

        // Описание
        html += `
            <div class="card-section">
                <h3>❌ Описание ошибки</h3>
                <p>${err.description}</p>
            </div>
        `;

        // Период
        if (err.period) {
            html += `
                <div class="card-section">
                    <h3>⏰ Период появления</h3>
                    <p>${err.period}</p>
                </div>
            `;
        }

        // Решение
        html += `
            <div class="card-section">
                <h3>🔧 Возможные пути устранения</h3>
                <ol>
                    ${err.solution.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `;

        // Кнопки
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

        // RuTube
        if (url.includes('rutube.ru')) {
            const match = url.match(/video\/([a-f0-9]+)/);
            if (match) {
                embedUrl = `https://rutube.ru/play/embed/${match[1]}`;
            }
        }
        // VK Video
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
            this.goTo('admin');
        } else {
            this.goTo('admin-login');
        }
    },

    checkAdminPassword() {
        const pass = document.getElementById('admin-password').value;
        if (pass === 'fanis2024') {
            this.isAdmin = true;
            document.getElementById('admin-password').value = '';
            this.goTo('admin');
            this.showToast('✅ Вход выполнен');
        } else {
            this.showToast('❌ Неверный пароль');
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
    renderAdminBreakdowns() {
        const list = document.getElementById('admin-bd-list');
        list.innerHTML = this.data.breakdowns.map(b => `
            <div class="admin-list-item" onclick="app.editBreakdown('${b.id}')">
                <span class="item-emoji">${b.emoji}</span>
                <div class="item-info">
                    <div class="item-name">${b.name}</div>
                    <div class="item-meta">${b.steps.length} шагов · ${b.videoUrl ? '🎬' : ''} ${b.extra ? '💡' : ''}</div>
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
        document.getElementById('bd-edit-video').value = bd ? bd.videoUrl : '';
        document.getElementById('bd-edit-image').value = bd ? bd.imageUrl : '';
        document.getElementById('bd-edit-extra').value = bd ? bd.extra : '';
        document.getElementById('bd-edit-contact').value = bd ? bd.contact : 'fanis';
        document.getElementById('bd-edit-active').value = bd ? String(bd.active) : 'true';

        document.getElementById('bd-delete-btn').style.display = bd ? 'block' : 'none';

        this.goTo('admin-bd-edit');
    },

    saveBreakdown() {
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
            id: this.editingId || 'bd_' + Date.now(),
            name: name,
            emoji: document.getElementById('bd-edit-emoji').value.trim() || '🔧',
            steps: steps,
            videoUrl: document.getElementById('bd-edit-video').value.trim(),
            imageUrl: document.getElementById('bd-edit-image').value.trim(),
            extra: document.getElementById('bd-edit-extra').value.trim(),
            contact: document.getElementById('bd-edit-contact').value,
            active: document.getElementById('bd-edit-active').value === 'true'
        };

        if (this.editingId) {
            const idx = this.data.breakdowns.findIndex(b => b.id === this.editingId);
            if (idx >= 0) this.data.breakdowns[idx] = data;
        } else {
            this.data.breakdowns.push(data);
        }

        this.saveData();
        this.showToast('✅ Сохранено');
        this.goTo('admin-breakdowns');
        this.renderAdminBreakdowns();
    },

    deleteBreakdown() {
        if (!this.editingId) return;
        if (!confirm('Удалить поломку?')) return;

        this.data.breakdowns = this.data.breakdowns.filter(b => b.id !== this.editingId);
        this.saveData();
        this.showToast('🗑️ Удалено');
        this.goTo('admin-breakdowns');
        this.renderAdminBreakdowns();
    },

    // === АДМИН: ОШИБКИ ===
    renderAdminErrors() {
        const list = document.getElementById('admin-err-list');
        list.innerHTML = this.data.errors.map(e => `
            <div class="admin-list-item" onclick="app.editError('${e.id}')">
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
        document.getElementById('err-edit-image').value = err ? err.imageUrl : '';
        document.getElementById('err-edit-contact').value = err ? err.contact : 'fanis';
        document.getElementById('err-edit-active').value = err ? String(err.active) : 'true';

        document.getElementById('err-delete-btn').style.display = err ? 'block' : 'none';

        this.goTo('admin-err-edit');
    },

    saveError() {
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
            id: this.editingId || 'err_' + Date.now(),
            system: document.getElementById('err-edit-system').value,
            code: code,
            description: document.getElementById('err-edit-desc').value.trim(),
            period: document.getElementById('err-edit-period').value.trim(),
            solution: solution,
            imageUrl: document.getElementById('err-edit-image').value.trim(),
            contact: document.getElementById('err-edit-contact').value,
            active: document.getElementById('err-edit-active').value === 'true'
        };

        if (this.editingId) {
            const idx = this.data.errors.findIndex(e => e.id === this.editingId);
            if (idx >= 0) this.data.errors[idx] = data;
        } else {
            this.data.errors.push(data);
        }

        this.saveData();
        this.showToast('✅ Сохранено');
        this.goTo('admin-errors');
        this.renderAdminErrors();
    },

    deleteError() {
        if (!this.editingId) return;
        if (!confirm('Удалить ошибку?')) return;

        this.data.errors = this.data.errors.filter(e => e.id !== this.editingId);
        this.saveData();
        this.showToast('🗑️ Удалено');
        this.goTo('admin-errors');
        this.renderAdminErrors();
    },

    // === АДМИН: КОНТАКТЫ ===
    loadContacts() {
        document.getElementById('contact-fanis').value = this.data.contacts.fanis || '';
        document.getElementById('contact-vildan').value = this.data.contacts.vildan || '';
    },

    saveContacts() {
        this.data.contacts.fanis = document.getElementById('contact-fanis').value.trim();
        this.data.contacts.vildan = document.getElementById('contact-vildan').value.trim();
        this.saveData();
        this.showToast('✅ Контакты сохранены');
    },

    // === ЭКСПОРТ / ИМПОРТ ===
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'fanis-data-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();

        URL.revokeObjectURL(url);
        this.showToast('💾 Данные экспортированы');
    },

    showImport() {
        this.goTo('admin-import');
    },

    importData() {
        try {
            const data = JSON.parse(document.getElementById('import-data').value);
            if (data.breakdowns && data.errors) {
                this.data = data;
                this.saveData();
                this.showToast('✅ Данные загружены');
                this.goTo('admin');
            } else {
                throw new Error('Неверный формат');
            }
        } catch (e) {
            this.showToast('❌ Ошибка: неверный JSON');
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
