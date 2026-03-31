"use client";

import { useState } from "react";
import {
  ChevronDown,
  Euro,
  Clock,
  Bus,
  Phone,
  Mail,
  MapPin,
  FileText,
  UtensilsCrossed,
} from "lucide-react";

interface FAQItem {
  icon: React.ReactNode;
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    icon: <Euro size={18} />,
    question: "Quel est le prix d'un repas à la cantine ?",
    answer: (
      <>
        <p>
          Depuis le <strong>1er janvier 2025</strong>, le prix d'un repas est de{" "}
          <strong>3,70 €</strong> par repas.
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Ce tarif est fixé par le Conseil Départemental du Loiret pour tous les
          collèges du département. Le coût réel d'un repas est d'environ 8 € —
          le Département prend en charge environ 60 % du coût.
        </p>
      </>
    ),
  },
  {
    icon: <UtensilsCrossed size={18} />,
    question: "Quels sont les régimes de demi-pension ?",
    answer: (
      <ul className="space-y-2">
        <li>
          <strong>Externe :</strong> l'élève mange chez lui, il arrive et repart
          selon son emploi du temps.
        </li>
        <li>
          <strong>Demi-pensionnaire libre (DP libre) :</strong> l'élève doit
          manger au collège, mais peut partir après le repas s'il n'a pas cours
          l'après-midi.
        </li>
        <li>
          <strong>Demi-pensionnaire car (DP car) :</strong> l'élève arrive et
          repart avec le bus scolaire et ne peut pas quitter le collège (sauf
          autorisation écrite des parents).
        </li>
        <li>
          <strong>Présence obligatoire :</strong> l'élève doit arriver à 8h30 et
          repartir à 17h00, aucune sortie autorisée.
        </li>
      </ul>
    ),
  },
  {
    icon: <Clock size={18} />,
    question: "Quels sont les horaires du collège ?",
    answer: (
      <>
        <p>
          Les horaires généraux du collège sont de <strong>8h30</strong> à{" "}
          <strong>17h00</strong>.
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Un élève demi-pensionnaire ne peut pas quitter le collège avant
          d'avoir pris son repas, même en cas d'après-midi libérée.
        </p>
      </>
    ),
  },
  {
    icon: <Bus size={18} />,
    question: "Comment fonctionne le transport scolaire ?",
    answer: (
      <p>
        Les élèves en régime <strong>DP car</strong> arrivent et repartent avec
        le bus scolaire. Ils ne peuvent quitter le collège qu'avec une
        autorisation exceptionnelle signée par les parents à l'accueil ou dans
        le carnet de correspondance.
      </p>
    ),
  },
  {
    icon: <FileText size={18} />,
    question: "Où trouver le règlement de la demi-pension ?",
    answer: (
      <p>
        Le règlement intérieur du service de demi-pension est disponible sur le{" "}
        <a
          href="https://clg-rschuman-amilly.tice.ac-orleans-tours.fr/eva/spip.php?rubrique164"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
          style={{ color: "var(--primary)" }}
        >
          site officiel du collège
        </a>
        , dans la rubrique « Règlements ».
      </p>
    ),
  },
  {
    icon: <Phone size={18} />,
    question: "Comment contacter le collège ?",
    answer: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400" />
          <a href="tel:0238281153" className="underline" style={{ color: "var(--primary)" }}>
            02 38 28 11 53
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-400" />
          <a
            href="mailto:ce.0450937z@ac-orleans-tours.fr"
            className="underline"
            style={{ color: "var(--primary)" }}
          >
            ce.0450937z@ac-orleans-tours.fr
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          <span>307 route de Viroy, 45200 Amilly</span>
        </div>
      </div>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5"
            style={{
              borderColor: isOpen
                ? "color-mix(in srgb, var(--primary-light) 40%, transparent)"
                : undefined,
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors"
                style={{
                  backgroundColor: isOpen
                    ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                    : undefined,
                  color: isOpen ? "var(--primary)" : "#94a3b8",
                }}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-white sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
