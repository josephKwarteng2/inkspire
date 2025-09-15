import { useState } from "react";
import React from "react";
import { Button } from "../components/ui/button";
import { UserRoleDropdown } from "./UserRoleDropdown";
import { Toggle } from "../components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const InkspireHeader = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [theme]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Bookmarks", href: "/bookmarks" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact us", href: "/contact-us" },
  ];

  return (
    <header className="w-full bg-background text-foreground border-b border-border fixed top-0 left-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32">
        <div className="flex flex-wrap justify-between items-center h-16 min-h-[4rem]">
          <div className="flex-shrink-0 flex items-center py-2 gap-3">
            <h1 className="font-bold text-xl font-sans whitespace-nowrap logo-inkspire">
              {"{"}Inkspire
            </h1>
            <Toggle
              aria-label="Toggle theme"
              pressed={theme === "dark"}
              onPressedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="ml-3"
            >
              {theme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </Toggle>
            <UserRoleDropdown className="ml-3" />
          </div>

          <nav className="hidden md:flex flex-1 justify-end items-center space-x-2 lg:space-x-4">
            {navigationItems.map((item, idx) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `transition-colors duration-200 font-medium text-sm px-1 py-1 rounded focus:outline-none focus:ring-0 ${
                    isActive
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }${idx === navigationItems.length - 1 ? " mr-4 lg:mr-8" : ""}`
                }
                end={item.href === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="default"
              className="shadow bg-card text-card-foreground"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="shadow bg-card text-card-foreground"
            >
              Subscribe
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="transition-colors duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring text-muted-foreground hover:text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden w-full animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-b-lg shadow-lg border-t border-border bg-background text-foreground">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `block px-2 py-2 rounded-md transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-0 ${
                      isActive
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  end={item.href === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="px-3 py-2">
                <Button
                  variant="default"
                  className="w-full shadow bg-card text-card-foreground"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default InkspireHeader;
