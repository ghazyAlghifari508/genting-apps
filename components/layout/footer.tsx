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
                Generasi Anti-Stunting - Platform digital untuk mendampingi masa 1000 Hari Pertama Kehidupan (HPK) dan mencegah stunting di Indonesia.
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
              <h4 className="font-bold text-white mb-4">Genting+</h4>
              <ul className="space-y-2.5">
                {["Tentang Kami", "Blog", "Kontak"].map((link, j) => (
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
                {["Konsultasi Dokter", "Peta Jalan 1000 HPK", "Genting Vision AI", "Edukasi Stunting"].map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-white/50 hover:text-[#E8C84A] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Misi Kami</h4>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">
                Menciptakan Indonesia bebas stunting melalui edukasi dan teknologi pemantauan kesehatan yang cerdas untuk setiap Bunda.
              </p>
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
