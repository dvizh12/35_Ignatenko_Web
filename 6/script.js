const content = document.getElementById('content');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const closeModalBtn = document.getElementById('closeModal');

let currentAction = null; // для модалки

// Меню
const tabs = document.querySelectorAll('nav ul li a');
tabs.forEach(tab => tab.addEventListener('click', (e) => {
  e.preventDefault();
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
}));

document.getElementById('usersTab').addEventListener('click', () => loadUsers());
document.getElementById('postsTab').addEventListener('click', () => loadPosts());
document.getElementById('todosTab').addEventListener('click', () => loadTodos());

function showLoader() {
  content.innerHTML = '<p>Загрузка данных...</p>';
}

// ===== USERS =====
async function loadUsers() {
  showLoader();
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();

    content.innerHTML = '';
    users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Website: ${user.website}</p>
        <div style="display:flex;gap:5px">
          <button onclick="openModal('editUser', ${user.id})">Редактировать</button>
          <button onclick="deleteUser(${user.id})">Удалить</button>
        </div>
      `;
      content.appendChild(div);
    });
  } catch {
    content.innerHTML = '<p>Ошибка при загрузке пользователей.</p>';
  }
}

async function deleteUser(id) {
  await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' });
  loadUsers();
}

// ===== POSTS =====
async function loadPosts() {
  showLoader();
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  content.innerHTML = '';
  posts.slice(0,5).forEach(post => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <button onclick="openModal('editPost', ${post.id})">Редактировать</button>
    `;
    content.appendChild(div);
  });
}

// ===== TODOS =====
async function loadTodos() {
  showLoader();
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await res.json();

  content.innerHTML = '';
  todos.slice(0,5).forEach(todo => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <p>${todo.title} — ${todo.completed ? '✅' : '❌'}</p>
      <button onclick="openModal('addTodo')">Добавить задачу</button>
    `;
    content.appendChild(div);
  });
}

// ===== MODAL =====
closeModalBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if(e.target == modal) modal.style.display = 'none'; }

function openModal(action, id=null) {
  currentAction = { action, id };
  modal.style.display = 'block';
  modalForm.innerHTML = '';

  if(action === 'editUser') {
    modalTitle.textContent = 'Редактировать пользователя';
    modalForm.innerHTML = `
      <input type="text" placeholder="Имя" id="userName" required>
      <input type="email" placeholder="Email" id="userEmail" required>
      <button type="submit">Сохранить</button>
    `;
    modalForm.onsubmit = async e => {
      e.preventDefault();
      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PATCH',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name, email })
      });
      modal.style.display = 'none';
      loadUsers();
    };
  }

  if(action === 'editPost') {
    modalTitle.textContent = 'Редактировать пост';
    modalForm.innerHTML = `
      <input type="text" placeholder="Заголовок" id="postTitle" required>
      <textarea placeholder="Текст" id="postBody" required></textarea>
      <button type="submit">Сохранить</button>
    `;
    modalForm.onsubmit = async e => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value;
      const body = document.getElementById('postBody').value;
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PATCH',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ title, body })
      });
      modal.style.display = 'none';
      loadPosts();
    };
  }

  if(action === 'addTodo') {
    modalTitle.textContent = 'Добавить новую задачу';
    modalForm.innerHTML = `
      <input type="text" placeholder="Название задачи" id="todoTitle" required>
      <button type="submit">Создать</button>
    `;
    modalForm.onsubmit = async e => {
      e.preventDefault();
      const title = document.getElementById('todoTitle').value;
      await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ title, completed: false })
      });
      modal.style.display = 'none';
      loadTodos();
    };
  }
}