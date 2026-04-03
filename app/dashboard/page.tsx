"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Calendar, Clock, CheckCircle, XCircle, Clock4, Loader2, Scissors, FilterX } from "lucide-react";
import { ReservationCard } from "@/components/dashboard/ReservationCard";

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

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
    const [serviceFilter, setServiceFilter] = useState<string>('');
    const [personFilter, setPersonFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                window.location.href = "/";
                return;
            }

            try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const decodedToken = JSON.parse(decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
                setRole(decodedToken.role);

                const response = await api.get("/appointments");
                const data = response.data || response;

                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => b.id - a.id);
                    setAppointments(sortedData);
                }
            } catch (error) {
                console.error("Məlumatlar yüklənərkən xəta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getPersonName = (app: Appointment, currentRole: string | null) => {
        if (currentRole === 'worker') {
            return app.customer?.name || "Bilinməyən Müştəri";
        } else if (currentRole === 'admin') {
            const customerName = app.customer?.name || 'Müştəri';
            const workerName = app.worker?.name || app.provider?.name || 'Usta';
            return `${customerName} ➔ ${workerName}`;
        } else {
            return app.worker?.name || app.provider?.name || "Bilinməyən Usta";
        }
    };

    const getPersonLabel = (currentRole: string | null) => {
        if (currentRole === 'worker') return 'Müştəri';
        if (currentRole === 'admin') return 'Rezervasiya';
        return 'Usta';
    };

    const uniqueServices = useMemo(() => {
        return Array.from(new Set(appointments.map(a => a.service?.name).filter(Boolean)));
    }, [appointments]);

    const uniquePersons = useMemo(() => {
        return Array.from(new Set(appointments.map(a => getPersonName(a, role)).filter(name => name && !name.includes("Bilinməyən"))));
    }, [appointments, role]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const safeStatus = (app.status || '').toUpperCase();
            if (statusFilter === 'UPCOMING' && safeStatus !== 'PENDING' && safeStatus !== 'CONFIRMED') return false;
            if (statusFilter === 'PAST' && safeStatus !== 'COMPLETED' && safeStatus !== 'CANCELED') return false;
            if (serviceFilter && app.service?.name !== serviceFilter) return false;
            if (personFilter && getPersonName(app, role) !== personFilter) return false;
            if (dateFilter && app.date !== dateFilter) return false;
            return true;
        });
    }, [appointments, statusFilter, serviceFilter, personFilter, dateFilter, role]);

    const clearFilters = () => {
        setServiceFilter('');
        setPersonFilter('');
        setDateFilter('');
        setStatusFilter('ALL');
    };

    const isAnyFilterActive = serviceFilter !== '' || personFilter !== '' || dateFilter !== '' || statusFilter !== 'ALL';

    const getInitial = (name: string) => {
        if (!name || name.includes("Bilinməyən")) return "?";
        return name.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-background text-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="opacity-60 animate-pulse">Məlumatlarınız yüklənir...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">

                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {role === 'worker' ? 'İşçi Paneli' : role === 'admin' ? 'Bütün Rezervasiyalar' : 'Mənim Rezervasiyalarım'}
                        </h1>
                        <p className="mt-2 text-foreground/60 text-lg">
                            {role === 'worker' ? 'Sizə təyin olunmuş bütün işləri buradan idarə edin.' : 'Keçmiş və qarşıdan gələn bütün rezervasiyalarınız buradadır.'}
                        </p>
                    </div>

                    <div className="flex bg-[#FCFBF8] border border-border p-1.5 rounded-2xl shadow-sm w-fit dark:bg-zinc-950">
                        {['ALL', 'UPCOMING', 'PAST'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${statusFilter === status
                                        ? 'bg-primary-600 text-white shadow-md dark:bg-primary-500'
                                        : 'text-[#292524] opacity-70 hover:opacity-100 hover:bg-primary-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {status === 'ALL' ? 'Bütün' : status === 'UPCOMING' ? 'Qarşıdan gələn' : 'Keçmiş'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-10 p-6 bg-card border border-border rounded-3xl shadow-sm flex flex-col sm:flex-row flex-wrap items-end gap-5">
                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-widest">Xidmət Növü</label>
                        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all">
                            <option value="">Bütün xidmətlər</option>
                            {uniqueServices.map((srv, idx) => <option key={idx} value={srv}>{srv}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-widest">
                            {getPersonLabel(role)} Adı
                        </label>
                        <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)} className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all">
                            <option value="">Hamısı</option>
                            {uniquePersons.map((person, idx) => <option key={idx} value={person}>{person}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-widest">Tarix</label>
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all" />
                    </div>

                    {isAnyFilterActive && (
                        <button onClick={clearFilters} className="h-12 px-6 flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-900/30 rounded-xl transition-all">
                            <FilterX className="w-4 h-4" /> Təmizlə
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((app) => {
                                const targetName = getPersonName(app, role);
                                const targetInitial = getInitial(targetName);
                                const personLabel = getPersonLabel(role);

                                return (
                                    <ReservationCard
                                        key={app.id}
                                        app={app}
                                        role={role}
                                        targetName={targetName}
                                        targetInitial={targetInitial}
                                        personLabel={personLabel}
                                        onStatusChange={(id, status) => {
                                            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2rem] bg-[#fcfaf8]/50 dark:bg-zinc-900/20">
                                <div className="w-20 h-20 bg-[#352514] dark:bg-primary-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                    <FilterX className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Heç bir nəticə tapılmadı</h3>
                                <p className="text-foreground/60 max-w-sm mt-3 text-lg">Seçdiyiniz filterlərə uyğun rezervasiya mövcud deyil.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}