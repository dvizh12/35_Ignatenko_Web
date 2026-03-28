const API_CONFIG = {
    posts: {
        base: 'https://jsonplaceholder.typicode.com/posts',
        title: '📮 Управление постами',
        desc: 'GET, POST, PUT, DELETE. Посты от пользователей.',
        itemName: 'пост',
        fields: { title: 'Заголовок', body: 'Содержание' },
        renderItem: (item) => ({
            title: item.title,
            subtitle: `Автор ID: ${item.userId}`,
            body: item.body,
            id: item.id
        })
    },
    todos: {
        base: 'https://jsonplaceholder.typicode.com/todos',
        title: '✅ Список задач (Todo)',
        desc: 'GET, POST, PUT, DELETE. Управляйте задачами.',
        itemName: 'задача',
        fields: { title: 'Название задачи', completed: 'Статус (true/false)' },
        renderItem: (item) => ({
            title: item.title,
            subtitle: `Статус: ${item.completed ? '✔️ Выполнено' : '⏳ Не выполнено'}`,
            body: `User ID: ${item.userId}`,
            id: item.id,
            completed: item.completed
        })
    },
    comments: {
        base: 'https://jsonplaceholder.typicode.com/comments',
        title: '💬 Комментарии',
        desc: 'GET, POST, PUT, DELETE. Комментарии к постам.',
        itemName: 'комментарий',
        fields: { name: 'Имя автора', email: 'Email', body: 'Текст комментария' },
        renderItem: (item) => ({
            title: item.name,
            subtitle: `📧 ${item.email} | postId: ${item.postId}`,
            body: item.body,
            id: item.id
        })
    }
};

let currentApiType = 'posts';
let currentData = [];

const container = document.getElementById('api-view-container');

function showLoading() {
    container.innerHTML = `<div class="loading"><div>⏳ Загрузка данных... Пожалуйста, подождите</div></div>`;
}

function showError(message) {
    container.innerHTML = `<div class="error-msg">⚠️ Ошибка: ${message}<br><button class="primary-btn" style="margin-top:1rem" id="retry-btn">🔄 Повторить</button></div>`;
    const retry = document.getElementById('retry-btn');
    if (retry) retry.addEventListener('click', () => loadAndRenderCurrentAPI());
}

async function apiRequest(url, method, body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        if (method === 'DELETE') {
            if (response.status === 204) return { success: true };
            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        }
        return await response.json();
    } catch (err) {
        console.error(`API ${method} error:`, err);
        throw err;
    }
}

function getBaseUrl(type, id = null) {
    let base = API_CONFIG[type].base;
    if (id) return `${base}/${id}`;
    return base;
}

async function fetchAllItems(type) {
    const url = getBaseUrl(type);
    const data = await apiRequest(url, 'GET');
    return Array.isArray(data) ? data.slice(0, 10) : [];
}

async function createItem(type, newData) {
    const url = getBaseUrl(type);
    const created = await apiRequest(url, 'POST', newData);
    return created;
}

async function updateItem(type, id, updatedFields) {
    const url = getBaseUrl(type, id);
    const existing = await apiRequest(url, 'GET');
    const merged = { ...existing, ...updatedFields, id: existing.id };
    const result = await apiRequest(url, 'PUT', merged);
    return result;
}

async function deleteItem(type, id) {
    const url = getBaseUrl(type, id);
    await apiRequest(url, 'DELETE');
    return { deletedId: id };
}

async function loadAndRenderCurrentAPI() {
    if (!currentApiType) return;
    showLoading();
    try {
        const items = await fetchAllItems(currentApiType);
        currentData = items;
        renderAPIInterface(items);
    } catch (err) {
        showError(`Не удалось загрузить данные из ${API_CONFIG[currentApiType].base}. ${err.message}`);
    }
}

