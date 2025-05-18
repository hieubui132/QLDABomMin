// Layouts
import NonAuthLayout from "@/layouts/NonAuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
// Pages
import Login from "@/pages/Authentication/Login";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import AddIssue from "@/pages/AddIssue";
import Issues from "@/pages/Issues";
import FilesManager from "@/pages/FilesManager";

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
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/projects/:projectId/add-issue",
    component: AddIssue,
  },
  {
    path: "/projects/:projectId/issues",
    component: Issues,
  },
  {
    path: "/projects/:projectId/files",
    component: FilesManager,
  },
  //tất cả route không match với bên trên
  {
    path: "*",
    component: Dashboard,
    layout: DashboardLayout,
  },
];

// Public routes
const publicRoutes: Route[] = [
  { path: "/login", component: Login, layout: NonAuthLayout },
];

export { publicRoutes, privateRoutes };
