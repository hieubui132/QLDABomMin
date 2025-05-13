// Layouts
import NonAuthLayout from "@/layouts/NonAuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
// Pages
import Login from "@/pages/Authentication/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";

//Other
import { type ComponentType } from "react";

interface Route {
  path: string;
  component: ComponentType;
  layout?: ComponentType<{ children: React.ReactNode }> | null;
}

// Private routes
const privateRoutes: Route[] = [
  {
    path: "/dashboard",
    component: Dashboard,
    layout: DashboardLayout,
  },
  {
    path: "/projects/:projectId",
    component: Projects,
  },
];

// Public routes
const publicRoutes: Route[] = [
  { path: "/login", component: Login, layout: NonAuthLayout },
];

export { publicRoutes, privateRoutes };