function renderAPIInterface(items) {
    const config = API_CONFIG[currentApiType];
    const itemName = config.itemName;

    let itemsHtml = '';
    if (!items || items.length === 0) {
        itemsHtml = `<div class="empty-placeholder">📭 Пока нет ${itemName}ов. Создайте первый через форму выше!</div>`;
    } else {
        const cards = items.map(item => {
            const rendered = config.renderItem(item);
            let specialLine = '';
            if (currentApiType === 'comments') {
                specialLine = `<p><strong>📧 Email:</strong> ${escapeHtml(item.email || '—')}</p>`;
            }
            if (currentApiType === 'posts') {
                specialLine = `<p><strong>👤 userId:</strong> ${item.userId}</p>`;
            }
            return `
                <div class="data-card" data-id="${item.id}">
                    <h4>📌 ${escapeHtml(rendered.title?.substring(0, 60) || 'Без названия')}</h4>
                    <p><small>${escapeHtml(rendered.subtitle || '')}</small></p>
                    ${specialLine}
                    <p>📄 ${escapeHtml(rendered.body?.substring(0, 100) || '—')}</p>
                    <div class="card-actions">
                        <button class="small warning" onclick="window.openEditModal(${item.id})">✏️ Редактировать</button>
                        <button class="small danger" onclick="window.confirmDeleteItem(${item.id})">🗑 Удалить</button>
                    </div>
                </div>
            `;
        }).join('');
        itemsHtml = `<div class="card-list">${cards}</div>`;
    }

    let createFormHtml = '';
    const fields = config.fields;
    const formInputs = Object.keys(fields).map(fieldKey => {
        if (fieldKey === 'completed') {
            return `
                <div class="form-group">
                    <label>${fields[fieldKey]}</label>
                    <select id="field-${fieldKey}" style="width:100%; padding:0.6rem; border-radius:18px;">
                        <option value="false">❌ Не выполнено</option>
                        <option value="true">✅ Выполнено</option>
                    </select>
                </div>
            `;
        }
        return `
            <div class="form-group">
                <label>${fields[fieldKey]}</label>
                <input type="text" id="field-${fieldKey}" placeholder="Введите ${fields[fieldKey].toLowerCase()}" />
            </div>
        `;
    }).join('');

    createFormHtml = `
        <div class="form-card">
            <h3 style="width:100%; margin-bottom:0.5rem;">➕ Создать новый ${itemName}</h3>
            ${formInputs}
            <div class="form-group">
                <button id="create-new-btn" class="primary-btn">Создать (POST)</button>
            </div>
        </div>
    `;

    const fullHtml = `
        <div class="panel-header">
            <h2>${config.title}</h2>
            <span class="badge-api">${config.base}</span>
        </div>
        <p style="margin-bottom: 1.2rem; color: #4b5563;">${config.desc} • Все методы: GET, POST, PUT, DELETE</p>
        ${createFormHtml}
        <div style="margin-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>📋 Список ${itemName}ов (последние 10 записей)</h3>
                <button id="refresh-data-btn" class="small" style="background:#e9eef3;">🔄 Обновить (GET)</button>
            </div>
            ${itemsHtml}
        </div>
    `;
    container.innerHTML = fullHtml;

    const createBtn = document.getElementById('create-new-btn');
    if (createBtn) {
        createBtn.addEventListener('click', async () => {
            await handleCreateItem();
        });
    }
    const refreshBtn = document.getElementById('refresh-data-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            showLoading();
            try {
                const fresh = await fetchAllItems(currentApiType);
                currentData = fresh;
                renderAPIInterface(fresh);
            } catch (err) {
                showError('Ошибка при обновлении: ' + err.message);
            }
        });
    }
}

