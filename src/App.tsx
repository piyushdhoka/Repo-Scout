import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Navigation/Header";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import Guidance from "./pages/Guidance";
import NotFound from "./pages/NotFound";

// Debugging: Log all environment variables available to Vite
// console.log('All VITE_ environment variables:', import.meta.env);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-black">
            <Header />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected routes */}
                <Route path="/search" element={
                  <AuthGuard>
                    <SearchPage />
                  </AuthGuard>
                } />

                {/* Legacy routes */}
                <Route path="/guidance" element={<Guidance />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
