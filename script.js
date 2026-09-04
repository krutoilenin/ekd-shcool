// ===== КОНФИГУРАЦИЯ =====
const ADMIN_EMAIL = 'admin@ekd.ru';
const ADMIN_PASSWORD = 'admin123';

// ===== ДАННЫЕ =====
let appData = {
    logo: 'images/logo.png',
    bannerBg: 'images/banner-bg.jpg',
    avatar: 'images/default-avatar.png',
    courses: [],
    news: [],
    teachers: [],
    schedule: {}
};

let currentUser = null;
let currentFilter = { exam: 'all', subject: 'all' };

// ===== ЗАГРУЗКА ДАННЫХ =====
function loadData() {
    try {
        const saved = localStorage.getItem('ekdData');
        if (saved) {
            appData = JSON.parse(saved);
        } else {
            appData.courses = [
                {
                    id: 1,
                    name: 'История',
                    type: 'ege',
                    subject: 'history',
                    teacher: 'Анна Смирнова',
                    price: '4990',
                    oldPrice: '6990',
                    image: 'images/default-course.jpg',
                    tariffs: ['Базовый 4000₽', 'Про 6000₽', 'VIP 9000₽']
                },
                {
                    id: 2,
                    name: 'Обществознание',
                    type: 'ege',
                    subject: 'society',
                    teacher: 'Михаил Петров',
                    price: '5490',
                    oldPrice: '7490',
                    image: 'images/default-course.jpg',
                    tariffs: ['Стандарт 4500₽', 'Премиум 7000₽']
                },
                {
                    id: 3,
                    name: 'ПрофМат',
                    type: 'ege',
                    subject: 'math',
                    teacher: 'Елена Козлова',
                    price: '5990',
                    oldPrice: '8990',
                    image: 'images/default-course.jpg',
                    tariffs: ['Базовый 5000₽', 'Про 7500₽', 'VIP 10000₽']
                },
                {
                    id: 4,
                    name: 'Физика',
                    type: 'ege',
                    subject: 'physics',
                    teacher: 'Алексей Иванов',
                    price: '5290',
                    oldPrice: '7290',
                    image: 'images/default-course.jpg',
                    tariffs: ['Стандарт 4500₽', 'Про 6500₽']
                },
                {
                    id: 5,
                    name: 'Литература',
                    type: 'ege',
                    subject: 'literature',
                    teacher: 'Ольга Новикова',
                    price: '4790',
                    oldPrice: '6790',
                    image: 'images/default-course.jpg',
                    tariffs: ['Базовый 4000₽', 'Про 6000₽']
                }
            ];
            appData.news = [
                {
                    id: 1,
                    title: 'Старт нового потока!',
                    content: 'Открыт набор на курсы подготовки к ЕГЭ 2026. Успей записаться!',
                    date: '2026-09-01',
                    image: 'images/default-news.jpg',
                    size: 'medium'
                }
            ];
            appData.teachers = [
                {
                    id: 1,
                    name: 'Анна Смирнова',
                    subject: 'История',
                    avatar: 'images/default-avatar.png'
                },
                {
                    id: 2,
                    name: 'Михаил Петров',
                    subject: 'Обществознание',
                    avatar: 'images/default-avatar.png'
                }
            ];
            appData.schedule = {
                history: [
                    { day: 'Понедельник', time: '18:00-20:00', topic: 'Древняя Русь' },
                    { day: 'Среда', time: '18:00-20:00', topic: 'Средневековье' },
                    { day: 'Пятница', time: '16:00-18:00', topic: 'Новое время' }
                ],
                society: [
                    { day: 'Вторник', time: '18:00-20:00', topic: 'Право' },
                    { day: 'Четверг', time: '18:00-20:00', topic: 'Экономика' }
                ],
                math: [
                    { day: 'Понедельник', time: '16:00-18:00', topic: 'Алгебра' },
                    { day: 'Среда', time: '16:00-18:00', topic: 'Геометрия' },
                    { day: 'Пятница', time: '18:00-20:00', topic: 'Теория вероятностей' }
                ],
                physics: [
                    { day: 'Вторник', time: '16:00-18:00', topic: 'Механика' },
                    { day: 'Четверг', time: '16:00-18:00', topic: 'Электричество' }
                ],
                literature: [
                    { day: 'Среда', time: '18:00-20:00', topic: 'Русская литература' },
                    { day: 'Пятница', time: '16:00-18:00', topic: 'Зарубежная литература' }
                ]
            };
            saveData();
        }
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
        localStorage.removeItem('ekdData');
        loadData();
    }
    loadUser();
    renderAll();
}

