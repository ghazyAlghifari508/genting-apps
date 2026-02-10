import { motion } from "framer-motion";
import { UserPlus, LineChart, Salad, MessageCircle } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Daftarkan Data Anak", desc: "Masukkan data dasar anak seperti nama, tanggal lahir, jenis kelamin, serta tinggi dan berat badan awal." },
  { icon: LineChart, title: "Pantau Pertumbuhan", desc: "Catat perkembangan tinggi dan berat badan anak secara berkala. Grafik otomatis menunjukkan tren pertumbuhan." },
  { icon: Salad, title: "Dapatkan Rekomendasi Nutrisi", desc: "Sistem memberikan saran menu dan pola makan sesuai kebutuhan gizi anak berdasarkan data pertumbuhan." },
  { icon: MessageCircle, title: "Konsultasi dengan Ahli", desc: "Hubungi dokter anak atau ahli gizi untuk konsultasi langsung jika ada kekhawatiran soal tumbuh kembang." },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            Cara Kerja
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Mudah Digunakan, Hasil Nyata
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hanya 4 langkah sederhana untuk mulai memantau dan mencegah stunting pada anak Anda.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-5 mx-auto group hover:bg-primary hover:text-primary-foreground transition-colors">
                <s.icon className="w-8 h-8" />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-extrabold flex items-center justify-center shadow-lg">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
