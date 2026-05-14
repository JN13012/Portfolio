import React from "react";

const SectionHeader = ({ index, title, action }) => (
  <h2 className="mb-14 flex items-center gap-6 font-mono font-bold uppercase">
    <span className="text-cyber text-lg opacity-80">{index}.</span>
    <span className="text-3xl md:text-4xl tracking-[0.2em] text-zinc-100">
      {title}
    </span>
    <div className="h-px flex-1 bg-cyber/20" />
    {action}
  </h2>
);

export default SectionHeader;
