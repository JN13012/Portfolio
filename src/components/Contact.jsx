import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import SectionHeader from "./SectionHeader";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Impossible d'envoyer le message.");
      }

      setForm(initialForm);
      setStatus("success");
      setFeedback("Message envoyé. Je vous répondrai rapidement.");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error.message ||
          "Une erreur est survenue. Vous pouvez aussi me contacter par email.",
      );
    }
  };

  const isSending = status === "sending";

  return (
    <section
      id="contact"
      className="py-24 bg-[#020202] text-white relative overflow-hidden border-t border-cyber/10"
    >
      <div className="pointer-events-none absolute inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-cyber/35 to-transparent blur-[1px]" />

      <div className="relative z-10">
        <SectionHeader index="07" title="Contact" />

        <div className="grid grid-cols-1 gap-8 rounded-md border border-white/15 bg-[#080808] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.46)] md:grid-cols-[0.9fr_1.35fr] md:p-8">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div>
              <div className="mb-5 h-px w-20 bg-cyber" />
              <h3 className="text-[30px] leading-[1.05] text-white md:text-[38px]">
                Échangeons sur une opportunité.
              </h3>
              <p className="mt-5 text-base leading-[1.85] text-white/70">
                Vous êtes recruteur, RH ou porteur de projet ? Envoyez-moi un
                message directement depuis le site pour en discuter.
              </p>
            </div>

            <a
              href="mailto:jeremie.nagi@epitech.eu"
              className="group inline-flex w-fit items-center gap-3 border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:border-cyber/45 hover:text-cyber"
            >
              <Mail size={18} />
              <span>jeremie.nagi@epitech.eu</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[12px] uppercase tracking-[0.22em] text-white/45">
                  Nom
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyber/60"
                  placeholder="Votre nom"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] uppercase tracking-[0.22em] text-white/45">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyber/60"
                  placeholder="prenom.nom@entreprise.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[12px] uppercase tracking-[0.22em] text-white/45">
                Sujet
              </span>
              <input
                required
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyber/60"
                placeholder="Opportunité, alternance, projet..."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[12px] uppercase tracking-[0.22em] text-white/45">
                Message
              </span>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="w-full resize-none rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-cyber/60"
                placeholder="Décrivez votre besoin ou l'opportunité..."
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-sm border border-cyber/50 bg-cyber/10 px-6 py-3 text-sm uppercase tracking-[0.22em] text-cyber transition hover:bg-cyber/15 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <Send size={17} />
                {isSending ? "Envoi..." : "Envoyer"}
              </button>

              {feedback && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    status === "success" ? "text-cyber" : "text-red-300"
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <AlertTriangle size={17} />
                  )}
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
