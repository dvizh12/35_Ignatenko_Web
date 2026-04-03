import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <RouterProvider router={router} />
      </main>
    </>
  );
}
