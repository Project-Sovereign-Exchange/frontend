import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../src/styles/globals.css"
import {Navbar} from "@/components/common/Navbar";
import {ThemeProvider} from "@/components/theme-provider";
import {AuthProvider} from "@/lib/auth/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TCG Emporium",
    description: "Your one-stop shop for all things trading card games",
};

export default function RootLayout({
                                       children,
                                        params,
                                   }: Readonly<{
    children: React.ReactNode;
    params: { segment?: string[];  };
}>) {
    const isAdminRoute = params.segment?.[0] === "admin";
    console.log("isAdminRoute:", params.segment?.[0]);

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex flex-col max-h-screen">
                            {!isAdminRoute && <Navbar />}
                                <main>
                                    <div className="max-w-7xl w-full mx-auto px-4">
                                        {children}
                                    </div>
                                </main>
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
