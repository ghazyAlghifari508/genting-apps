import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Apple, Stethoscope, Baby, Clock } from "lucide-react";

const causes = [
  { icon: Apple, title: "Gizi Buruk", desc: "Asupan nutrisi tidak memadai selama kehamilan dan 2 tahun pertama" },
  { icon: Droplets, title: "Sanitasi Buruk", desc: "Akses air bersih dan sanitasi yang tidak layak" },
  { icon: Stethoscope, title: "Infeksi Berulang", desc: "Penyakit infeksi kronis mengganggu penyerapan nutrisi" },
  { icon: AlertTriangle, title: "Kurang Pengetahuan", desc: "Minimnya edukasi pola asuh dan gizi bagi orang tua" },
];

const timeline = [
  { period: "0–9 Bulan", label: "Masa Kehamilan", desc: "Nutrisi ibu hamil sangat kritis" },
  { period: "0–6 Bulan", label: "ASI Eksklusif", desc: "Pemberian ASI tanpa tambahan" },
  { period: "6–24 Bulan", label: "MPASI", desc: "Makanan pendamping berkualitas" },
  { period: "24+ Bulan", label: "Pertumbuhan", desc: "Pantau tumbuh kembang berkala" },
];

const WhatIsStunting = () => {
  return (
    <section id="tentang" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            Edukasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Apa Itu Stunting?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis, 
            terutama pada <strong className="text-foreground">1.000 hari pertama kehidupan</strong>.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-center font-bold text-foreground mb-8 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            1.000 Hari Pertama Kehidupan
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card rounded-2xl border border-border p-5 text-center hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold text-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {i + 1}
                </div>
                <div className="text-xs font-semibold text-primary mb-1">{t.period}</div>
                <div className="font-bold text-foreground text-sm mb-1">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Causes */}
        <div>
          <h3 className="text-center font-bold text-foreground mb-8">Faktor Penyebab Stunting</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {causes.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                  <c.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground mb-1">{c.title}</h4>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsStunting;