function saveData() {
    try {
        localStorage.setItem('ekdData', JSON.stringify(appData));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

// ===== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ =====
function loadUser() {
    try {
        const savedUser = localStorage.getItem('ekdUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
    } catch (e) {
        currentUser = null;
        localStorage.removeItem('ekdUser');
    }
    updateUI();
}

function saveUser() {
    if (currentUser) {
        localStorage.setItem('ekdUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('ekdUser');
    }
}

// ===== АВТОРИЗАЦИЯ =====
function loginEmail(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        currentUser = { email, name: 'Администратор', isAdmin: true };
        saveUser();
        window.location.href = 'index.html';
    } else {
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.textContent = '❌ Неверный email или пароль';
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 3000);
        }
    }
}

function loginGoogle() {
    if (confirm('🔐 Войти как администратор? (демо-режим)')) {
        currentUser = { email: 'admin@ekd.ru', name: 'Администратор', isAdmin: true };
        saveUser();
        window.location.href = 'index.html';
    }
}

function loginVK() {
    if (confirm('🔐 Войти как администратор? (демо-режим)')) {
        currentUser = { email: 'admin@ekd.ru', name: 'Администратор', isAdmin: true };
        saveUser();
        window.location.href = 'index.html';
    }
}

function logout() {
    currentUser = null;
    saveUser();
    window.location.reload();
}

function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateUI() {
    const isLoggedIn = currentUser !== null;
    const admin = isAdmin();
    
    const panelAvatar = document.getElementById('panelAvatar');
    const panelName = document.getElementById('panelUserName');
    const adminBtn = document.getElementById('adminAccessBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (panelAvatar) panelAvatar.src = appData.avatar || 'images/default-avatar.png';
    if (panelName) panelName.textContent = isLoggedIn ? (currentUser.name || 'Пользователь') : 'Гость';
    if (adminBtn) {
        adminBtn.style.display = admin ? 'flex' : 'none';
    }
    if (logoutBtn) {
        logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
    }
    
    const authBtns = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const headerAvatar = document.getElementById('headerUserAvatar');
    const headerName = document.getElementById('headerUserName');
    
    if (authBtns && userProfile) {
        if (isLoggedIn) {
            authBtns.style.display = 'none';
            userProfile.style.display = 'flex';
            if (headerAvatar) headerAvatar.src = appData.avatar || 'images/default-avatar.png';
            if (headerName) headerName.textContent = currentUser.name || 'Пользователь';
        } else {
            authBtns.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }
    
    const logos = document.querySelectorAll('#panelLogo, #headerLogo');
    logos.forEach(el => {
        if (el) el.src = appData.logo || 'images/logo.png';
    });
    
    const banner = document.getElementById('heroBanner');
    if (banner) {
        banner.style.backgroundImage = `url('${appData.bannerBg || 'images/banner-bg.jpg'}')`;
    }
}

function checkAdminAccess() {
    if (isAdmin()) {
        window.open('admin.html', '_blank');
    } else {
        alert('⛔ Доступ только для администратора!\nВойдите как admin@ekd.ru');
        window.location.href = 'login.html';
    }
}

// ===== РЕНДЕРИНГ =====
function renderAll() {
    renderCourses();
    renderNews();
    renderTeachers();
    updateUI();
}

function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    let filtered = appData.courses || [];
    
    if (currentFilter.exam !== 'all') {
        filtered = filtered.filter(c => c.type === currentFilter.exam);
    }
    
    if (currentFilter.subject !== 'all') {
        filtered = filtered.filter(c => c.subject === currentFilter.subject);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">📭 Нет курсов по выбранным фильтрам</div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(c => `
        <div class="course-card" onclick="openCourseModal(${c.id})">
            <div class="course-image" style="background-image: url('${c.image || 'images/default-course.jpg'}');">
                <span class="course-badge">${(c.type || 'ege').toUpperCase()}</span>
            </div>
            <div class="course-info">
                <h3>${c.name || 'Без названия'}</h3>
                <div class="teacher"><i class="fas fa-user"></i> ${c.teacher || 'Не указан'}</div>
                <div class="price">${c.price || '0'} ₽ ${c.oldPrice ? `<span class="old-price">${c.oldPrice} ₽</span>` : ''}</div>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    
    const news = appData.news || [];
    
    if (news.length === 0) {
        grid.innerHTML = `<div class="empty-state">📭 Нет новостей</div>`;
        return;
    }
    
    grid.innerHTML = news.map(n => `
        <div class="news-card ${n.size || 'medium'}">
            ${n.image ? `<img src="${n.image}" class="news-image" onerror="this.style.display='none'">` : ''}
            ${n.badge ? `<span class="news-badge">${n.badge}</span>` : ''}
            <div class="news-date">${n.date || 'Дата не указана'}</div>
            <div class="news-title">${n.title || 'Без заголовка'}</div>
            <div class="news-excerpt">${n.content || ''}</div>
        </div>
    `).join('');
}

function renderTeachers() {
    const grid = document.getElementById('teachersGrid');
    if (!grid) return;
    
    const teachers = appData.teachers || [];
    
    if (teachers.length === 0) {
        grid.innerHTML = `<div class="empty-state">👨‍🏫 Нет преподавателей</div>`;
        return;
    }
    
    grid.innerHTML = teachers.map(t => `
        <div class="teacher-card">
            <img src="${t.avatar || 'images/default-avatar.png'}" alt="${t.name || 'Преподаватель'}" class="teacher-avatar" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👤</text></svg>'">
            <div class="teacher-name">${t.name || 'Без имени'}</div>
            <div class="teacher-subject">${t.subject || 'Предмет не указан'}</div>
        </div>
    `).join('');
}

// ===== ФИЛЬТРАЦИЯ =====
function setupFilters() {
    document.querySelectorAll('.exam-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.exam-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.exam = this.dataset.exam;
            renderCourses();
        });
    });
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.subject = this.dataset.subject;
            renderCourses();
        });
    });
}

