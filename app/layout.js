import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
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
    <html lang="en">
      <body style={{ backgroundColor: "white" }}>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
