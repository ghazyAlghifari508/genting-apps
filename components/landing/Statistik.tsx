import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingDown, Users, MapPin, Target } from "lucide-react";

const provinsiData = [
  { name: "NTT", value: 35.3 },
  { name: "Sulbar", value: 33.8 },
  { name: "Papua", value: 31.2 },
  { name: "NTB", value: 28.4 },
  { name: "Kalbar", value: 27.8 },
  { name: "Aceh", value: 26.1 },
  { name: "Sultra", value: 25.5 },
  { name: "Maluku", value: 24.9 },
];

const statusGiziData = [
  { name: "Normal", value: 78.4, color: "hsl(142 71% 45%)" },
  { name: "Stunting", value: 21.6, color: "hsl(0 84% 60%)" },
];

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

const stats = [
  { icon: TrendingDown, value: 21.6, suffix: "%", label: "Prevalensi Stunting 2022", color: "text-destructive" },
  { icon: Target, value: 14, suffix: "%", label: "Target Nasional 2024", color: "text-primary" },
  { icon: MapPin, value: 514, suffix: "", label: "Kabupaten/Kota", color: "text-secondary" },
  { icon: Users, value: 24, suffix: " Juta", label: "Balita Terdampak", color: "text-accent-foreground" },
];

const StatistikSection = () => {
  return (
    <section id="statistik" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
            Data & Fakta
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Statistik Stunting di Indonesia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Data terkini menunjukkan masih tingginya angka stunting yang memerlukan perhatian serius dari semua pihak.
          </p>
        </motion.div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => {
            const { count, ref } = useCountUp(s.value);
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-3 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  {count}{s.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-card rounded-2xl border border-border p-6 shadow-sm"
          >
            <h3 className="font-bold text-foreground mb-1">Prevalensi Stunting per Provinsi</h3>
            <p className="text-xs text-muted-foreground mb-4">Data SSGI 2022 — Provinsi dengan angka tertinggi</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={provinsiData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 15% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(160 10% 45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(160 10% 45%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 100%)",
                    border: "1px solid hsl(140 15% 90%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value}%`, "Prevalensi"]}
                />
                <Bar dataKey="value" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm"
          >
            <h3 className="font-bold text-foreground mb-1">Status Gizi Balita</h3>
            <p className="text-xs text-muted-foreground mb-4">Perbandingan nasional 2022</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusGiziData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {statusGiziData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {statusGiziData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatistikSection;
