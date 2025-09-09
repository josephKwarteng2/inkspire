import React from "react";
import InkspireHeader from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background transition-all duration-200">
      <InkspireHeader />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