async function handleCreateItem() {
    const config = API_CONFIG[currentApiType];
    const fields = config.fields;
    const newObj = {};
    
    for (let key of Object.keys(fields)) {
        const inputEl = document.getElementById(`field-${key}`);
        if (inputEl) {
            let value = inputEl.value;
            if (key === 'completed') {
                value = value === 'true';
            }
            newObj[key] = value;
        }
    }
    
    if (!newObj.title && currentApiType === 'posts') newObj.title = 'Новый пост';
    if (!newObj.body && currentApiType === 'posts') newObj.body = 'Текст поста...';
    if (!newObj.title && currentApiType === 'todos') newObj.title = 'Новая задача';
    if (currentApiType === 'todos' && newObj.completed === undefined) newObj.completed = false;
    if (currentApiType === 'comments') {
        if (!newObj.name) newObj.name = 'Аноним';
        if (!newObj.email) newObj.email = 'anon@example.com';
        if (!newObj.body) newObj.body = 'Текст комментария';
        if (!newObj.postId) newObj.postId = 1;
    }
    if (currentApiType === 'posts' && !newObj.userId) newObj.userId = 1;
    if (currentApiType === 'todos' && !newObj.userId) newObj.userId = 1;
    
    const createBtn = document.getElementById('create-new-btn');
    const originalText = createBtn?.innerText;
    if (createBtn) {
        createBtn.innerText = 'Отправка...';
        createBtn.disabled = true;
    }
    try {
        await createItem(currentApiType, newObj);
        const updatedList = await fetchAllItems(currentApiType);
        currentData = updatedList;
        renderAPIInterface(updatedList);
        showTemporaryToast('✅ Создано успешно!');
    } catch (err) {
        alert(`Ошибка создания: ${err.message}`);
    } finally {
        if (createBtn) {
            createBtn.innerText = originalText;
            createBtn.disabled = false;
        }
    }
}

window.openEditModal = async (id) => {
    const config = API_CONFIG[currentApiType];
    const item = currentData.find(i => i.id == id);
    if (!item) {
        alert('Элемент не найден в текущем списке, обновите страницу');
        return;
    }
    
    const fields = config.fields;
    let updatedValues = {};
    for (let [fieldKey, label] of Object.entries(fields)) {
        let currentVal = item[fieldKey] !== undefined ? item[fieldKey] : '';
        if (fieldKey === 'completed') currentVal = currentVal ? 'true' : 'false';
        let newVal = prompt(`Редактировать ${label}:`, currentVal);
        if (newVal !== null) {
            if (fieldKey === 'completed') {
                updatedValues[fieldKey] = newVal.toLowerCase() === 'true';
            } else {
                updatedValues[fieldKey] = newVal;
            }
        } else {
            return;
        }
    }
    
    if (currentApiType === 'posts' && updatedValues.userId === undefined && item.userId) updatedValues.userId = item.userId;
    if (currentApiType === 'todos' && updatedValues.userId === undefined && item.userId) updatedValues.userId = item.userId;
    if (currentApiType === 'comments' && updatedValues.postId === undefined && item.postId) updatedValues.postId = item.postId;
    
    try {
        showLoading();
        await updateItem(currentApiType, id, updatedValues);
        const fresh = await fetchAllItems(currentApiType);
        currentData = fresh;
        renderAPIInterface(fresh);
        showTemporaryToast('✏️ Обновлено (PUT)');
    } catch (err) {
        alert('Ошибка обновления: ' + err.message);
        await loadAndRenderCurrentAPI();
    }
};

window.confirmDeleteItem = async (id) => {
    const config = API_CONFIG[currentApiType];
    const confirmDel = confirm(`Вы уверены, что хотите удалить ${config.itemName} #${id}?`);
    if (!confirmDel) return;
    try {
        showLoading();
        await deleteItem(currentApiType, id);
        const fresh = await fetchAllItems(currentApiType);
        currentData = fresh;
        renderAPIInterface(fresh);
        showTemporaryToast(`🗑 Удалено (DELETE)`);
    } catch (err) {
        alert(`Ошибка удаления: ${err.message}`);
        await loadAndRenderCurrentAPI();
    }
};

function showTemporaryToast(message) {
    let toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#1f2937';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '40px';
    toast.style.zIndex = '999';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function setActiveApi(apiType) {
    currentApiType = apiType;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.api === apiType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    loadAndRenderCurrentAPI();
}
function initNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const api = btn.dataset.api;
            if (api && API_CONFIG[api]) {
                setActiveApi(api);
            }
        });
    });
    setActiveApi('posts');
}

initNavigation();
