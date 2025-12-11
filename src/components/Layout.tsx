import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>

      <footer className="bg-white border-t py-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Convertor Imagini. Toate drepturile rezervate.
      </footer>
    </div>
  );
};

export default Layout;
