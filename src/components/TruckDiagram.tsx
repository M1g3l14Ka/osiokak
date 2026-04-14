"use client";

import { useCallback, useRef, useState } from "react";
import { TractorConfig, TrailerConfig, CargoItem, AxleLoadResult } from "@/types";

interface TruckDiagramProps {
  tractor: TractorConfig;
  trailer: TrailerConfig;
  isTelescoped: boolean;
  cargoItems: CargoItem[];
  selectedId: string | null;
  result: AxleLoadResult;
  onSelect: (id: string | null) => void;
  onDrop: (id: string, updates: Partial<CargoItem>) => void;
}

const SCALE = 55;
const TRUCK_Y = 70;
const TRUCK_H = 95;
const AXLE_Y = TRUCK_Y + TRUCK_H + 50;

export function TruckDiagram({
  tractor,
  trailer,
  isTelescoped,
  cargoItems,
  selectedId,
  result,
  onSelect,
  onDrop,
}: TruckDiagramProps) {
  const trailerLength =
    isTelescoped && trailer.lengthExtended
      ? trailer.lengthExtended
      : trailer.length;

  const tractorX = 50;
  const tractorW = tractor.length * SCALE;
  const trailerX = tractorX + tractorW + 20;
  const trailerW = trailerLength * SCALE;

  const [dragging, setDragging] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; position: number } | null>(null);

  const resolveOverlap = useCallback(
    (id: string, newPosition: number, length: number): number => {
      let pos = Math.max(0, Math.min(trailerLength - length, newPosition));
      let changed = true;
      let iter = 0;
      while (changed && iter < 20) {
        changed = false;
        iter++;
        for (const other of cargoItems) {
          if (other.id === id) continue;
          const otherEnd = other.position + other.length;
          const thisEnd = pos + length;
          if (pos < otherEnd && thisEnd > other.position) {
            const candidate = otherEnd + 0.1;
            if (candidate + length <= trailerLength && candidate > pos) {
              pos = candidate;
              changed = true;
            } else {
              const leftCandidate = other.position - length - 0.1;
              if (leftCandidate >= 0 && leftCandidate < pos) {
                pos = leftCandidate;
                changed = true;
              }
            }
          }
        }
      }
      return Math.round(pos * 10) / 10;
    },
    [cargoItems, trailerLength]
  );

  const handleDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      const item = cargoItems.find((c) => c.id === id);
      if (!item) return;
      setDragging(id);
      onSelect(id);
      dragRef.current = { x: e.clientX, position: item.position };
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [cargoItems, onSelect]
  );

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.x;
      const dm = dx / SCALE;
      const item = cargoItems.find((c) => c.id === dragging);
      if (item) {
        let rawPos = dragRef.current.position + dm;
        const resolved = resolveOverlap(dragging, rawPos, item.length);
        onDrop(dragging, { position: resolved });
      }
    },
    [dragging, cargoItems, resolveOverlap, onDrop]
  );

  const handleUp = useCallback(() => {
    setDragging(null);
    dragRef.current = null;
  }, []);

  const hasOverload =
    result.overloads.frontAxle ||
    result.overloads.rearAxle ||
    result.overloads.trailerAxleGroup ||
    result.overloads.totalWeight;

  const kingpinX = tractorX + tractorW - 12;
  const frontAxleX = tractorX + 35;
  const rearAxleX = tractorX + tractor.wheelbase * SCALE;
  const svgW = trailerX + trailerW + 60;

  return (
    <div className="py-2">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <svg
            width="100%"
            viewBox={`0 0 ${svgW} ${AXLE_Y + 65}`}
            className="select-none min-w-[750px]"
          >
            {/* LABEL: TRACTOR */}
            <text
              x={tractorX + tractorW / 2}
              y={TRUCK_Y - 35}
              textAnchor="middle"
              fill="#d4d4d8"
              fontSize="16"
              fontWeight="800"
            >
              КАБИНА ({tractor.type})
            </text>

            {/* TRACTOR BODY */}
            <rect
              x={tractorX}
              y={TRUCK_Y + 12}
              width={tractorW - 12}
              height={TRUCK_H - 12}
              fill="#3f3f46"
              stroke="#52525b"
              strokeWidth="2"
              rx="5"
            />
            <rect
              x={tractorX + tractorW - 38}
              y={TRUCK_Y + 18}
              width={20}
              height={28}
              fill="#7dd3fc"
              rx="3"
              opacity="0.6"
            />

            {/* KINGPIN */}
            <text
              x={kingpinX}
              y={TRUCK_Y + TRUCK_H + 16}
              textAnchor="middle"
              fill="#f97316"
              fontSize="13"
              fontWeight="800"
            >
              Седло
            </text>
            <circle cx={kingpinX} cy={TRUCK_Y + TRUCK_H} r="8" fill="#f97316" />
            <circle cx={kingpinX} cy={TRUCK_Y + TRUCK_H} r="4" fill="#fff5" />

            {/* LABEL: TRAILER */}
            <text
              x={trailerX + trailerW / 2}
              y={TRUCK_Y - 35}
              textAnchor="middle"
              fill="#d4d4d8"
              fontSize="16"
              fontWeight="800"
            >
              ПРИЦЕП
            </text>

            {/* TRAILER BODY */}
            <rect
              x={trailerX}
              y={TRUCK_Y}
              width={trailerW}
              height={TRUCK_H}
              fill="#1c1c1e"
              stroke="#52525b"
              strokeWidth="2"
              rx="3"
            />
            <text
              x={trailerX + trailerW / 2}
              y={TRUCK_Y - 12}
              textAnchor="middle"
              fill="#a1a1aa"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="700"
            >
              {trailerLength.toFixed(1)} м
            </text>
            <line
              x1={trailerX}
              y1={TRUCK_Y - 6}
              x2={trailerX + trailerW}
              y2={TRUCK_Y - 6}
              stroke="#52525b"
              strokeWidth="1.5"
            />

            {/* Position markers every 2m — BIG */}
            {Array.from({ length: Math.floor(trailerLength / 2) + 1 }, (_, i) => {
              const px = trailerX + i * 2 * SCALE;
              return (
                <g key={`marker-${i}`}>
                  <line
                    x1={px}
                    y1={TRUCK_Y}
                    x2={px}
                    y2={TRUCK_Y + 10}
                    stroke="#71717a"
                    strokeWidth="1.5"
                  />
                  {i > 0 && (
                    <text
                      x={px}
                      y={TRUCK_Y + TRUCK_H - 6}
                      textAnchor="middle"
                      fill="#d4d4d8"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {i * 2}м
                    </text>
                  )}
                </g>
              );
            })}

            {/* CARGO ITEMS */}
            {cargoItems.map((item) => {
              const cargoPixelX = trailerX + item.position * SCALE;
              const cargoPixelW = Math.max(item.length * SCALE, 20);
              const isSelected = item.id === selectedId;
              const isDraggingItem = item.id === dragging;

              return (
                <g key={item.id}>
                  <rect
                    x={cargoPixelX}
                    y={TRUCK_Y + 4}
                    width={cargoPixelW - 2}
                    height={TRUCK_H - 8}
                    fill={item.color + "30"}
                    stroke={isSelected ? "#ffffff" : item.color}
                    strokeWidth={isSelected ? 3 : 2}
                    rx="3"
                    style={{
                      cursor: isDraggingItem ? "grabbing" : "grab",
                      opacity: isDraggingItem ? 0.75 : 1,
                    }}
                    onPointerDown={(e) => handleDown(e, item.id)}
                    onPointerMove={handleMove}
                    onPointerUp={handleUp}
                  />
                  {cargoPixelW > 36 && (
                    <text
                      x={cargoPixelX + cargoPixelW / 2 - 1}
                      y={TRUCK_Y + TRUCK_H / 2 - 2}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={cargoPixelW > 70 ? "17" : "14"}
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {(item.weight / 1000).toFixed(1)} т
                    </text>
                  )}
                  {cargoPixelW > 60 && (
                    <text
                      x={cargoPixelX + cargoPixelW / 2 - 1}
                      y={TRUCK_Y + TRUCK_H / 2 + 20}
                      textAnchor="middle"
                      fill="#d4d4d8"
                      fontSize="12"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {item.length.toFixed(1)} м
                    </text>
                  )}
                </g>
              );
            })}

            {/* AXLE LABELS — BIG AND BOLD */}
            <text
              x={frontAxleX}
              y={AXLE_Y - 22}
              textAnchor="middle"
              fill="#e4e4e7"
              fontSize="14"
              fontWeight="800"
            >
              Перед
            </text>
            <AxleCircle
              x={frontAxleX}
              y={AXLE_Y}
              load={result.frontAxle}
              overload={result.overloads.frontAxle}
            />

            <text
              x={rearAxleX}
              y={AXLE_Y - 22}
              textAnchor="middle"
              fill="#e4e4e7"
              fontSize="14"
              fontWeight="800"
            >
              Ведущая
            </text>
            <AxleCircle
              x={rearAxleX}
              y={AXLE_Y}
              load={result.rearAxle}
              overload={result.overloads.rearAxle}
            />

            <text
              x={trailerX + trailerW / 2}
              y={AXLE_Y - 22}
              textAnchor="middle"
              fill="#e4e4e7"
              fontSize="14"
              fontWeight="800"
            >
              Оси прицепа
            </text>
            {trailer.axlePositions.map((pos, i) => (
              <AxleCircle
                key={`axle-${i}`}
                x={trailerX + pos * SCALE}
                y={AXLE_Y}
                load={result.trailerAxles[i] || 0}
                overload={result.overloads.trailerAxleGroup}
              />
            ))}

            {/* Total weight */}
            <text
              x={svgW / 2}
              y={AXLE_Y + 48}
              textAnchor="middle"
              fill={hasOverload ? "#ef4444" : "#d4d4d8"}
              fontSize="18"
              fontWeight="bold"
            >
              Общий: {(result.totalWeight / 1000).toFixed(1)} т
              {hasOverload && " ⚠️"}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function AxleCircle({
  x,
  y,
  load,
  overload,
}: {
  x: number;
  y: number;
  load: number;
  overload: boolean;
}) {
  const tons = (load / 1000).toFixed(2);
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={overload ? 15 : 13}
        fill={overload ? "#dc2626" : "#09090b"}
        stroke={overload ? "#fca5a5" : "#52525b"}
        strokeWidth="3"
      />
      <circle cx={x} cy={y} r="4.5" fill="#71717a" />
      <text
        x={x}
        y={y + 28}
        textAnchor="middle"
        fill={overload ? "#f87171" : "#e4e4e7"}
        fontSize={overload ? "14" : "13"}
        fontWeight="700"
      >
        {tons}
      </text>
    </g>
  );
}
