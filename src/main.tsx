import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { ThemeProvider } from "@/components/theme-provider";
import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import AdminCoursesPage from "@/pages/admin/courses";
import AdminEnrollmentsPage from "@/pages/admin/enrollments";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "admin/courses", element: <AdminCoursesPage /> },
      { path: "admin/enrollments", element: <AdminEnrollmentsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
