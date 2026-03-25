import React from "react";

const NavBar = () => {
  const navLinks = [
    { name: "PROFILE", href: "#profile" },
    { name: "FORMATION", href: "#formations" },
    { name: "EXPERIENCES", href: "#experiences" },
    { name: "COMPETENCES (à rajouter)", href: "#skills" },
    { name: "PROJETS", href: "#projects" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      


      <nav className="bg-black/90 backdrop-blur-md border-b border-cyber/35 py-4">
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
                className="text-gray-400 hover:text-cyber transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;