import "../styles/global.css";
import TopNavBar from "@components/topnavbar/TopNavBar";
import Footer from "@components/footer/Footer";
import { AuthProvider } from "@auth/AuthContext";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://huixinyang.com",
  ),
  title: {
    default: "WhatNow Studio",
    template: "%s | WhatNow Studio",
  },
  authors: [{ name: "Huixin Yang" }],
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <div className="gradient-layer" />
      <div className="content-layer">
        <AuthProvider>
          <div className="top-section">
            <TopNavBar />
          </div>
          <div className="main-section">
            <main>{children}</main>
          </div>
          <div className="footer-section">
            <Footer />
          </div>
        </AuthProvider>
      </div>
    </body>
  </html>
);

export default RootLayout;
