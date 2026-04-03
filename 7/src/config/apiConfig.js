export const API_CONFIG = {
  posts: {
    base: "https://jsonplaceholder.typicode.com/posts",
    title: "📮 Посты",
    fields: { title: "Заголовок", body: "Текст" }
  },
  todos: {
    base: "https://jsonplaceholder.typicode.com/todos",
    title: "✅ Задачи",
    fields: { title: "Название", completed: "Статус" }
  },
  comments: {
    base: "https://jsonplaceholder.typicode.com/comments",
    title: "💬 Комментарии",
    fields: { name: "Имя", email: "Email", body: "Комментарий" }
  }
};
