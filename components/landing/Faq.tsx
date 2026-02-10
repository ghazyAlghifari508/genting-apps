import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Apa itu Genting?", a: "Genting (Generasi Anti-Stunting) adalah platform digital yang membantu orang tua dan tenaga kesehatan memantau tumbuh kembang anak, memberikan panduan nutrisi, dan menghubungkan dengan ahli gizi untuk mencegah stunting." },
  { q: "Apakah Genting gratis?", a: "Ya! Genting menyediakan fitur-fitur dasar secara gratis termasuk monitoring pertumbuhan, panduan nutrisi, dan reminder imunisasi. Fitur premium seperti konsultasi ahli tersedia dengan biaya terjangkau." },
  { q: "Bagaimana cara memulai menggunakan Genting?", a: "Cukup daftar dengan email atau nomor telepon, masukkan data anak Anda, dan mulai pantau pertumbuhannya. Prosesnya hanya membutuhkan waktu 2 menit!" },
  { q: "Apakah data anak saya aman?", a: "Keamanan data adalah prioritas utama kami. Semua data dienkripsi dan disimpan dengan standar keamanan tinggi. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga." },
  { q: "Siapa saja yang bisa menggunakan Genting?", a: "Genting dirancang untuk orang tua, bidan, kader posyandu, dokter anak, ahli gizi, dan siapa saja yang peduli dengan tumbuh kembang anak Indonesia." },
  { q: "Apakah Genting sesuai dengan standar WHO?", a: "Ya, semua parameter pertumbuhan dan rekomendasi nutrisi di Genting mengacu pada standar WHO (World Health Organization) dan Kementerian Kesehatan Republik Indonesia." },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-5 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
