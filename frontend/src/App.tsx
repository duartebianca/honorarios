import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./app/notFound/notFound";
import Formulario from "./app/home/homePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Formulario />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
