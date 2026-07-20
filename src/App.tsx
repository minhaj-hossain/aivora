import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";

import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import LandingPage from "./components/LandingPage.tsx";
import AuthPage from "./components/AuthPage.tsx";
import ExplorePage from "./components/ExplorePage.tsx";
import NewBoardPage from "./components/NewBoardPage.tsx";
import ManageBoardsPage from "./components/ManageBoardsPage.tsx";
import BoardWorkspace from "./components/BoardWorkspace.tsx";
import PublicBoardDetailsPage from "./components/PublicBoardDetailsPage.tsx";
import AboutPage from "./components/AboutPage.tsx";
import ContactPage from "./components/ContactPage.tsx";
import TermsPage from "./components/TermsPage.tsx";
import PrivacyPage from "./components/PrivacyPage.tsx";
import ExecutiveDashboard from "./components/ExecutiveDashboard.tsx";
import SettingsPage from "./components/dashboard/SettingsPage.tsx";

import Sidebar from "./components/dashboard/Sidebar.tsx";
import BottomNavBar from "./components/dashboard/BottomNavBar.tsx";
import MobileMenuDrawer from "./components/dashboard/MobileMenuDrawer.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// AppLayout is responsible for choosing whether to display dashboard elements
function AppLayout() {
  const { user, token, onLogout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // compatibility navigation helper passed down to older components
  const setView = (v: string) => {
    if (v === "home") navigate("/");
    else if (v === "login") navigate("/login");
    else if (v === "register") navigate("/register");
    else if (v === "explore") navigate("/explore");
    else if (v === "dashboard") navigate("/dashboard");
    else if (v === "add_board") navigate("/boards/add");
    else if (v === "manage_boards") navigate("/boards/manage");
    else if (v === "about") navigate("/about");
    else if (v === "contact") navigate("/contact");
    else if (v === "terms") navigate("/terms");
    else if (v === "privacy") navigate("/privacy");
    else if (v === "board_workspace") {
      if (selectedBoardId) {
        navigate(`/boards/${selectedBoardId}/workspace`);
      } else {
        navigate("/dashboard");
      }
    }
  };

  const currentPath = location.pathname;

  // Determine current virtual view name for active navigation highlights
  let currentView: any = "home";
  if (currentPath === "/") currentView = "home";
  else if (currentPath === "/explore") currentView = "explore";
  else if (currentPath === "/login") currentView = "login";
  else if (currentPath === "/register") currentView = "register";
  else if (currentPath === "/dashboard") currentView = "dashboard";
  else if (currentPath === "/dashboard/boards/new" || currentPath === "/boards/add") currentView = "add_board";
  else if (currentPath === "/dashboard/boards" || currentPath === "/boards/manage") currentView = "manage_boards";
  else if (currentPath === "/dashboard/settings") currentView = "settings";
  else if (currentPath.startsWith("/dashboard/boards/") || currentPath.includes("/workspace")) currentView = "board_workspace";
  else if (currentPath.includes("/boards/")) currentView = "board_detail";
  else if (currentPath === "/about") currentView = "about";
  else if (currentPath === "/contact") currentView = "contact";
  else if (currentPath === "/terms") currentView = "terms";
  else if (currentPath === "/privacy") currentView = "terms";

  const isDashboardLayout = (
    currentPath === "/dashboard" ||
    currentPath === "/dashboard/boards" ||
    currentPath === "/dashboard/boards/new" ||
    currentPath === "/dashboard/settings" ||
    currentPath === "/boards/add" ||
    currentPath === "/boards/manage" ||
    currentPath.startsWith("/dashboard/boards/") ||
    (currentPath === "/explore" && token)
  ) && !!token;
  const isAuthView = ["/login", "/register"].includes(currentPath);
  const isWorkspaceView = (currentPath.startsWith("/dashboard/boards/") && currentPath !== "/dashboard/boards/new" && currentPath !== "/dashboard/boards") || currentPath.includes("/workspace");

  const hideGlobalNavFooter = isDashboardLayout || isAuthView || isWorkspaceView;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/20">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F172A] border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500 font-mono">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  const wrapInDashboardLayout = (element: React.ReactNode) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#f8fafc] text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16 lg:pb-0">
        <Sidebar
          currentView={currentView}
          setView={setView}
          onLogout={() => {
            onLogout();
            navigate("/");
          }}
          userName={user?.name}
          userEmail={user?.email}
        />
        
        {element}

        {/* Mobile Navigation and Drawer Controls */}
        <BottomNavBar
          currentView={currentView}
          setView={setView}
          onLogout={() => {
            onLogout();
            navigate("/");
          }}
          userName={user?.name || "Alex"}
          onToggleDrawer={() => setIsDrawerOpen(true)}
        />

        <MobileMenuDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          userName={user?.name || "Alex"}
          userEmail={user?.email || "alex@aivora.app"}
          setView={setView}
          onLogout={() => {
            onLogout();
            navigate("/");
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/40 text-gray-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Dynamic Navigation Header */}
      {!hideGlobalNavFooter && (
        <Navbar 
          currentView={currentView} 
          setView={setView} 
          user={user} 
          onLogout={() => {
            onLogout();
            navigate("/");
          }} 
        />
      )}

      {/* Main Container */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage setView={setView} />} />
          <Route path="/login" element={<AuthPage view="login" setView={setView} onAuthSuccess={() => {}} />} />
          <Route path="/register" element={<AuthPage view="register" setView={setView} onAuthSuccess={() => {}} />} />
          
          <Route path="/explore" element={
            token ? wrapInDashboardLayout(
              <ExplorePage 
                token={token} 
                setView={setView} 
                setSelectedBoardId={setSelectedBoardId} 
                onCloneSuccess={(board) => {
                  setSelectedBoardId(board._id);
                  navigate(`/dashboard/boards/${board._id}`);
                }} 
              />
            ) : (
              <ExplorePage 
                token={token} 
                setView={setView} 
                setSelectedBoardId={setSelectedBoardId} 
                onCloneSuccess={(board) => {
                  setSelectedBoardId(board._id);
                  navigate(`/dashboard/boards/${board._id}`);
                }} 
              />
            )
          } />

          <Route path="/boards/:id" element={<PublicBoardDetailsPage />} />
          
          {/* Protected Dashboard Views */}
          <Route path="/dashboard" element={
            wrapInDashboardLayout(
              <ExecutiveDashboard
                token={token}
                setView={setView}
                setSelectedBoardId={setSelectedBoardId}
                onLogout={() => {
                  onLogout();
                  navigate("/");
                }}
                user={user}
              />
            )
          } />

          <Route path="/dashboard/boards/new" element={
            wrapInDashboardLayout(
              <NewBoardPage 
                token={token} 
                setView={setView} 
                onCreateSuccess={(board) => {
                  setSelectedBoardId(board._id);
                  navigate(`/dashboard/boards/${board._id}`);
                }} 
              />
            )
          } />

          <Route path="/dashboard/boards" element={
            wrapInDashboardLayout(
              <ManageBoardsPage 
                token={token} 
                setView={setView} 
                setSelectedBoardId={setSelectedBoardId} 
              />
            )
          } />

          <Route path="/dashboard/boards/:id" element={
            wrapInDashboardLayout(
              <WorkspaceWrapper />
            )
          } />

          <Route path="/dashboard/settings" element={
            wrapInDashboardLayout(
              <SettingsPage />
            )
          } />

          {/* Fallback Legacy Redirects */}
          <Route path="/boards/add" element={<Navigate to="/dashboard/boards/new" replace />} />
          <Route path="/boards/manage" element={<Navigate to="/dashboard/boards" replace />} />
          <Route path="/boards/:id/workspace" element={<LegacyWorkspaceRedirect />} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent platform footer */}
      {!hideGlobalNavFooter && <Footer setView={setView} />}

    </div>
  );
}

// Separate Workspace Wrapper to cleanly extract params
function WorkspaceWrapper() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const setView = (v: string) => {
    if (v === "home") navigate("/");
    else if (v === "dashboard") navigate("/dashboard");
    else if (v === "manage_boards") navigate("/dashboard/boards");
    else if (v === "explore") navigate("/explore");
    else if (v === "add_board") navigate("/dashboard/boards/new");
    else if (v === "settings") navigate("/dashboard/settings");
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <BoardWorkspace 
      boardId={id!} 
      token={token} 
      setView={setView} 
    />
  );
}

// Legacy workspace redirect helper
function LegacyWorkspaceRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/dashboard/boards/${id}`} replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
