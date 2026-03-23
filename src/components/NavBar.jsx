import React from "react";

const NavBar = () => {
  const navLinks = [
    { name: "PROFILE", href: "#profile" },
    { name: "FORMATION", href: "#formations" },
    { name: "EXPERIENCES", href: "#experiences" },
    { name: "COMPETENCES", href: "#skills" },
    { name: "PROJETS", href: "#projects" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-cyber/35 py-4 z-50">
      <div className="max-w-9xl mx-auto px-6 flex justify-between">
        {/* LOGO à gauche */}
        <div className="font-mono text-lg font-bold text-white">
          NAGI_SYS<span className="text-cyber">.EXE</span>
        </div>

        {/* LIENS à droite*/}
        <div className="flex items-center gap-10 font-mono text-xs">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-400 hover:text-cyber"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
