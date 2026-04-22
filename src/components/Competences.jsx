import React, { useState } from 'react';
import { hardSkills } from '../components/CompetencesData';

const Competences = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <section id="competences" className="py-32 bg-[#020202] text-white relative border-y border-white/5 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-blue-500 font-mono text-base opacity-60">04.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono italic">Tech_Stack_Audit</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hardSkills.map((group, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedCategory(group)}
              className={`group p-8 bg-zinc-900/10 border ${group.theme} cursor-pointer transition-all duration-700 hover:bg-zinc-900/30 hover:${group.glow} relative`}
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">{group.icon}</span>
                <div className="text-[10px] font-mono text-zinc-500 uppercase flex flex-col items-end italic">
                  <span>Status: Operational</span>
                  <span className="text-blue-400">Access_Granted</span>
                </div>
              </div>

              <h3 className="font-mono text-xl uppercase text-zinc-100 mb-6 tracking-tighter">{group.category}</h3>
              
              <div className="flex flex-wrap gap-2">
                {group.tools.slice(0, 4).map(tool => (
                  <span key={tool} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-400 font-mono italic">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* MODALE */}
        {selectedCategory && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl">
            <div className={`bg-[#050505] border ${selectedCategory.theme} w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative`}>
              
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
                <h3 className="text-2xl font-mono uppercase text-white flex items-center gap-4">
                   {selectedCategory.category}
                </h3>
                <button onClick={() => {setSelectedCategory(null); setSelectedSkill(null)}} className="font-mono text-zinc-500 hover:text-white transition-colors">
                  [ TERMINATE_SESSION ]
                </button>
              </div>

              <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                <div className="w-full md:w-1/3 border-r border-white/5 overflow-y-auto bg-black/40">
                  {selectedCategory.items.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left p-6 font-mono transition-all border-b border-white/5 group ${selectedSkill?.name === skill.name ? `bg-white/5 border-l-4 border-current` : 'hover:bg-white/5'}`}
                    >
                      <span className="text-[10px] mb-2 block opacity-50 font-mono">0{idx + 1}.</span>
                      <span className="text-sm uppercase tracking-widest">{skill.name}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full md:w-2/3 p-12 overflow-y-auto">
                  {selectedSkill ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-[0.4em] mb-8 italic">// Deep_Analysis_Report</h4>
                      <p className="text-zinc-100 font-mono text-lg leading-relaxed mb-10 italic">"{selectedSkill.details}"</p>
                      <div className="bg-white/5 border border-white/10 p-6">
                        <h5 className="text-zinc-500 font-mono text-[10px] uppercase mb-4 tracking-widest">Stack_Utilisée:</h5>
                        <div className="flex flex-wrap gap-3">
                          {selectedSkill.tools.split(', ').map(t => (
                            <span key={t} className="px-3 py-1 bg-black border border-white/10 text-zinc-300 font-mono text-xs italic">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase animate-pulse">
                      Awaiting_Selection...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Competences;