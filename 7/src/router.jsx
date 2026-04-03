import { createBrowserRouter } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import TodosPage from "./pages/TodosPage";
import CommentsPage from "./pages/CommentsPage";

export const router = createBrowserRouter([
  { path: "/", element: <PostsPage /> },
  { path: "/posts", element: <PostsPage /> },
  { path: "/todos", element: <TodosPage /> },
  { path: "/comments", element: <CommentsPage /> }
]);
