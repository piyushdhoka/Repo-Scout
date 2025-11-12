import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Navigation/Header";
import { NavigationSidebar } from "@/components/Navigation/NavigationSidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { LandingGuard } from "@/components/Auth/LandingGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import Loader from "@/components/Loader";

// Lazy load route components for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const HomePage = lazy(() => import("./pages/SearchPage")); // Renamed for clarity
const Guidance = lazy(() => import("./pages/Guidance"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Debugging: Log all environment variables available to Vite
// console.log('All VITE_ environment variables:', import.meta.env);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-black">
              <Header />
              <NavigationSidebar />
              <ErrorBoundary>
                <main>
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <Loader />
                  </div>
                }>
                  <Routes>
                    {/* Public routes - Landing page redirects logged-in users to /home */}
                    <Route path="/" element={
                      <LandingGuard>
                        <LandingPage />
                      </LandingGuard>
                    } />
                    <Route path="/auth" element={
                      <LandingGuard>
                        <AuthPage />
                      </LandingGuard>
                    } />

                    {/* Protected routes */}
                    <Route path="/home" element={
                      <AuthGuard>
                        <HomePage />
                      </AuthGuard>
                    } />

                    {/* Legacy routes */}
                    <Route path="/guidance" element={<Guidance />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </ErrorBoundary>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
