import "../styles/global.css";
import TopNavBar from "@components/topnavbar/TopNavBar";
import Footer from "@components/footer/Footer";
import { AuthProvider } from "@auth/AuthContext";

export const metadata = {
  title: {
    default: "WhatNow Studio",
    template: "%s | WhatNow Studio",
  },
  authors: [{ name: "Huixin Yang" }],
  icons: {
    icon: "/assets/images/notica-colour.png",
    apple: "/assets/images/notica-colour.png",
    shortcut: "/assets/images/notica-colour.png",
  },
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
