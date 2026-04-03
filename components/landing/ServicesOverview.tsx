"use client";

import { motion } from "framer-motion";

const services = [
    { name: "Saç Kəsimi və Ukladka", price: "30 ₼-dan", desc: "Üz quruluşunuza uyğun ideal kəsim" },
    { name: "Gündəlik və Ziyafət Makiyajı", price: "50 ₼-dan", desc: "Özəl günlərinizdə qüsursuz görünüş" },
    { name: "Aparat Manikürü & Gel Lak", price: "35 ₼-dan", desc: "Sağlam və estetik dırnaq baxımı" },
    { name: "Kompleks Üz Təmizlənməsi", price: "80 ₼-dan", desc: "Dərinizin parıltısını geri qaytarın" },
    { name: "Gəlin Paketi (Saç + Makiyaj)", price: "250 ₼-dan", desc: "Həyatınızın ən özəl gününə hazırlıq" },
    { name: "Saçların Peşəkar Boyanması", price: "70 ₼-dan", desc: "Zərərsiz və premium boyalarla rənglənmə" },
];

export function ServicesOverview() {
    return (
        <section id="xidmetler" className="py-24 bg-background w-full border-y border-border">
            <div className="container mx-auto px-4 max-w-6xl sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Populyar Xidmətlərimiz
                    </h2>
                    <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
                        Sizə ən yüksək keyfiyyətli məhsullar və peşəkar ustalarımızla xidmət göstəririk.
                    </p>
                    <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group flex flex-col justify-between p-8 rounded-2xl bg-card shadow-sm border border-border hover:border-primary-500/50 hover:shadow-xl transition-all duration-300"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="mt-2 text-sm text-foreground/70">
                                    {service.desc}
                                </p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground/70">Qiymət:</span>
                                <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                                    {service.price}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}