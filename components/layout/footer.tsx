import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden w-full m-0 p-0 transition-colors">
      <div className="w-full bg-white  leading-none flex -mb-[1px] transition-colors">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="#0F6856" />
        </svg>
      </div>

      <div className="bg-[#0F6856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-0 mb-4 -ml-4 overflow-visible">
                <Image src="/images/unsplash/logo-white.png" alt="Genting Logo" width={120} height={120} className="w-[110px] h-[110px] scale-[1.3] object-contain" />
              </div>
              <p className="text-sm text-white/50 mb-6 max-w-xs leading-relaxed">
                Generasi Anti-Stunting - Platform digital untuk memantau tumbuh kembang anak dan mencegah stunting di Indonesia.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <Mail className="w-4 h-4" /> info@genting.id
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Phone className="w-4 h-4" /> +62 21 1234 5678
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <MapPin className="w-4 h-4" /> Jakarta, Indonesia
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2.5">
                {["Tentang Kami", "Karir", "Blog", "Kontak"].map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-white/50 hover:text-[#E8C84A] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Layanan</h4>
              <ul className="space-y-2.5">
                {["Konsultasi Dokter", "Pantau Tumbuh Kembang", "Vision AI", "Edukasi Kesehatan", "Roadmap Kehamilan"].map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-white/50 hover:text-[#E8C84A] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Berlangganan</h4>
              <p className="text-sm text-white/50 mb-4">Dapatkan tips kesehatan anak terbaru langsung di email Anda.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E8C84A]/30"
                />
                <button className="w-10 h-10 rounded-xl bg-[#E8C84A] hover:bg-[#D4B83E] flex items-center justify-center text-[#0F6856] transition-colors flex-shrink-0">
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-white/30 gap-4">
            <span>2026 Genting - Generasi Anti-Stunting. Hak cipta dilindungi.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white/60 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-50px] right-[-30px] w-40 h-40 rounded-full border-[3px] border-[#E8C84A]/20" />
    </footer>
  );
};

export default Footer;
