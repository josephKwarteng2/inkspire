import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { JSX } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

type Social = "facebook" | "twitter" | "instagram" | "linkedin";

type Author = {
  name: string;
  role: string;
  image: string;
  socials: Social[];
  featured?: boolean;
};

const authors: Author[] = [
  {
    name: "Floyd Miles",
    role: "Content Writer @Company",
    image: "/authors/author1.jpg",
    socials: ["facebook", "twitter", "instagram", "linkedin"],
  },
  {
    name: "Dianne Russell",
    role: "Content Writer @Company",
    image: "/authors/author2.jpg",
    socials: ["facebook", "twitter", "instagram", "linkedin"],
    featured: true,
  },
  {
    name: "Jenny Wilson",
    role: "Content Writer @Company",
    image: "/authors/author3.jpg",
    socials: ["facebook", "twitter", "instagram", "linkedin"],
  },
  {
    name: "Leslie Alexander",
    role: "Content Writer @Company",
    image: "/authors/author4.jpg",
    socials: ["facebook", "twitter", "instagram", "linkedin"],
  },
];

const socialIcons: Record<Social, JSX.Element> = {
  facebook: <FaFacebookF className="w-4 h-4" />,
  twitter: <FaTwitter className="w-4 h-4" />,
  instagram: <FaInstagram className="w-4 h-4" />,
  linkedin: <FaLinkedinIn className="w-4 h-4" />,
};

const logos = [
  "/logos/logo1.svg",
  "/logos/logo2.svg",
  "/logos/logo3.svg",
  "/logos/logo4.svg",
  "/logos/logo5.svg",
  "/logos/logo6.svg",
];

const Authors = () => (
  <section className="w-full py-16 px-2 sm:px-6 lg:px-12 xl:px-24 2xl:px-32">
    <h2 className="text-3xl font-extrabold text-center mb-12 text-foreground">
      List of Authors
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {authors.map((author) => (
        <div
          key={author.name}
          className={`flex flex-col items-center bg-muted rounded-lg p-8 text-center shadow-sm ${
            author.featured ? "bg-yellow-50" : ""
          }`}
        >
          <Avatar className="w-28 h-28 mb-6 mx-auto">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-2xl font-extrabold text-foreground mb-1">
            {author.name}
          </div>
          <div className="text-muted-foreground mb-4">{author.role}</div>
          <div className="flex gap-4 justify-center">
            {author.socials.map((social) => (
              <a
                key={social}
                href="#"
                className="text-foreground hover:text-primary transition"
              >
                {socialIcons[social]}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-muted-foreground text-base flex items-center gap-2">
        <span className="font-medium">We are</span>
        <span className="font-bold text-foreground">Featured in</span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 mt-2">
        {logos.map((logo, idx) => (
          <img key={idx} src={logo} alt="logo" className="h-8 w-auto" />
        ))}
      </div>
    </div>
  </section>
);

export default Authors;
