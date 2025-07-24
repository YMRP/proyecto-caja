// src/components/Layout.tsx
import Footer from "../components/Footer";
import Header from "../components/Header";

import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}

export default Layout;
