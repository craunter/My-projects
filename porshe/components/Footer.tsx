export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-carbon-gray py-12 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.3em] text-white mb-1"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Porsche
            </p>
            <p
              className="text-[10px] tracking-[0.15em] text-metal-silver uppercase"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Dr. Ing. h.c. F. Porsche AG
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {["Privacy", "Legal", "Contact", "Careers"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] tracking-[0.2em] uppercase text-metal-silver hover:text-porsche-red transition-colors duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[10px] tracking-[0.1em] text-metal-silver/50"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            © {year} Porsche AG. All rights reserved.
          </p>
        </div>

        {/* Bottom rule */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-carbon-gray" />
          <div className="w-2 h-2 bg-porsche-red rounded-full" />
          <div className="flex-1 h-[1px] bg-carbon-gray" />
        </div>
      </div>
    </footer>
  );
}
