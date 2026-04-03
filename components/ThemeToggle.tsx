"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full" />;
    }

    const currentTheme = theme === "system" ? resolvedTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="sm"

            className="relative w-10 h-10 p-0 rounded-full overflow-hidden flex items-center justify-center group hover:bg-[#352514] dark:hover:bg-[#332414] transition-all duration-300"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {isDark ? (
                      
                        <Sun className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform" />
                    ) : (
                       
                        <Moon className="h-6 w-6 text-zinc-700 group-hover:text-[#EAE7E2] group-hover:scale-110 transition-all duration-300" />
                    )}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Mövzunu dəyiş</span>
        </Button>
    );
}