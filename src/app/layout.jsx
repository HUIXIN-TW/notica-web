import "../styles/global.css";
import Footer from "@components/footer/Footer";
import { AuthProvider } from "@auth/AuthContext";

export const metadata = {
  title: {
    default: "WhatNow Studio",
    template: "%s | WhatNow Studio",
  },
  applicationName: "Japan Trip",
  appleWebApp: {
    title: "Japan Trip",
    capable: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/tmp/japan-trip.png",
    apple: "/tmp/japan-trip.png",
  },
  authors: [{ name: "Huixin Yang" }],
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <div className="gradient-layer" />
      <div className="content-layer">
        <AuthProvider>
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
