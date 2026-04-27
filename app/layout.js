import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import "@/styles/globals.css";

export const metadata = {
  title: "AgroCare - Crop Disease Detection",
  description:
    "Advanced crop disease detection for wheat, maize, and rice using cutting-edge technology.",
  keywords: [
    "crop disease",
    "agriculture",
    "disease detection",
    "wheat",
    "maize",
    "rice",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body style={{ backgroundColor: "white" }}>
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
