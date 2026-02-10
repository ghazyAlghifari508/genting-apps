import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ibu Sari Wulandari",
    role: "Ibu Rumah Tangga, Jakarta",
    initials: "SW",
    quote: "Sejak pakai Genting, saya jadi lebih paham soal nutrisi anak. Grafik pertumbuhannya sangat membantu untuk memantau perkembangan si kecil setiap bulan.",
    rating: 5,
  },
  {
    name: "Bidan Ratna Dewi",
    role: "Bidan Puskesmas, Bandung",
    initials: "RD",
    quote: "Genting memudahkan kami dalam melakukan pendataan dan pemantauan balita di posyandu. Data yang tersaji sangat akurat dan mudah dibaca.",
    rating: 5,
  },
  {
    name: "Kader Ani Susilawati",
    role: "Kader Posyandu, Surabaya",
    initials: "AS",
    quote: "Aplikasi ini sangat user-friendly! Saya yang awalnya gaptek pun bisa langsung pakai. Fitur reminder imunisasi benar-benar membantu warga desa kami.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
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
            Testimoni
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Dipercaya oleh Ribuan Pengguna
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cerita inspiratif dari para ibu, bidan, dan kader posyandu yang telah merasakan manfaat Genting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.quote}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