// ===== МОДАЛЬНОЕ ОКНО КУРСА =====
function openCourseModal(id) {
    const course = (appData.courses || []).find(c => c.id === id);
    if (!course) {
        alert('Курс не найден');
        return;
    }
    
    const modal = document.getElementById('courseModal');
    const container = document.getElementById('modalCourseInfo');
    if (!modal || !container) return;
    
    container.innerHTML = `
        <h2 style="color: var(--orange-primary); font-size:32px;">${course.name || 'Без названия'}</h2>
        <div style="margin:20px 0;">
            <img src="${course.image || 'images/default-course.jpg'}" style="width:100%; border-radius:12px; max-height:300px; object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>'">
        </div>
        <p><i class="fas fa-user"></i> Преподаватель: <strong>${course.teacher || 'Не указан'}</strong></p>
        <p style="font-size:28px; font-weight:900; color:var(--orange-primary); margin:16px 0;">
            ${course.price || '0'} ₽ ${course.oldPrice ? `<span style="color:var(--text-muted); font-size:18px; text-decoration:line-through;">${course.oldPrice} ₽</span>` : ''}
        </p>
        <h3 style="margin:20px 0 12px;">📋 Доступные тарифы:</h3>
        ${course.tariffs && course.tariffs.length ? course.tariffs.map(t => `
            <div class="tariff-plan">
                <h4>${t}</h4>
                <div class="tariff-price">${course.price} ₽</div>
            </div>
        `).join('') : '<p style="color:var(--text-muted);">Тарифы не указаны</p>'}
        <button onclick="closeCourseModal()" style="width:100%; padding:14px; background: var(--orange-primary); border:none; border-radius:8px; color:white; font-weight:700; font-size:18px; margin-top:20px; cursor:pointer;">
            Записаться на курс
        </button>
    `;
    
    modal.style.display = 'flex';
}

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) modal.style.display = 'none';
}

// ===== РАСПИСАНИЕ =====
function openSchedule() {
    const modal = document.getElementById('scheduleModal');
    const container = document.getElementById('scheduleContent');
    if (!modal || !container) return;
    
    const subjects = ['history', 'society', 'math', 'physics', 'literature'];
    const subjectNames = {
        history: 'История',
        society: 'Обществознание',
        math: 'ПрофМат',
        physics: 'Физика',
        literature: 'Литература'
    };
    
    let html = `
        <h2 style="color: var(--orange-primary);">📅 Расписание занятий</h2>
        <div class="schedule-subject-select">
            ${subjects.map(s => `
                <button onclick="showSchedule('${s}')" data-subject="${s}">${subjectNames[s]}</button>
            `).join('')}
        </div>
        <div id="scheduleDisplay">
            <p style="color: var(--text-muted); text-align:center; padding:40px 0;">Выберите предмет для просмотра расписания</p>
        </div>
    `;
    
    container.innerHTML = html;
    modal.style.display = 'flex';
    
    // Показать расписание для первого предмета
    setTimeout(() => {
        showSchedule('history');
    }, 100);
}

