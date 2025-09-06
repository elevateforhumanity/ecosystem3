import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, X, Building, GraduationCap, Users, CreditCard, FileCheck, Home } from "lucide-react";

// Sister Site Components
import Hub from "./pages/Hub";
import Programs from "./pages/Programs";
import LMS from "./pages/LMS";
import Connect from "./pages/Connect";
import Pay from "./pages/Pay";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sisterSites = [
    { path: "/", icon: Home, label: "Hub", description: "Main Landing" },
    { path: "/programs", icon: Building, label: "Programs", description: "Workforce Programs" },
    { path: "/lms", icon: GraduationCap, label: "LMS", description: "Learning Platform" },
    { path: "/connect", icon: Users, label: "Connect", description: "Community" },
    { path: "/pay", icon: CreditCard, label: "Pay", description: "Payment Portal" },
    { path: "/compliance", icon: FileCheck, label: "Compliance", description: "Federal Compliance" },
  ];

  const currentSite = sisterSites.find(site => 
    location === site.path || (site.path !== "/" && location.startsWith(site.path))
  ) || sisterSites[0];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Current Site */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <currentSite.icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Workforce</h1>
                <p className="text-sm text-gray-500">{currentSite.description}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {sisterSites.map((site) => {
              const isActive = location === site.path || (site.path !== "/" && location.startsWith(site.path));
              return (
                <Link
                  key={site.path}
                  href={site.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <site.icon className="h-4 w-4" />
                  <span>{site.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {sisterSites.map((site) => {
              const isActive = location === site.path || (site.path !== "/" && location.startsWith(site.path));
              return (
                <Link
                  key={site.path}
                  href={site.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <site.icon className="h-5 w-5" />
                  <div>
                    <div>{site.label}</div>
                    <div className="text-sm text-gray-500">{site.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Home className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Elevate for Humanity</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Community-based nonprofit and workforce hub. Transform your career with AI & Data Science training.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Elevate for Humanity • All rights reserved
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/programs" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Programs
              </Link>
              <Link href="/lms" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Learning
              </Link>
              <Link href="/connect" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Connect
              </Link>
              <Link href="/compliance" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Compliance
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <div className="space-y-2">
              <a href="/help" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Help Center
              </a>
              <a href="/policies/hipaa" className="block text-gray-600 hover:text-blue-600 transition-colors">
                HIPAA Policy
              </a>
              <a href="/funding" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Funding
              </a>
              <a href="/portal" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Hub} />
      <Route path="/programs/:slug?" component={Programs} />
      <Route path="/lms/:module?" component={LMS} />
      <Route path="/connect/:section?" component={Connect} />
      <Route path="/pay/:action?" component={Pay} />
      <Route path="/compliance/:section?" component={Compliance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;