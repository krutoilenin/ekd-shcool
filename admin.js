// ===== ЗАГРУЗКА ДАННЫХ =====
function getData() {
    const saved = localStorage.getItem('ekdData');
    return saved ? JSON.parse(saved) : { courses: [], news: [], teachers: [], schedule: {} };
}

function saveData(data) {
    localStorage.setItem('ekdData', JSON.stringify(data));
}

// ===== ВКЛАДКИ =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.admin-tabs button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');
        });
    });
    
    loadAdminData();
    document.getElementById('importInput').addEventListener('change', importData);
});

function loadAdminData() {
    const data = getData();
    renderCoursesList(data);
    renderNewsList(data);
    renderTeachersList(data);
    renderScheduleList(data);
    renderSettingsPreviews(data);
}

// ===== КУРСЫ =====
function renderCoursesList(data) {
    const container = document.getElementById('coursesList');
    if (!data.courses || data.courses.length === 0) {
        container.innerHTML = `<div class="empty-state">📭 Нет курсов</div>`;
        return;
    }
    container.innerHTML = data.courses.map(c => `
        <div class="item-card">
            <div style="display:flex; align-items:center; flex:1;">
                <img src="${c.image || 'images/default-course.jpg'}" class="item-preview-img" alt="${c.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>'">
                <div class="item-info">
                    <h4>${c.name}</h4>
                    <p>${c.teacher} • ${c.price} ₽ • ${c.type.toUpperCase()}</p>
                    <p style="font-size:11px; color:var(--text-muted);">${c.tariffs ? c.tariffs.join(', ') : 'Нет тарифов'}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editCourse(${c.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteCourse(${c.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function saveCourse() {
    const data = getData();
    const id = document.getElementById('editCourseId').value;
    const courseData = {
        name: document.getElementById('courseName').value.trim(),
        type: document.getElementById('courseType').value,
        subject: document.getElementById('courseSubject').value,
        teacher: document.getElementById('courseTeacher').value.trim(),
        price: document.getElementById('coursePrice').value.trim(),
        oldPrice: document.getElementById('courseOldPrice').value.trim() || null,
        tariffs: document.getElementById('courseTariffs').value.split(',').map(s => s.trim()).filter(Boolean),
        image: 'images/default-course.jpg'
    };
    
    if (!courseData.name || !courseData.teacher || !courseData.price) {
        alert('❌ Заполните все обязательные поля!');
        return;
    }
    
    const imageFile = document.getElementById('courseImage').files[0];
    
    if (id) {
        const index = data.courses.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            courseData.id = parseInt(id);
            courseData.image = data.courses[index].image;
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    courseData.image = e.target.result;
                    data.courses[index] = courseData;
                    saveData(data);
                    loadAdminData();
                    clearCourseForm();
                    alert('✅ Курс обновлен!');
                };
                reader.readAsDataURL(imageFile);
                return;
            }
            data.courses[index] = courseData;
            saveData(data);
            loadAdminData();
            clearCourseForm();
            alert('✅ Курс обновлен!');
        }
    } else {
        courseData.id = Date.now();
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                courseData.image = e.target.result;
                data.courses.push(courseData);
                saveData(data);
                loadAdminData();
                clearCourseForm();
                alert('✅ Курс добавлен!');
            };
            reader.readAsDataURL(imageFile);
            return;
        }
        data.courses.push(courseData);
        saveData(data);
        loadAdminData();
        clearCourseForm();
        alert('✅ Курс добавлен!');
    }
}

function editCourse(id) {
    const data = getData();
    const course = data.courses.find(c => c.id === id);
    if (!course) return;
    
    document.getElementById('editCourseId').value = course.id;
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseType').value = course.type;
    document.getElementById('courseSubject').value = course.subject || 'history';
    document.getElementById('courseTeacher').value = course.teacher;
    document.getElementById('coursePrice').value = course.price;
    document.getElementById('courseOldPrice').value = course.oldPrice || '';
    document.getElementById('courseTariffs').value = course.tariffs ? course.tariffs.join(', ') : '';
    
    document.getElementById('courseFormTitle').textContent = '✏️ Редактировать курс';
    document.getElementById('courseSaveBtn').textContent = 'Обновить';
    document.getElementById('courseCancelBtn').style.display = 'block';
}

function cancelEditCourse() {
    clearCourseForm();
}

function clearCourseForm() {
    document.getElementById('editCourseId').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('courseTeacher').value = '';
    document.getElementById('coursePrice').value = '';
    document.getElementById('courseOldPrice').value = '';
    document.getElementById('courseTariffs').value = '';
    document.getElementById('courseImage').value = '';
    document.getElementById('courseFormTitle').textContent = '➕ Добавить курс';
    document.getElementById('courseSaveBtn').textContent = 'Сохранить';
    document.getElementById('courseCancelBtn').style.display = 'none';
}

function deleteCourse(id) {
    if (!confirm('🗑️ Удалить курс?')) return;
    const data = getData();
    data.courses = data.courses.filter(c => c.id !== id);
    saveData(data);
    loadAdminData();
    alert('✅ Курс удален!');
}

// ===== ПОСТЫ =====
function renderNewsList(data) {
    const container = document.getElementById('newsList');
    if (!data.news || data.news.length === 0) {
        container.innerHTML = `<div class="empty-state">📰 Нет постов</div>`;
        return;
    }
    container.innerHTML = data.news.map(n => `
        <div class="item-card">
            <div class="item-info">
                <h4>${n.title}</h4>
                <p>${n.date || 'Дата не указана'} • ${n.size || 'medium'}</p>
                ${n.badge ? `<span style="display:inline-block; padding:2px 10px; background:var(--orange-primary); border-radius:12px; font-size:11px; color:white; margin-top:4px;">${n.badge}</span>` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editNews(${n.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteNews(${n.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function saveNews() {
    const data = getData();
    const id = document.getElementById('editNewsId').value;
    const newsData = {
        title: document.getElementById('newsTitle').value.trim(),
        content: document.getElementById('newsContent').value.trim(),
        date: document.getElementById('newsDate').value,
        size: document.getElementById('newsSize').value,
        badge: document.getElementById('newsBadge').value.trim() || null,
        image: null
    };
    
    if (!newsData.title || !newsData.content || !newsData.date) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    const imageFile = document.getElementById('newsImage').files[0];
    
    if (id) {
        const index = data.news.findIndex(n => n.id === parseInt(id));
        if (index !== -1) {
            newsData.id = parseInt(id);
            if (!imageFile) {
                newsData.image = data.news[index].image;
            }
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newsData.image = e.target.result;
                    data.news[index] = newsData;
                    saveData(data);
                    loadAdminData();
                    clearNewsForm();
                    alert('✅ Пост обновлен!');
                };
                reader.readAsDataURL(imageFile);
                return;
            }
            data.news[index] = newsData;
            saveData(data);
            loadAdminData();
            clearNewsForm();
            alert('✅ Пост обновлен!');
        }
    } else {
        newsData.id = Date.now();
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newsData.image = e.target.result;
                data.news.push(newsData);
                saveData(data);
                loadAdminData();
                clearNewsForm();
                alert('✅ Пост опубликован!');
            };
            reader.readAsDataURL(imageFile);
            return;
        }
        data.news.push(newsData);
        saveData(data);
        loadAdminData();
        clearNewsForm();
        alert('✅ Пост опубликован!');
    }
}

function editNews(id) {
    const data = getData();
    const news = data.news.find(n => n.id === id);
    if (!news) return;
    
    document.getElementById('editNewsId').value = news.id;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsContent').value = news.content;
    document.getElementById('newsDate').value = news.date || '';
    document.getElementById('newsSize').value = news.size || 'medium';
    document.getElementById('newsBadge').value = news.badge || '';
    
    document.getElementById('newsFormTitle').textContent = '✏️ Редактировать пост';
    document.getElementById('newsSaveBtn').textContent = 'Обновить';
    document.getElementById('newsCancelBtn').style.display = 'block';
}

function cancelEditNews() {
    clearNewsForm();
}

function clearNewsForm() {
    document.getElementById('editNewsId').value = '';
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsDate').value = '';
    document.getElementById('newsSize').value = 'medium';
    document.getElementById('newsBadge').value = '';
    document.getElementById('newsImage').value = '';
    document.getElementById('newsFormTitle').textContent = '➕ Добавить пост';
    document.getElementById('newsSaveBtn').textContent = 'Опубликовать';
    document.getElementById('newsCancelBtn').style.display = 'none';
}

function deleteNews(id) {
    if (!confirm('🗑️ Удалить пост?')) return;
    const data = getData();
    data.news = data.news.filter(n => n.id !== id);
    saveData(data);
    loadAdminData();
    alert('✅ Пост удален!');
}

// ===== ПРЕПОДАВАТЕЛИ =====
function renderTeachersList(data) {
    const container = document.getElementById('teachersList');
    if (!data.teachers || data.teachers.length === 0) {
        container.innerHTML = `<div class="empty-state">👨‍🏫 Нет преподавателей</div>`;
        return;
    }
    container.innerHTML = data.teachers.map(t => `
        <div class="item-card">
            <div style="display:flex; align-items:center; flex:1;">
                <img src="${t.avatar || 'images/default-avatar.png'}" class="item-preview-img" alt="${t.name}" style="border-radius:50%;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👤</text></svg>'">
                <div class="item-info">
                    <h4>${t.name}</h4>
                    <p>${t.subject}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editTeacher(${t.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteTeacher(${t.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function saveTeacher() {
    const data = getData();
    const id = document.getElementById('editTeacherId').value;
    const teacherData = {
        name: document.getElementById('teacherName').value.trim(),
        subject: document.getElementById('teacherSubject').value.trim(),
        avatar: 'images/default-avatar.png'
    };
    
    if (!teacherData.name || !teacherData.subject) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    const avatarFile = document.getElementById('teacherAvatar').files[0];
    
    if (id) {
        const index = data.teachers.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            teacherData.id = parseInt(id);
            if (!avatarFile) {
                teacherData.avatar = data.teachers[index].avatar;
            }
            if (avatarFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    teacherData.avatar = e.target.result;
                    data.teachers[index] = teacherData;
                    saveData(data);
                    loadAdminData();
                    clearTeacherForm();
                    alert('✅ Преподаватель обновлен!');
                };
                reader.readAsDataURL(avatarFile);
                return;
            }
            data.teachers[index] = teacherData;
            saveData(data);
            loadAdminData();
            clearTeacherForm();
            alert('✅ Преподаватель обновлен!');
        }
    } else {
        teacherData.id = Date.now();
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                teacherData.avatar = e.target.result;
                data.teachers.push(teacherData);
                saveData(data);
                loadAdminData();
                clearTeacherForm();
                alert('✅ Преподаватель добавлен!');
            };
            reader.readAsDataURL(avatarFile);
            return;
        }
        data.teachers.push(teacherData);
        saveData(data);
        loadAdminData();
        clearTeacherForm();
        alert('✅ Преподаватель добавлен!');
    }
}

function editTeacher(id) {
    const data = getData();
    const teacher = data.teachers.find(t => t.id === id);
    if (!teacher) return;
    
    document.getElementById('editTeacherId').value = teacher.id;
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherSubject').value = teacher.subject;
    
    document.getElementById('teacherFormTitle').textContent = '✏️ Редактировать преподавателя';
    document.getElementById('teacherSaveBtn').textContent = 'Обновить';
    document.getElementById('teacherCancelBtn').style.display = 'block';
}

function cancelEditTeacher() {
    clearTeacherForm();
}

function clearTeacherForm() {
    document.getElementById('editTeacherId').value = '';
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubject').value = '';
    document.getElementById('teacherAvatar').value = '';
    document.getElementById('teacherFormTitle').textContent = '➕ Добавить преподавателя';
    document.getElementById('teacherSaveBtn').textContent = 'Сохранить';
    document.getElementById('teacherCancelBtn').style.display = 'none';
}

function deleteTeacher(id) {
    if (!confirm('🗑️ Удалить преподавателя?')) return;
    const data = getData();
    data.teachers = data.teachers.filter(t => t.id !== id);
    saveData(data);
    loadAdminData();
    alert('✅ Преподаватель удален!');
}

// ===== РАСПИСАНИЕ =====
function renderScheduleList(data) {
    const container = document.getElementById('scheduleList');
    const schedule = data.schedule || {};
    const subjectNames = {
        history: 'История',
        society: 'Обществознание',
        math: 'ПрофМат',
        physics: 'Физика',
        literature: 'Литература'
    };
    
    if (Object.keys(schedule).length === 0) {
        container.innerHTML = `<div class="empty-state">📅 Нет расписания</div>`;
        return;
    }
    
    let html = '';
    for (const [subject, items] of Object.entries(schedule)) {
        html += `
            <div style="margin-bottom:16px; padding:12px; background:var(--gray); border-radius:8px; border-left:3px solid var(--orange-primary);">
                <h4 style="color:var(--orange-primary);">${subjectNames[subject] || subject}</h4>
                ${items.map(item => `
                    <div style="display:flex; gap:16px; font-size:13px; color:var(--text-light); padding:4px 0; border-bottom:1px solid var(--dark-gray);">
                        <span style="min-width:120px;">${item.day || '—'}</span>
                        <span style="min-width:100px;">${item.time || '—'}</span>
                        <span>${item.topic || 'Без темы'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    container.innerHTML = html;
}

function loadScheduleForAdmin() {
    const subject = document.getElementById('scheduleSubjectSelect').value;
    const data = getData();
    const schedule = data.schedule?.[subject] || [];
    const container = document.getElementById('scheduleAdminContainer');
    
    if (schedule.length === 0) {
        container.innerHTML = `
            <p style="color:var(--text-muted); text-align:center; padding:20px 0;">📭 Нет занятий для этого предмета</p>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:8px; margin-top:12px;">
                <input type="text" id="adminScheduleDay" placeholder="День" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                <input type="text" id="adminScheduleTime" placeholder="Время" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                <input type="text" id="adminScheduleTopic" placeholder="Тема" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
                <button onclick="addScheduleForAdmin('${subject}')" style="padding:8px 12px; background:var(--orange-primary); border:none; border-radius:6px; color:white; font-weight:600; cursor:pointer;">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    schedule.forEach((item, index) => {
        html += `
            <div class="schedule-admin-item">
                <input type="text" id="adminDay_${index}" value="${item.day || ''}" placeholder="День">
                <input type="text" id="adminTime_${index}" value="${item.time || ''}" placeholder="Время">
                <input type="text" id="adminTopic_${index}" value="${item.topic || ''}" placeholder="Тема">
                <div style="display:flex; gap:4px;">
                    <button class="save-schedule-btn" onclick="saveScheduleItem('${subject}', ${index})"><i class="fas fa-save"></i></button>
                    <button class="delete-schedule-btn" onclick="deleteScheduleItemAdmin('${subject}', ${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    html += `
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid var(--gray);">
            <input type="text" id="adminScheduleDay" placeholder="День" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
            <input type="text" id="adminScheduleTime" placeholder="Время" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
            <input type="text" id="adminScheduleTopic" placeholder="Тема" style="padding:8px 12px; background:var(--gray); border:1px solid var(--light-gray); border-radius:6px; color:white;">
            <button onclick="addScheduleForAdmin('${subject}')" style="padding:8px 12px; background:var(--orange-primary); border:none; border-radius:6px; color:white; font-weight:600; cursor:pointer;">
                <i class="fas fa-plus"></i> Добавить
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function addScheduleForAdmin(subject) {
    const day = document.getElementById('adminScheduleDay')?.value.trim();
    const time = document.getElementById('adminScheduleTime')?.value.trim();
    const topic = document.getElementById('adminScheduleTopic')?.value.trim();
    
    if (!day || !time || !topic) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    const data = getData();
    if (!data.schedule) data.schedule = {};
    if (!data.schedule[subject]) data.schedule[subject] = [];
    
    data.schedule[subject].push({ day, time, topic });
    saveData(data);
    loadAdminData();
    loadScheduleForAdmin();
    alert('✅ Занятие добавлено!');
}

function saveScheduleItem(subject, index) {
    const data = getData();
    const day = document.getElementById(`adminDay_${index}`)?.value.trim();
    const time = document.getElementById(`adminTime_${index}`)?.value.trim();
    const topic = document.getElementById(`adminTopic_${index}`)?.value.trim();
    
    if (!day || !time || !topic) {
        alert('❌ Заполните все поля!');
        return;
    }
    
    if (data.schedule && data.schedule[subject] && data.schedule[subject][index]) {
        data.schedule[subject][index] = { day, time, topic };
        saveData(data);
        loadAdminData();
        loadScheduleForAdmin();
        alert('✅ Занятие обновлено!');
    }
}

function deleteScheduleItemAdmin(subject, index) {
    if (!confirm('🗑️ Удалить занятие?')) return;
    const data = getData();
    if (data.schedule && data.schedule[subject]) {
        data.schedule[subject].splice(index, 1);
        saveData(data);
        loadAdminData();
        loadScheduleForAdmin();
        alert('✅ Занятие удалено!');
    }
}

// ===== НАСТРОЙКИ =====
function renderSettingsPreviews(data) {
    if (data.logo) {
        document.getElementById('logoPreview').innerHTML = `<img src="${data.logo}" class="preview-img" onerror="this.style.display='none'">`;
    }
    if (data.bannerBg) {
        document.getElementById('bgPreview').innerHTML = `<img src="${data.bannerBg}" class="preview-img" onerror="this.style.display='none'">`;
    }
    if (data.avatar) {
        document.getElementById('avatarPreview').innerHTML = `<img src="${data.avatar}" class="preview-img" style="border-radius:50%; width:80px; height:80px;" onerror="this.style.display='none'">`;
    }
}

function uploadLogo() {
    const file = document.getElementById('logoUpload').files[0];
    if (!file) return alert('Выберите файл!');
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = getData();
        data.logo = e.target.result;
        saveData(data);
        loadAdminData();
        alert('✅ Логотип обновлен!');
    };
    reader.readAsDataURL(file);
}

function uploadBackground() {
    const file = document.getElementById('bgUpload').files[0];
    if (!file) return alert('Выберите файл!');
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = getData();
        data.bannerBg = e.target.result;
        saveData(data);
        loadAdminData();
        alert('✅ Фон обновлен!');
    };
    reader.readAsDataURL(file);
}

function uploadAvatar() {
    const file = document.getElementById('avatarUpload').files[0];
    if (!file) return alert('Выберите файл!');
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = getData();
        data.avatar = e.target.result;
        saveData(data);
        loadAdminData();
        alert('✅ Аватар обновлен!');
    };
    reader.readAsDataURL(file);
}

// ===== ЭКСПОРТ/ИМПОРТ =====
function exportData() {
    const data = getData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekd-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.courses && data.news && data.teachers) {
                saveData(data);
                loadAdminData();
                alert('✅ Данные импортированы!');
            } else {
                alert('❌ Неверный формат!');
            }
        } catch (err) {
            alert('❌ Ошибка: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetData() {
    if (!confirm('⚠️ ВСЕ ДАННЫЕ БУДУТ УДАЛЕНЫ! Продолжить?')) return;
    if (!confirm('🔴 ТОЧНО УДАЛИТЬ ВСЁ?')) return;
    localStorage.removeItem('ekdData');
    location.reload();
}

// ===== ОБНОВЛЕНИЕ =====
function loadAdminData() {
    const data = getData();
    renderCoursesList(data);
    renderNewsList(data);
    renderTeachersList(data);
    renderScheduleList(data);
    renderSettingsPreviews(data);
}