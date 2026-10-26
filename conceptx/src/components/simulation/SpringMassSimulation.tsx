'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SpringMassSimulation() {
  const [m, setM] = useState<number>(1.0); // kg
  const [k, setK] = useState<number>(40.0); // N/m
  const [A, setA] = useState<number>(0.2); // meters amplitude
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Derived SHM values
  const omega = Math.sqrt(k / m);
  const T = (2 * Math.PI) / omega;
  const vMax = A * omega;
  const totalE = 0.5 * k * A * A;

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (isPlaying) {
        timeRef.current += dt;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          const t = timeRef.current;
          const currentX = A * Math.cos(omega * t);
          const currentV = -A * omega * Math.sin(omega * t);

          const currentPE = 0.5 * k * currentX * currentX;
          const currentKE = 0.5 * m * currentV * currentV;

          // Wall and equilibrium line
          const wallX = 60;
          const centerY = h / 2 - 10;
          const eqX = w / 2;
          const pxPerMeter = 240;
          const blockX = eqX + currentX * pxPerMeter;

          // Ground
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, centerY + 25, w, h - (centerY + 25));
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, centerY + 25);
          ctx.lineTo(w, centerY + 25);
          ctx.stroke();

          // Left Wall
          ctx.fillStyle = '#334155';
          ctx.fillRect(wallX - 20, centerY - 60, 20, 85);

          // Equilibrium line
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(eqX, centerY - 50);
          ctx.lineTo(eqX, centerY + 25);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px Inter';
          ctx.fillText('x = 0', eqX - 12, centerY - 55);

          // Spring coils
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(wallX, centerY);
          const coils = 14;
          const springWidth = blockX - wallX - 25;
          for (let i = 0; i <= coils; i++) {
            const cx = wallX + (springWidth / coils) * i;
            const cy = centerY + (i % 2 === 0 ? -12 : 12);
            ctx.lineTo(cx, cy);
          }
          ctx.lineTo(blockX - 25, centerY);
          ctx.stroke();

          // Oscillating Block (mass m)
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(blockX - 25, centerY - 25, 50, 50);
          ctx.strokeStyle = '#c4b5fd';
          ctx.lineWidth = 2;
          ctx.strokeRect(blockX - 25, centerY - 25, 50, 50);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Inter';
          ctx.fillText(`m=${m}kg`, blockX - 22, centerY + 4);

          // Velocity vector
          if (Math.abs(currentV) > 0.05) {
            const vLen = (currentV / vMax) * 45;
            ctx.strokeStyle = '#10b981';
            ctx.fillStyle = '#10b981';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(blockX, centerY - 32);
            ctx.lineTo(blockX + vLen, centerY - 32);
            ctx.stroke();
          }

          // Live Energy Bars at bottom
          const barY = h - 22;
          const barW = w - 40;
          const keRatio = currentKE / totalE;
          const peRatio = currentPE / totalE;

          ctx.fillStyle = '#10b981';
          ctx.fillRect(20, barY, barW * keRatio, 12);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(20 + barW * keRatio, barY, barW * peRatio, 12);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = '10px "JetBrains Mono"';
          ctx.fillText(`KE: ${currentKE.toFixed(2)} J`, 20, barY - 4);
          ctx.fillText(`PE: ${currentPE.toFixed(2)} J`, w - 100, barY - 4);
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, m, k, A, omega, vMax, totalE]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Simple Harmonic Motion — Real-Time Phase & Energy Tracker
          </h3>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-2.5 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--background-secondary)] flex items-center gap-1"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="bg-slate-950 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} width={640} height={200} className="w-full h-[200px] block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Mass m: {m.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.5"
            value={m}
            onChange={(e) => setM(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-[var(--background-secondary)] rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Spring Constant k: {k} N/m</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-[var(--background-secondary)] rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Amplitude A: {A.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.05"
            value={A}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-[var(--background-secondary)] rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-center text-xs">
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Time Period T</div>
          <div className="font-mono font-bold">{T.toFixed(2)} s</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Max Velocity v_max</div>
          <div className="font-mono font-bold text-emerald-500">{vMax.toFixed(2)} m/s</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Total Energy E</div>
          <div className="font-mono font-bold text-purple-500">{totalE.toFixed(2)} J</div>
        </div>
      </div>
    </div>
  );
}
