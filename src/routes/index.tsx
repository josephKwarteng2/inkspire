import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const PostDetail = lazy(() => import("@/pages/BlogDetail"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminPosts = lazy(() => import("@/pages/admin/Blogs"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
const AdminPostEditor = lazy(() => import("@/pages/admin/BlogEditor"));
const AdminCategories = lazy(() => import("@/pages/admin/categories"));
const AdminComments = lazy(() => import("@/pages/admin/BlogComments"));
import AdminLayout from "@/pages/admin/Layout";
const NotFound = lazy(() => import("@/pages/NotFound"));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    setAuthed(!!localStorage.getItem("userRole"));
  }, []);
  if (authed === null) return <div className="p-8">Loading...</div>;
  return authed ? <>{children}</> : <Navigate to="/login" replace />;
}

const queryClient = new QueryClient();

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="posts" element={<AdminPosts />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="posts/:id" element={<AdminPostEditor />} />
      <Route path="comments" element={<AdminComments />} />
    </Routes>
  );
}

const AppRoutes = () => (
  <UserRoleProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Layout>
                      <Home />
                    </Layout>
                  </RequireAuth>
                }
              />
              <Route
                path="/blog"
                element={
                  <RequireAuth>
                    <Layout>
                      <Blog />
                    </Layout>
                  </RequireAuth>
                }
              />
              <Route
                path="/about-us"
                element={
                  <RequireAuth>
                    <Layout>
                      <AboutUs />
                    </Layout>
                  </RequireAuth>
                }
              />
              <Route
                path="/contact-us"
                element={
                  <RequireAuth>
                    <Layout>
                      <ContactUs />
                    </Layout>
                  </RequireAuth>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <RequireAuth>
                    <Layout>
                      <PostDetail />
                    </Layout>
                  </RequireAuth>
                }
              />
              {/* Admin routes with Next.js-style layout */}
              <Route
                path="/admin/*"
                element={
                  <RequireAuth>
                    <AdminLayout>
                      <AdminRoutes />
                    </AdminLayout>
                  </RequireAuth>
                }
              />
              {/* Default redirect */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  </UserRoleProvider>
);

export default AppRoutes;
