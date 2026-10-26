'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Layers } from 'lucide-react';

export function CapacitorSimulation() {
  const [K1, setK1] = useState<number>(2.0);
  const [K2, setK2] = useState<number>(6.0);
  const [V, setV] = useState<number>(12); // Volts
  const d = 0.02; // 2 cm total separation
  const eps0 = 8.854e-12;
  const A = 0.01; // 100 cm^2

  // Equivalent capacitance: C_eq = 2 * K1 * K2 * eps0 * A / ((K1 + K2) * d)
  const C_eq = (2 * K1 * K2 * eps0 * A) / ((K1 + K2) * d);
  const C_eq_pF = (C_eq * 1e12).toFixed(2);

  // E1 and E2
  // E1 = 2 * K2 * V / ((K1 + K2) * d)
  // E2 = 2 * K1 * V / ((K1 + K2) * d)
  const E1 = (2 * K2 * V) / ((K1 + K2) * d);
  const E2 = (2 * K1 * V) / ((K1 + K2) * d);

  // Stored Energy: 1/2 C V^2
  const energy_uJ = (0.5 * C_eq * V * V * 1e6).toFixed(3);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Interactive Dielectric Capacitor Field & Potential Model
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
          Series Dielectrics
        </span>
      </div>

      {/* Visual Diagram of Capacitor Plates & Dielectrics */}
      <div className="bg-slate-950 rounded-lg p-6 relative overflow-hidden flex flex-col items-center">
        {/* Top Plate (+V) */}
        <div className="w-full max-w-md h-4 rounded bg-rose-500 flex items-center justify-center text-[10px] text-white font-mono font-bold shadow-md">
          Top Plate (+ {V}V)
        </div>

        {/* Dielectric 1 Slab (d/2) */}
        <div 
          className="w-full max-w-md h-24 my-0.5 border border-sky-500/50 flex flex-col justify-between p-3 relative transition-colors duration-300"
          style={{ backgroundColor: `rgba(14, 165, 233, ${Math.min(0.7, 0.15 * K1)})` }}
        >
          <div className="flex justify-between items-center text-xs text-sky-200">
            <span className="font-semibold">Dielectric 1 (K₁ = {K1.toFixed(1)})</span>
            <span className="font-mono text-[11px]">Thickness = d / 2</span>
          </div>

          {/* Electric field lines visualization */}
          <div className="flex justify-around items-center opacity-80">
            {Array.from({ length: Math.round(Math.min(10, Math.max(3, (E1 / 1000) * 0.7))) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-sky-300 text-[10px]">
                <span>↓</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-sky-300 flex justify-between">
            <span>E₁ = {E1.toFixed(0)} V/m</span>
            <span>V₁ = {(E1 * (d / 2)).toFixed(2)} V</span>
          </div>
        </div>

        {/* Dielectric 2 Slab (d/2) */}
        <div 
          className="w-full max-w-md h-24 my-0.5 border border-purple-500/50 flex flex-col justify-between p-3 relative transition-colors duration-300"
          style={{ backgroundColor: `rgba(168, 85, 247, ${Math.min(0.7, 0.15 * K2)})` }}
        >
          <div className="flex justify-between items-center text-xs text-purple-200">
            <span className="font-semibold">Dielectric 2 (K₂ = {K2.toFixed(1)})</span>
            <span className="font-mono text-[11px]">Thickness = d / 2</span>
          </div>

          {/* Electric field lines */}
          <div className="flex justify-around items-center opacity-80">
            {Array.from({ length: Math.round(Math.min(10, Math.max(3, (E2 / 1000) * 0.7))) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-purple-300 text-[10px]">
                <span>↓</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-purple-300 flex justify-between">
            <span>E₂ = {E2.toFixed(0)} V/m</span>
            <span>V₂ = {(E2 * (d / 2)).toFixed(2)} V</span>
          </div>
        </div>

        {/* Bottom Plate (0V Ground) */}
        <div className="w-full max-w-md h-4 rounded bg-slate-600 flex items-center justify-center text-[10px] text-white font-mono font-bold shadow-md">
          Bottom Plate (Ground 0V)
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[var(--foreground)]">Dielectric K₁</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{K1.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={K1}
            onChange={(e) => setK1(parseFloat(e.target.value))}
            className="w-full accent-sky-500 h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[var(--foreground)]">Dielectric K₂</span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{K2.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={K2}
            onChange={(e) => setK2(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[var(--foreground)]">Applied Voltage (V)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{V} V</span>
          </div>
          <input
            type="range"
            min="2"
            max="24"
            step="1"
            value={V}
            onChange={(e) => setV(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Mathematical Verification Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border)] text-center text-xs">
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">C_eq</div>
          <div className="font-mono font-bold text-[var(--foreground)]">{C_eq_pF} pF</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">E₁ / E₂ Ratio</div>
          <div className="font-mono font-bold text-sky-500">{(E1 / E2).toFixed(2)} (= K₂/K₁)</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Displacement D</div>
          <div className="font-mono font-bold text-[var(--foreground)]">Continuous ✓</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Stored Energy</div>
          <div className="font-mono font-bold text-amber-500">{energy_uJ} µJ</div>
        </div>
      </div>
    </div>
  );
}
