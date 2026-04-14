import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CargoItem } from "@/types";
import { AXLE_COLORS } from "@/data/colors";

interface CalculatorState {
  tractorId: string;
  trailerId: string;
  isTelescoped: boolean;
  cargoItems: CargoItem[];
  selectedId: string | null;
  setTractorId: (id: string) => void;
  setTrailerId: (id: string) => void;
  toggleTelescope: () => void;
  addCargo: () => void;
  duplicateCargo: (id: string) => void;
  removeCargo: (id: string) => void;
  clearAll: () => void;
  updateCargo: (id: string, updates: Partial<CargoItem>) => void;
  moveCargo: (id: string, direction: "left" | "right", trailerLength: number) => void;
  selectCargo: (id: string | null) => void;
}

let nextId = 0;

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      tractorId: "daf-ft-xf-105",
      trailerId: "manac-tsr-4sou1n",
      isTelescoped: false,
      cargoItems: [],
      selectedId: null,

      setTractorId: (id) => set({ tractorId: id }),
      setTrailerId: (id) => set({ trailerId: id }),

      toggleTelescope: () =>
        set((state) => ({ isTelescoped: !state.isTelescoped })),

      addCargo: () => {
        const { cargoItems } = get();
        const newCargo: CargoItem = {
          id: `cargo-${++nextId}`,
          name: `Груз ${cargoItems.length + 1}`,
          weight: 2000,
          position: 0.5,
          length: 2.0,
          height: 1.5,
          color: AXLE_COLORS[cargoItems.length % AXLE_COLORS.length],
        };
        set((state) => ({
          cargoItems: [...state.cargoItems, newCargo],
          selectedId: newCargo.id,
        }));
      },

      duplicateCargo: (id) => {
        const { cargoItems } = get();
        const item = cargoItems.find((c) => c.id === id);
        if (!item) return;
        const dup: CargoItem = {
          ...item,
          id: `cargo-${++nextId}`,
          name: `${item.name} (копия)`,
          color: AXLE_COLORS[cargoItems.length % AXLE_COLORS.length],
        };
        set((state) => ({
          cargoItems: [...state.cargoItems, dup],
          selectedId: dup.id,
        }));
      },

      removeCargo: (id) =>
        set((state) => ({
          cargoItems: state.cargoItems.filter((c) => c.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        })),

      clearAll: () => set({ cargoItems: [], selectedId: null }),

      updateCargo: (id, updates) =>
        set((state) => ({
          cargoItems: state.cargoItems.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      moveCargo: (id, direction, trailerLength) =>
        set((state) => ({
          cargoItems: state.cargoItems.map((c) => {
            if (c.id !== id) return c;
            const step = 0.5;
            let newPos =
              direction === "left"
                ? c.position - step
                : c.position + step;
            newPos = Math.max(0, Math.min(trailerLength - c.length, newPos));
            return { ...c, position: Math.round(newPos * 10) / 10 };
          }),
        })),

      selectCargo: (id) => set({ selectedId: id }),
    }),
    {
      name: "osiokak-storage",
      partialize: (state) => ({
        tractorId: state.tractorId,
        trailerId: state.trailerId,
        isTelescoped: state.isTelescoped,
        cargoItems: state.cargoItems,
        selectedId: null, // не сохраняем выделение
      }),
    }
  )
);