function showSchedule(subject) {
    const display = document.getElementById('scheduleDisplay');
    if (!display) return;
    
    // Обновить активную кнопку
    document.querySelectorAll('.schedule-subject-select button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subject === subject);
    });
    
    const schedule = appData.schedule?.[subject] || [];
    const subjectNames = {
        history: 'История',
        society: 'Обществознание',
        math: 'ПрофМат',
        physics: 'Физика',
        literature: 'Литература'
    };
    
    if (schedule.length === 0) {
        display.innerHTML = `
            <p style="color: var(--text-muted); text-align:center; padding:40px 0;">
                📭 Расписание для ${subjectNames[subject]} пока не добавлено
                ${isAdmin() ? '<br><small>Добавьте расписание в админ-панели</small>' : ''}
            </p>
        `;
        return;
    }
    
    let html = `
        <h3 style="margin-bottom:16px;">${subjectNames[subject]}</h3>
        <table class="schedule-table">
            <thead>
                <tr>
                    <th>День недели</th>
                    <th>Время</th>
                    <th>Тема занятия</th>
                    ${isAdmin() ? '<th>Действия</th>' : ''}
                </tr>
            </thead>
            <tbody>
    `;
    
    schedule.forEach((item, index) => {
        html += `
            <tr>
                <td>${item.day || 'Не указано'}</td>
                <td>${item.time || 'Не указано'}</td>
                <td>${item.topic || 'Без темы'}</td>
                ${isAdmin() ? `
                    <td>
                        <button class="schedule-edit-btn" onclick="editScheduleItem('${subject}', ${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="schedule-edit-btn" onclick="deleteScheduleItem('${subject}', ${index})" style="background:#ff4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                ` : ''}
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    
    if (isAdmin()) {
        html += `
            <div style="margin-top:20px; padding:16px; background: var(--gray); border-radius:12px;">
                <h4 style="color: var(--orange-primary); margin-bottom:12px;">➕ Добавить занятие</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px;">
                    <input type="text" id="scheduleDay" placeholder="День недели" style="padding:8px 12px; background:var(--dark-gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                    <input type="text" id="scheduleTime" placeholder="Время (18:00-20:00)" style="padding:8px 12px; background:var(--dark-gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                    <input type="text" id="scheduleTopic" placeholder="Тема занятия" style="padding:8px 12px; background:var(--dark-gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                    <button onclick="addScheduleItem('${subject}')" style="padding:8px 12px; background:var(--orange-primary); border:none; border-radius:6px; color:white; font-weight:600; cursor:pointer;">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
            </div>
        `;
    }
    
    display.innerHTML = html;
}

function addScheduleItem(subject) {
    const day = document.getElementById('scheduleDay')?.value.trim();
    const time = document.getElementById('scheduleTime')?.value.trim();
    const topic = document.getElementById('scheduleTopic')?.value.trim();
    
    if (!day || !time || !topic) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    if (!appData.schedule) appData.schedule = {};
    if (!appData.schedule[subject]) appData.schedule[subject] = [];
    
    appData.schedule[subject].push({ day, time, topic });
    saveData();
    showSchedule(subject);
    alert('✅ Занятие добавлено в расписание!');
}

function editScheduleItem(subject, index) {
    const schedule = appData.schedule?.[subject] || [];
    const item = schedule[index];
    if (!item) return;
    
    const newDay = prompt('День недели:', item.day);
    if (newDay === null) return;
    const newTime = prompt('Время:', item.time);
    if (newTime === null) return;
    const newTopic = prompt('Тема занятия:', item.topic);
    if (newTopic === null) return;
    
    schedule[index] = { day: newDay, time: newTime, topic: newTopic };
    saveData();
    showSchedule(subject);
    alert('✅ Расписание обновлено!');
}

function deleteScheduleItem(subject, index) {
    if (!confirm('🗑️ Удалить это занятие из расписания?')) return;
    
    const schedule = appData.schedule?.[subject] || [];
    schedule.splice(index, 1);
    saveData();
    showSchedule(subject);
    alert('✅ Занятие удалено!');
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.style.display = 'none';
}

// ===== ПАНЕЛЬ =====
function toggleMobileMenu() {
    const panel = document.getElementById('slidePanel');
    if (panel) panel.classList.toggle('mobile-open');
}

function scrollToCourses() {
    const section = document.getElementById('coursesSection');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// ===== ЗАКРЫТИЕ МОДАЛОК =====
window.addEventListener('click', (e) => {
    const courseModal = document.getElementById('courseModal');
    const scheduleModal = document.getElementById('scheduleModal');
    if (e.target === courseModal) closeCourseModal();
    if (e.target === scheduleModal) closeScheduleModal();
});

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupFilters();
    
    document.querySelectorAll('.panel-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const panel = document.getElementById('slidePanel');
            if (panel) panel.classList.remove('mobile-open');
            
            // Не закрываем если это расписание
            if (this.dataset.page === 'schedule') {
                e.preventDefault();
                openSchedule();
            }
        });
    });
});