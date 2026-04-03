"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function SpecialOfferBanner() {
    return (
        <section className="relative w-full py-24 overflow-hidden bg-background border-y border-border">
            <div
                className="absolute inset-0 opacity-5 dark:opacity-40 mix-blend-luminosity bg-fixed bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=2574&auto=format&fit=crop')"
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent dark:from-background dark:via-background/80" />

            <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary-500 mb-6 uppercase drop-shadow-sm">
                    Xüsusi Təklif
                </h2>

                <p className="text-2xl md:text-3xl text-primary-600 font-bold mb-8">
                    İlk gəlişinizə 20% Endirim
                </p>

                <p className="text-lg font-medium text-primary-500 max-w-2xl mx-auto mb-10">
                    Gözəllik salonumuzun VİP ab-havasını hiss etmək və peşəkar komandamızla tanış olmaq üçün unikal fürsət.
                </p>

                <Link href="/rezervasiya">
                    <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary-500/20 bg-primary-600 hover:bg-primary-500 text-white rounded-full">
                        Təklifdən Yararlan
                    </Button>
                </Link>
            </div>
        </section>
    );
}