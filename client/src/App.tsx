import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Quote from "@/pages/Quote";
import Tracking from "@/pages/Tracking";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/quote" component={Quote} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      
      {/* Protected Pages */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
