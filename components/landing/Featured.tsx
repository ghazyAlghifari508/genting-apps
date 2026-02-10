import { motion } from "framer-motion";
import { BarChart3, Apple, Baby, Hospital, MapPin, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Monitoring Pertumbuhan",
    desc: "Pantau tinggi badan dan berat badan anak secara berkala dengan grafik interaktif yang mudah dipahami.",
    color: "bg-primary/10 text-primary group-hover:bg-primary",
  },
  {
    icon: Apple,
    title: "Panduan Nutrisi",
    desc: "Rekomendasi menu gizi seimbang sesuai usia anak berdasarkan standar WHO dan Kemenkes.",
    color: "bg-destructive/10 text-destructive group-hover:bg-destructive",
  },
  {
    icon: Baby,
    title: "Profiling Anak",
    desc: "Data lengkap tumbuh kembang anak terintegrasi dalam satu dashboard yang komprehensif.",
    color: "bg-secondary/10 text-secondary group-hover:bg-secondary",
  },
  {
    icon: Hospital,
    title: "Konsultasi Ahli",
    desc: "Terhubung langsung dengan dokter anak dan ahli gizi untuk konsultasi kesehatan.",
    color: "bg-accent/10 text-accent-foreground group-hover:bg-accent",
  },
  {
    icon: MapPin,
    title: "Pemetaan Wilayah",
    desc: "Identifikasi daerah rawan stunting dan alokasi sumber daya secara tepat sasaran.",
    color: "bg-primary/10 text-primary group-hover:bg-primary",
  },
  {
    icon: CalendarCheck,
    title: "Reminder Imunisasi",
    desc: "Notifikasi otomatis jadwal imunisasi dan kunjungan posyandu tepat waktu.",
    color: "bg-secondary/10 text-secondary group-hover:bg-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="fitur" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Solusi Lengkap Anti-Stunting
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Genting menyediakan berbagai fitur canggih untuk membantu orang tua dan tenaga kesehatan 
            dalam memantau dan mencegah stunting pada anak.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${f.color} group-hover:text-primary-foreground`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
