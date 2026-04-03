"use client";

import * as React from "react";
import Link from "next/link";
import { User, Menu, X, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { AuthModal } from "./auth/AuthModal";

const navLinks = [
    { name: "Ana Səhifə", href: "/" },
    { name: "Xidmətlər", href: "/#xidmetler" },
    { name: "Haqqımızda", href: "/#haqqimizda" },
    { name: "Əlaqə", href: "/#elaqe" },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isAuthOpen, setIsAuthOpen] = React.useState(false);
    const [authView, setAuthView] = React.useState<"login" | "register">("login");
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userRole, setUserRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            setIsLoggedIn(true);
            try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                const decodedToken = JSON.parse(jsonPayload);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error("Token oxunarkən xəta baş verdi", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.reload();
    };

    const openAuth = (view: "login" | "register") => {
        setAuthView(view);
        setIsAuthOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
                                Gözəllik Salonu
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-foreground/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />

                        {isLoggedIn ? (
                            <div className="flex items-center gap-3 border-l border-border pl-4">
                                {userRole === "admin" ? (
                                    <Link href="/admin">
                                        <Button variant="primary" size="sm" className="font-bold shadow-sm gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/dashboard">
                                        <Button variant="primary" size="sm" className="font-bold shadow-sm gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="secondary" size="sm" className="font-bold text-red-600 dark:text-red-400 gap-2" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                    Çıxış
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-border pl-4">
                                <Button variant="secondary" size="sm" className="font-bold" onClick={() => openAuth("login")}>
                                    Giriş
                                </Button>
                                <Button variant="primary" size="sm" className="font-bold shadow-sm" onClick={() => openAuth("register")}>
                                    Qeydiyyat
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0 text-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-b border-border bg-background px-4 py-4 shadow-lg">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-base font-semibold text-foreground/90 hover:text-primary-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-2 border-t border-border">
                                {isLoggedIn ? (
                                    <>
                                        {userRole === "admin" ? (
                                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="primary" className="w-full justify-center font-bold shadow-sm gap-2">
                                                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                                {/* DÜZƏLİŞ: Mobil Dashboard düyməsi */}
                                                <Button variant="primary" className="w-full justify-center font-bold shadow-sm gap-2">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                        <Button variant="secondary" className="w-full justify-center font-bold text-red-600 dark:text-red-400 gap-2" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4" /> Çıxış
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <>
                                            <Button variant="secondary" className="w-full justify-center font-bold" onClick={() => openAuth("login")}>
                                                Giriş
                                            </Button>
                                            <Button variant="primary" className="w-full justify-center font-bold shadow-sm" onClick={() => openAuth("register")}>
                                                Qeydiyyat
                                            </Button>
                                        </>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialView={authView}
            />
        </>
    );
}