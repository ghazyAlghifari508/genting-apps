import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "Produk",
    links: ["Fitur", "Harga", "FAQ", "Dokumentasi"],
  },
  {
    title: "Perusahaan",
    links: ["Tentang Kami", "Karir", "Blog", "Kontak"],
  },
  {
    title: "Legal",
    links: ["Kebijakan Privasi", "Syarat & Ketentuan", "Keamanan Data"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-xl text-background">Genting</span>
            </div>
            <p className="text-sm text-background/60 mb-6 max-w-xs leading-relaxed">
              Generasi Anti-Stunting — Platform digital untuk memantau tumbuh kembang anak dan mencegah stunting di Indonesia.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-background/60">
                <Mail className="w-4 h-4" /> info@genting.id
              </div>
              <div className="flex items-center gap-2 text-background/60">
                <Phone className="w-4 h-4" /> +62 21 1234 5678
              </div>
              <div className="flex items-center gap-2 text-background/60">
                <MapPin className="w-4 h-4" /> Jakarta, Indonesia
              </div>
            </div>
          </div>

          {footerLinks.map((group, i) => (
            <div key={i}>
              <h4 className="font-bold text-background mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
          © 2024 Genting — Generasi Anti-Stunting. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
