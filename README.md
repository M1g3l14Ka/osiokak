# OsiOkak

> Калькулятор осевых нагрузок для грузовиков и автопоездов

## Что это?

OsiOkak — веб-приложение (PWA) для дальнобойщиков и логистов, которое помогает правильно распределить груз в прицепе, чтобы избежать штрафов за перегруз по осям. Штрафы за перегруз одной оси в РФ могут достигать 300 000 - 500 000 руб.

Приложение - клон мобильного приложения OsiOk, но работает прямо в браузере без скачивания.

## Возможности

- **Визуальный Drag and Drop** — перетаскивай грузы по схеме прицепа пальцем/мышкой, нагрузка пересчитывается в реальном времени
- **Сложные конфигурации** — от 2 до 8 осей, поддержка телескопических (раздвижных) прицепов
- **Расчёт нагрузки на седло (шкворень)** — показывает сколько веса давит на сцепку тягача
- **Библиотека техники** — предустановленные тягачи (DAF, Mercedes, Scania, Volvo, КАМАЗ, MAN) и прицепы (Manac, Schmitz, Krone, Бонум, низкорамник, площадка)
- **Телескоп** — кнопка раздвижки прицепа для увеличения длины кузова
- **Визуализация перегруза** — красные кружки на осях, баннер ПЕРЕГРУЗ
- **Мобильный + десктоп адаптив** — работает на телефоне и на ПК
- **FAQ** — встроенная справка с аккордеоном

## Технологии

| Стек | Описание |
|------|----------|
| Next.js 16 (App Router) | Фреймворк, SSR/SSG |
| React 19 | UI-библиотека |
| TypeScript | Типизация |
| Tailwind CSS v4 | Стилизация |
| shadcn/ui + Radix UI | Компоненты (Accordion) |
| SVG | Схема грузовика с drag and drop |

## Как работает расчёт

В основе — формула рычага (моментов сил):

Нагрузка на седло = Σ (вес_груза × рычаг) / расстояние_до_осей

Чем ближе груз к осям прицепа (вправо на схеме) — тем больше нагрузка на прицеп и меньше на тягач.

## Запуск

```bash
npm install
npm run dev
```

Открой http://localhost:3000

## Сборка

```bash
npm run build    # продакшен-сборка
npm run start    # запуск продакшена
npm run lint     # линтер
```

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx         — Корневой layout, шрифты
│   ├── page.tsx           — Главная страница
│   └── globals.css        — Tailwind + анимации аккордеона
├── components/
│   ├── OsiokakCalculator.tsx   — Главный компонент-контейнер
│   ├── TruckTrailerSelect.tsx  — Селекторы тягача/прицепа + телескоп
│   ├── TruckDiagram.tsx        — SVG-схема с drag and drop, оси, грузы
│   ├── RoadTrainSummary.tsx    — Сводка весов автопоезда
│   ├── CargoList.tsx           — Список грузов + toolbar
│   ├── CargoEditor.tsx         — Редактор свойств груза + стрелки
│   ├── FAQModal.tsx            — Модалка с FAQ (shadcn Accordion)
│   └── ui/accordion.tsx        — shadcn/ui Accordion компонент
├── data/
│   ├── tractors.ts        — База тягачей (DAF, Mercedes, Scania, Volvo, КАМАЗ, MAN)
│   ├── trailers.ts        — База прицепов (Manac, Schmitz, Krone, Бонум, lowboy, flatbed)
│   ├── colors.ts          — Палитра цветов для грузов
│   └── boxes.ts           — Утилиты (formatKg)
├── lib/
│   ├── axle-calculator.ts — Физика расчёта осевых нагрузок
│   └── utils.ts           — cn() для shadcn
└── types/
    └── index.ts           — TypeScript интерфейсы
```

## Интерфейсы

### TractorConfig
Параметры тягача: tare, length, wheelbase, kingpinOffset, maxFrontAxle, maxRearAxle, rearAxleCount, hasLiftAxle.

### TrailerConfig
Параметры прицепа: tare, length, lengthExtended (для телескопа), axleGroupType, trailerAxleCount, kingpinToAxleDistance, maxTrailerAxleGroup, axlePositions[].

### CargoItem
Груз: id, name, weight, position (от седла), length, height, cog, color.

### AxleLoadResult
Результат расчёта: frontAxle, rearAxle, trailerAxles[], totalWeight, totalCargoWeight, kingpinLoad, overloads{}.

## Как добавить новый тягач/прицеп

Просто добавь объект в src/data/tractors.ts или src/data/trailers.ts. Приложение автоматически подхватит новые конфигурации.

## Дисклеймер

Расчёты носят информационный характер. Мы не несём ответственности за штрафы. Для точных данных используйте весовые платформы.

## CI/CD

Проект включает GitHub Actions workflow (.github/workflows/ci-cd.yml):
- Запускается на push и PR в main
- npm ci -> npm run lint -> tsc --noEmit -> npm run build

## Лицензия

MIT
