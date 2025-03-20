import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import './stylesheet.css'
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Verity - Scraps for writing inspiration",
    description: "by Noah Jaffe and Henry Osterweis",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased font-helvetica bg-[#F6F5F5]`}
            >
                <AuthProvider>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}