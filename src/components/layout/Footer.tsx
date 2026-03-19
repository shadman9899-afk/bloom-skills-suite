import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Courses: [
    { label: "Design", path: "/courses?category=design" },
    { label: "Coding", path: "/courses?category=coding" },
    { label: "Marketing", path: "/courses?category=marketing" },
    { label: "Data Analytics", path: "/courses?category=data" },
  ],
  Company: [
    { label: "About Us", path: "#" },
    { label: "Careers", path: "#" },
    { label: "Blog", path: "#" },
  ],
  Support: [
    { label: "Help Center", path: "/support" },
    { label: "Contact", path: "/support" },
    { label: "AI Assistant", path: "/ai-chat" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Slate Academy</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Build real skills with real-world projects. Join thousands of learners transforming their careers.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Learnix. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
