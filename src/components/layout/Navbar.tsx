import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Support", path: "/support" },
  { label: "AI Assistant", path: "/ai-chat" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'aa1552582@gmail.com';
  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
      role="banner"
      aria-label="Main navigation header"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with accessible label - removed focus ring */}
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground rounded-lg focus:outline-none"
          aria-label="Slate Academy Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight">Slate Academy</span>
        </Link>

        {/* Desktop Navigation - removed focus rings */}
        <nav
          className="hidden items-center gap-1 md:flex"
          role="navigation"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${location.pathname === link.path
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
              aria-current={location.pathname === link.path ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop User Actions - removed focus rings from buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button
                variant="hero"
                size="default"
                asChild
                aria-label="Go to dashboard"
                className="focus:outline-none"
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </Button>
              {isAdmin && (
                <Button
                  variant="secondary"
                  size="default"
                  asChild
                  aria-label="Go to admin panel"
                  className="focus:outline-none"
                >
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sign out"
                aria-label="Sign out of your account"
                className="focus:outline-none"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Log in to your account"
                className="focus:outline-none"
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                variant="hero"
                size="default"
                asChild
                aria-label="Start learning with our courses"
                className="focus:outline-none"
              >
                <Link to="/courses">Start Learning</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - removed focus ring */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu - removed focus rings */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border bg-background p-4 md:hidden"
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="false"
        >
          <nav
            className="flex flex-col gap-1"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${location.pathname === link.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                aria-current={location.pathname === link.path ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Button
                  variant="hero"
                  asChild
                  onClick={() => setMobileOpen(false)}
                  aria-label="Go to dashboard"
                  className="focus:outline-none"
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                {isAdmin && (
                  <Button variant="secondary" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={() => setMobileOpen(false)}
                  aria-label="Log in to your account"
                  className="focus:outline-none"
                >
                  <Link to="/login">Log In</Link>
                </Button>
                <Button
                  variant="hero"
                  asChild
                  onClick={() => setMobileOpen(false)}
                  aria-label="Start learning with our courses"
                  className="focus:outline-none"
                >
                  <Link to="/courses">Start Learning</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;