"use client";

import { useMemo } from "react";

interface SeatLayoutProps {
  layout: "2+2" | "2+1" | "1+2" | "1+1";
  totalSeats: number;
  gapRows?: number[];
  lastRowSeats?: number;
}

export function SeatLayout({
  layout,
  totalSeats,
  gapRows = [],
  lastRowSeats = 5,
}: SeatLayoutProps) {
  const seatConfiguration = useMemo(() => {
    const [left, right] = layout.split("+").map(Number);
    const seatsPerRow = left + right;
    
    // Calculate rows: use lastRowSeats if specified, otherwise calculate normally
    let regularRows = 0;
    let remainingSeats = totalSeats;
    
    // If lastRowSeats is specified and different from seatsPerRow, reserve it for last row
    if (lastRowSeats && lastRowSeats !== seatsPerRow) {
      remainingSeats = totalSeats - lastRowSeats;
      regularRows = Math.floor(remainingSeats / seatsPerRow);
      remainingSeats = totalSeats - (regularRows * seatsPerRow);
    } else {
      // Calculate normally
      regularRows = Math.floor(totalSeats / seatsPerRow);
      remainingSeats = totalSeats - (regularRows * seatsPerRow);
    }

    const rows: Array<{ left: number; right: number; isGap: boolean }> = [];

    // Regular rows
    for (let i = 0; i < regularRows; i++) {
      rows.push({
        left,
        right,
        isGap: gapRows.includes(i),
      });
    }

    // Last row with remaining seats
    if (remainingSeats > 0) {
      // Distribute remaining seats between left and right
      // Try to maintain the layout pattern as much as possible
      const lastLeft = Math.min(left, Math.ceil(remainingSeats / 2));
      const lastRight = remainingSeats - lastLeft;
      rows.push({
        left: lastLeft,
        right: lastRight,
        isGap: false,
      });
    }

    return rows;
  }, [layout, totalSeats, gapRows, lastRowSeats]);

  const renderSeat = (seatNumber: number, side: "left" | "right") => {
    return (
      <div
        key={`${side}-${seatNumber}`}
        className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
      >
        {seatNumber}
      </div>
    );
  };

  let seatCounter = 1;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Bus Front Indicator */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 dark:bg-indigo-900/20">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              🚌 Front
            </span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="space-y-2">
          {seatConfiguration.map((row, rowIndex) => {
            const leftSeats: number[] = [];
            const rightSeats: number[] = [];

            // Generate seat numbers for left side
            for (let i = 0; i < row.left; i++) {
              leftSeats.push(seatCounter++);
            }

            // Generate seat numbers for right side
            for (let i = 0; i < row.right; i++) {
              rightSeats.push(seatCounter++);
            }

            return (
              <div key={rowIndex} className="flex items-center gap-4">
                {/* Left Side Seats */}
                <div className="flex gap-1">
                  {leftSeats.map((seatNum) => renderSeat(seatNum, "left"))}
                </div>

                {/* Aisle */}
                <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600"></div>

                {/* Right Side Seats */}
                <div className="flex gap-1">
                  {rightSeats.map((seatNum) => renderSeat(seatNum, "right"))}
                </div>

                {/* Gap Indicator */}
                {row.isGap && (
                  <div className="ml-2 text-xs text-slate-400">
                    (Door/Gap)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bus Back Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              ⬇️ Back
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Available Seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-dashed border-slate-300 dark:border-slate-600"></div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Aisle</span>
          </div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Total: {totalSeats} seats | Layout: {layout}
          </div>
        </div>
      </div>
    </div>
  );
}

