import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Team } from "./pages/Team";
import { Projects } from "./pages/Projects";
import { Plans } from "./pages/Plans";
import { Contact } from "./pages/Contact";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";
import { RouteError } from "./pages/RouteError";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: Home },
      { path: "team", Component: Team },
      { path: "projects", Component: Projects },
      { path: "plans", Component: Plans },
      { path: "contact", Component: Contact },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound }
    ]
  }
]);
export {
  router
};
