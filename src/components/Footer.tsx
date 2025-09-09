import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About us", href: "/about-us" },
  { label: "Contact us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const socialIcons = [
  { label: "Facebook", icon: <FacebookIcon className="w-5 h-5" />, href: "#" },
  { label: "Twitter", icon: <TwitterIcon className="w-5 h-5" />, href: "#" },
  {
    label: "Instagram",
    icon: <InstagramIcon className="w-5 h-5" />,
    href: "#",
  },
  { label: "LinkedIn", icon: <LinkedinIcon className="w-5 h-5" />, href: "#" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-background text-foreground border-t border-border pt-10 pb-6 px-4 sm:px-8 lg:px-24 xl:px-32 2xl:px-48">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
          <div className="mb-4 md:mb-0">
            <h2 className="font-extrabold text-3xl font-sans whitespace-nowrap drop-shadow-lg logo-inkspire">{`{Inkspire}`}</h2>
          </div>
          <nav className="flex flex-wrap gap-x-2 gap-y-1 md:gap-x-4 lg:gap-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `transition-colors duration-200 px-1 py-0.5 ${
                    isActive
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  }`
                }
                end={item.href === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="bg-card rounded-lg py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="text-2xl font-bold text-card-foreground mb-4 md:mb-0 md:text-left text-center">
            Subscribe to our news letter to get <br /> latest updates and news
          </div>
          <form className="flex w-full md:w-auto gap-2 md:gap-4">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-background border border-border rounded px-4 py-2 text-foreground text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-background font-bold rounded px-6 py-2 transition-colors duration-200 shadow"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
          <div className="text-muted-foreground text-sm md:text-left text-center">
            Finstreet 118 2561 Fintown
            <br />
            Hello@inkspire.com &nbsp; 020 7993 2905
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            {socialIcons.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground"
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Removed unused style tag. All styling should be handled by Tailwind CSS classes. */}
    </footer>
  );
};

export default Footer;
