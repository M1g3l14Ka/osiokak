"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQModalProps {
  open: boolean;
  onClose: () => void;
}

const faqItems = [
  {
    id: "what",
    q: "Что такое OsiOkak?",
    a: "OsiOkak — это калькулятор осевых нагрузок для грузовиков и автопоездов. Помогает правильно распределить груз в прицепе, чтобы избежать штрафов за перегруз по осям. Штрафы за перегруз могут достигать 300 000 — 500 000 рублей.",
  },
  {
    id: "how",
    q: "Как пользоваться?",
    a: "1. Выберите тягач и прицеп из выпадающих списков.\n2. Нажмите «+» чтобы добавить груз.\n3. Перетащите груз по схеме прицепа или используйте стрелки ← →.\n4. Следите за индикаторами на осях — красные = перегруз.",
  },
  {
    id: "kingpin",
    q: "Что такое «седло»?",
    a: "Седло (шкворень) — точка соединения тягача с полуприцепом. На схеме — оранжевая точка. Нагрузка на седло напрямую влияет на развесовку тягача: перегрузите перед прицепа — ведущая ось тягача уйдёт в перегруз. Недогрузите — машина потеряет сцепление.",
  },
  {
    id: "overload",
    q: "Как избежать перегруза?",
    a: "Перемещайте груз ближе к осям прицепа (вправо на схеме) — это снижает нагрузку на тягач. Распределяйте груз равномерно по длине прицепа. Используйте телескоп для увеличения длины кузова.",
  },
  {
    id: "telescope",
    q: "Что такое «телескоп»?",
    a: "Некоторые прицепы (Schmitz, Krone, Manac) можно раздвигать, увеличивая длину кузова. Это распределяет груз на большую площадь и снижает нагрузку на оси. Кнопка появляется автоматически для совместимых прицепов.",
  },
  {
    id: "accuracy",
    q: "Точны ли расчёты?",
    a: "Расчёты основаны на формулах физики рычага и носят информационный характер. Для точных данных используйте весовые платформы на трассе. Мы не несём ответственности за штрафы.",
  },
  {
    id: "dragdrop",
    q: "Как перемещать груз?",
    a: "Два способа: 1) Перетаскивайте грузы пальцем/мышкой прямо по схеме прицепа. 2) Используйте стрелки ← → под редактором груза для точного перемещения с шагом 0.5 м.",
  },
];

export function FAQModal({ open, onClose }: FAQModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl border border-zinc-800 max-h-[85vh] flex flex-col shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Помощь</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <Accordion type="single" collapsible className="space-y-0">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed whitespace-pre-line">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
