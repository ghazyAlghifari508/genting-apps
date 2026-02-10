import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Baby, TrendingUp, Award, Activity } from "lucide-react";

const growthData = [
  { bulan: "Jan", tinggi: 68, berat: 7.5 },
  { bulan: "Feb", tinggi: 69.5, berat: 7.8 },
  { bulan: "Mar", tinggi: 71, berat: 8.1 },
  { bulan: "Apr", tinggi: 72.5, berat: 8.5 },
  { bulan: "Mei", tinggi: 74, berat: 8.8 },
  { bulan: "Jun", tinggi: 76, berat: 9.2 },
  { bulan: "Jul", tinggi: 77.5, berat: 9.5 },
  { bulan: "Agu", tinggi: 79, berat: 9.8 },
];

const DashboardPreview = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold mb-4">
            Dashboard Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Pantau Pertumbuhan Anak dengan Mudah
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dashboard intuitif yang menampilkan data pertumbuhan anak secara real-time dengan visualisasi yang menarik.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-4 sm:p-8 border border-border/50"
        >
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Profile card */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Baby className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Adira Zahra</div>
                  <div className="text-xs text-muted-foreground">Perempuan · 1 Tahun 8 Bulan</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Tinggi Badan", value: "79 cm", status: "Normal", icon: TrendingUp, statusColor: "text-primary bg-primary/10" },
                  { label: "Berat Badan", value: "9.8 kg", status: "Baik", icon: Activity, statusColor: "text-primary bg-primary/10" },
                  { label: "Z-Score TB/U", value: "-0.5 SD", status: "Normal", icon: Award, statusColor: "text-primary bg-primary/10" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="font-bold text-foreground text-sm">{item.value}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Imunisasi Lengkap</span>
                  <span className="font-semibold text-foreground">8/10</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Growth chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground">Grafik Pertumbuhan</h3>
                  <p className="text-xs text-muted-foreground">Tinggi & berat badan 8 bulan terakhir</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Tinggi (cm)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Berat (kg)</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={growthData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 15% 90%)" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="hsl(160 10% 45%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(160 10% 45%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0 0% 100%)",
                      border: "1px solid hsl(140 15% 90%)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="tinggi" stroke="hsl(142 71% 45%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(142 71% 45%)" }} />
                  <Line type="monotone" dataKey="berat" stroke="hsl(199 89% 48%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(199 89% 48%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
