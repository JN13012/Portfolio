import React, { useEffect, useState } from "react";

const navLinks = [
  { name: "PROFIL", href: "#profile" },
  { name: "EXPERTISE", href: "#competences" },
  { name: "PROJETS", href: "#projects" },
  { name: "LAB", href: "#lab" },
  { name: "PARCOURS", href: "#parcours" },
  { name: "CERTIFICATIONS", href: "#certifications" },
  { name: "CONTACT", href: "#contact" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Highlight the section currently on screen.
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed top-0 z-[1000] flex w-full flex-col">
      <nav aria-label="Navigation principale" className="border-b border-cyber/35 bg-black/85 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-[90%] max-w-[2400px] items-center justify-between gap-6">
          <a href="#acceuil" className="min-w-0 text-[min(4.5vw,1rem)] leading-tight font-bold text-white sm:text-lg">
            NAGI_JÉRÉMIE
            <span className="text-zinc-500">.</span>
            <span className="text-sky-400">IA</span>
            <span className="text-zinc-500">.</span>
            <span className="text-cyber">CYBER</span>
          </a>

          <ul className="hidden items-center gap-7 text-base xl:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={active === link.href ? "location" : undefined}
                  className={`transition-colors hover:text-cyber ${active === link.href ? "text-cyber" : "text-gray-400"}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 border border-cyber/40 px-3 py-1.5 text-sm tracking-widest whitespace-nowrap text-cyber xl:hidden"
          >
            {open ? "[ FERMER ]" : "[ MENU ]"}
          </button>
        </div>

        {open && (
          <ul id="mobile-menu" className="mx-auto mt-4 grid w-[90%] gap-1 border-t border-cyber/20 pt-3 xl:hidden">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} onClick={() => setOpen(false)} className="block py-2 text-gray-300 hover:text-cyber">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
