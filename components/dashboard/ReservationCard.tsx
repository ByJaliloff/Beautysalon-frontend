"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle, Clock4, Scissors, Check, X, Star, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Appointment = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    service: { name: string; price: number };
    worker?: { name: string, email?: string };
    customer?: { name: string, email?: string };
    provider?: { name: string, title?: string };
};

interface ReservationCardProps {
    app: Appointment;
    role: string | null;
    targetName: string;
    targetInitial: string;
    personLabel: string;
    onStatusChange?: (id: number, newStatus: string) => void;
}

export function ReservationCard({ app, role, targetName, targetInitial, personLabel, onStatusChange }: ReservationCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Review Feature States
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const safeStatus = (app.status || '').toUpperCase();
    const isPending = safeStatus === 'PENDING';

    const handleComplete = async () => {
        setIsCompleting(true);
        setTimeout(async () => {
            try {
                await api.patch(`/appointments/${app.id}/status`, { status: "COMPLETED" });
                if (onStatusChange) onStatusChange(app.id, "COMPLETED");
            } catch (error) {
                console.error("Xəta baş verdi:", error);
            } finally {
                setIsCompleting(false);
            }
        }, 600);
    };

    const handleCancel = async () => {
        try {
            await api.patch(`/appointments/${app.id}/status`, { status: "CANCELED" });
            if (onStatusChange) onStatusChange(app.id, "CANCELED");
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Xəta", { description: "Zəhmət olmasa ulduzlarla qiymətləndirin." });
            return;
        }

        setIsSubmittingReview(true);
        try {
            await api.post('/reviews', {
                appointmentId: app.id,
                rating,
                comment: reviewComment,
            });
            toast.success("Uğurlu", { description: "Rəyiniz üçün təşəkkür edirik!" });
            setHasReviewed(true);
            setIsReviewModalOpen(false);
        } catch (error: any) {
            toast.error("Xəta", { description: error.response?.data?.message || "Rəy göndərilərkən xəta baş verdi." });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'CONFIRMED':
                return <span className="flex items-center gap-1.5 text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"><Clock4 className="w-3.5 h-3.5" /> Gözləyir</span>;
            case 'COMPLETED':
                return <span className="flex items-center gap-1.5 text-green-600 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"><CheckCircle className="w-3.5 h-3.5" /> Tamamlanıb</span>;
            case 'CANCELED':
                return <span className="flex items-center gap-1.5 text-red-600 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"><XCircle className="w-3.5 h-3.5" /> Ləğv edilib</span>;
            default:
                return null;
        }
    };

    const showRateButton = safeStatus === 'COMPLETED' && role !== 'worker' && role !== 'admin' && !hasReviewed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-card border border-border rounded-3xl shadow-sm hover:shadow-xl hover:border-primary-500/30 transition-all duration-500"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isCompleting && (
                    <motion.div
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        className="absolute inset-0 bg-green-500/10 z-0"
                    />
                )}
            </AnimatePresence>

            <div className="flex items-start gap-5 relative z-10 w-full md:w-auto">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#352514] text-primary-400 shrink-0 shadow-lg">
                    <Scissors className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                        {app.service?.name || "Bilinməyən Xidmət"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-bold">

                        <span className="flex items-center gap-1.5 bg-white text-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm dark:bg-zinc-800 dark:text-zinc-200 dark:border-none">
                            <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-500" />
                            {format(new Date(app.date), 'dd MMMM yyyy', { locale: az })}
                        </span>

                        <span className="flex items-center gap-1.5 bg-white text-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm dark:bg-zinc-800 dark:text-zinc-200 dark:border-none">
                            <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            {app.startTime.substring(0, 5)} - {app.endTime.substring(0, 5)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto mt-2 md:mt-0 relative z-10">
                <div className="flex items-center justify-between md:justify-end w-full gap-5">

                    <div className="flex items-center gap-3 bg-white border border-zinc-200 p-1.5 pr-4 rounded-full shadow-sm dark:bg-zinc-900 dark:border-white/5">
                        <div className="w-9 h-9 rounded-full bg-[#352514] flex items-center justify-center border border-primary-500/20 shrink-0">
                            <span className="text-xs font-bold text-primary-400">
                                {targetInitial}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-[#85662F] dark:text-primary-500 font-black tracking-widest leading-none mb-1">
                                {personLabel}
                            </span>
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                                {targetName}
                            </span>
                        </div>
                    </div>

                    {!isHovered || !isPending ? (
                        <div className="flex items-center gap-3">
                            {getStatusBadge(safeStatus)}
                            {showRateButton && (
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20"
                                >
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    Dəyərləndir
                                </button>
                            )}
                        </div>
                    ) : null}

                    <AnimatePresence>
                        {isHovered && isPending && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-2"
                            >
                                <motion.button
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    title="Ləğv et"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    onClick={handleComplete}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center gap-2 px-5 h-10 rounded-full bg-green-600 text-white shadow-lg shadow-green-500/20 font-bold tracking-wide hover:bg-green-700 transition-all"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Tamamla</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <AnimatePresence>
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsReviewModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-background border border-border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                                    <div className="p-2 bg-primary-500/10 rounded-xl">
                                        <Star className="w-6 h-6 text-primary-500 fill-primary-500" />
                                    </div>
                                    Dəyərləndir
                                </h3>
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="relative z-10 space-y-6">
                                <div className="flex flex-col items-center py-6 bg-primary-50/50 dark:bg-primary-950/10 rounded-3xl border border-primary-500/10">
                                    <p className="text-foreground/60 font-bold text-sm mb-4 uppercase tracking-widest">Xidmət keyfiyyəti?</p>
                                    <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={`star-${star}`}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-125 active:scale-90"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all duration-200 ${(hoverRating || rating) >= star
                                                        ? "fill-primary-500 text-primary-500 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                                                        : "text-zinc-300 dark:text-zinc-700"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-primary-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Rəyiniz
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Təcrübənizi bizimlə bölüşün..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full px-5 py-4 bg-secondary border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none text-foreground transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingReview || rating === 0}
                                    className="w-full h-14 flex items-center justify-center gap-3 font-black bg-primary-600 text-white rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingReview ? <Loader2 className="w-6 h-6 animate-spin" /> : "TƏSDİQLƏ"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}