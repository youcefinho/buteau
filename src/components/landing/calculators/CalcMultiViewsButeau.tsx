import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import {
  Wallet,
  Home as HomeIcon,
  TrendingUp,
  PiggyBank,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { AmortizationSparkline } from "./AmortizationSparkline";
import { WhatIfScenarios } from "./WhatIfScenarios";

/**
 * CalcMultiViewsButeau — Calculateur hypothécaire 4 facettes.
 *
 * Adapte au metier courtier hypothecaire residentiel (Andrew Buteau, Planipret).
 * Pattern hérité de EGSF CalcMultiViews + Mathis Calculator (donut SVG + sliders)
 * mais palette bronze/navy/taupe Buteau au lieu de gold sur dark.
 *
 * 4 onglets :
 *   1. Capacite d'emprunt   — ABD/ATD ratios (32-39 % / 40-44 %)
 *   2. Paiement mensuel     — formule canadienne semi-annuelle composee
 *   3. Fixe vs variable     — comparaison 5 ans deux scenarios
 *   4. Mise de fonds + frais — SCHL + taxe de bienvenue + notaire
 *
 * Architecture :
 *   - Primitives partagees : DonutSvg + BronzeSlider + Tile (signature stat)
 *   - 4 Tab components autonomes (state local)
 *   - Container : header signature + tabs + contenu actif (key remount fade)
 */

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────
const ease = "cubic-bezier(0.16,1,0.3,1)";

function fmtCAD(n: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Formule canadienne : interets composes semi-annuellement, paiement mensuel. */
function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRatePct === 0) return principal / (years * 12);
  const semiAnnual = annualRatePct / 2 / 100;
  const monthly = Math.pow(1 + semiAnnual, 2 / 12) - 1;
  const n = years * 12;
  return (principal * (monthly * Math.pow(1 + monthly, n))) / (Math.pow(1 + monthly, n) - 1);
}

/** Solde restant apres N annees (utilise pour Tab 3 comparaison fixe/variable). */
function balanceAfter(principal: number, annualRatePct: number, years: number, monthsElapsed: number): number {
  if (annualRatePct === 0) return Math.max(0, principal - (principal / (years * 12)) * monthsElapsed);
  const semiAnnual = annualRatePct / 2 / 100;
  const m = Math.pow(1 + semiAnnual, 2 / 12) - 1;
  const n = years * 12;
  const pmt = (principal * (m * Math.pow(1 + m, n))) / (Math.pow(1 + m, n) - 1);
  // FV du solde = principal*(1+m)^k - pmt * ((1+m)^k - 1)/m
  const factor = Math.pow(1 + m, monthsElapsed);
  return Math.max(0, principal * factor - (pmt * (factor - 1)) / m);
}

/** Prime SCHL canadienne pour assurance pret hypothecaire (mise de fonds < 20 %). */
function schlPremiumRate(ltv: number): number {
  if (ltv <= 0.65) return 0.006;
  if (ltv <= 0.75) return 0.017;
  if (ltv <= 0.80) return 0.024;
  if (ltv <= 0.85) return 0.028;
  if (ltv <= 0.90) return 0.031;
  if (ltv <= 0.95) return 0.04;
  return 0; // Au-dessus de 95 %, pas admissible — mise de fonds insuffisante
}

/** Taxe de bienvenue Quebec — table progressive sur prix d'achat. */
function tdmQuebec(prix: number): number {
  // Bareme provincial standard 2025 (Montreal a sa propre table superieure mais on reste sur table generale)
  let tdm = 0;
  const tranches = [
    { max: 53200, taux: 0.005 },
    { max: 266200, taux: 0.01 },
    { max: 552300, taux: 0.015 },
    { max: 1104700, taux: 0.02 },
    { max: 2136500, taux: 0.025 },
    { max: Infinity, taux: 0.035 },
  ];
  let restant = prix;
  let plafond = 0;
  for (const t of tranches) {
    const segment = Math.min(restant, t.max - plafond);
    if (segment <= 0) break;
    tdm += segment * t.taux;
    restant -= segment;
    plafond = t.max;
    if (restant <= 0) break;
  }
  return tdm;
}

// ─────────────────────────────────────
// Primitives — DonutSvg + BronzeSlider + Tile
// ─────────────────────────────────────
type DonutSegment = { value: number; color: string; label: string };

function DonutSvg({
  segments,
  centerLabel,
  centerValue,
  size = "md",
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  size?: "sm" | "md" | "lg";
}) {
  const RADIUS = 80;
  const STROKE = 22;
  const C = 2 * Math.PI * RADIUS;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  const sizeClass =
    size === "sm"
      ? "w-32 h-32"
      : size === "lg"
        ? "w-56 h-56 md:w-64 md:h-64"
        : "w-48 h-48 md:w-56 md:h-56";

  return (
    <div className="relative inline-block">
      <svg viewBox="0 0 200 200" className={`${sizeClass} -rotate-90`}>
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="color-mix(in oklch, var(--color-bronze) 14%, transparent)"
          strokeWidth={STROKE}
        />
        {segments.map((seg, i) => {
          const len = total > 0 ? (seg.value / total) * C : 0;
          const dashArray = `${len} ${C}`;
          const dashOffset = -offset;
          offset += len;
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              style={{
                transition: `stroke-dasharray 0.6s ${ease}, stroke-dashoffset 0.6s ${ease}`,
              }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {centerLabel && (
            <span
              className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "color-mix(in oklch, var(--color-taupe-dark) 95%, transparent)" }}
            >
              {centerLabel}
            </span>
          )}
          {centerValue && (
            <span className="font-[var(--font-editorial)] italic text-[clamp(1.25rem,1.8vw,1.5rem)] text-[color:var(--color-navy-deep)] tabular-nums mt-1.5 leading-none">
              {centerValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function BronzeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  unit?: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2 gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-taupe-dark)] flex-shrink-0 font-semibold">
          {label}
        </label>
        <div className="flex items-baseline gap-1.5 min-w-0">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onChange(clamp(n, min, max));
            }}
            onBlur={(e) => {
              const n = Number(e.target.value);
              if (Number.isNaN(n)) onChange(min);
              else onChange(clamp(n, min, max));
            }}
            aria-label={label}
            className="text-base font-bold text-[color:var(--color-navy-deep)] tabular-nums bg-transparent border-b outline-none text-right w-24 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-[color:var(--color-bronze)]"
            style={{ borderColor: "color-mix(in oklch, var(--color-bronze) 30%, transparent)" }}
          />
          {unit && (
            <span className="text-[11px] text-[color:var(--color-taupe-dark)] flex-shrink-0 tabular-nums">
              {unit}
            </span>
          )}
        </div>
      </div>
      <div className="relative h-1.5">
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "color-mix(in oklch, var(--color-bronze) 14%, transparent)" }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: "var(--color-bronze)",
            boxShadow: "0 0 8px color-mix(in oklch, var(--color-bronze) 35%, transparent)",
            transition: "width 0.15s ease",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none w-4 h-4 rounded-full border-2 border-white"
          style={{
            left: `${percent}%`,
            backgroundColor: "var(--color-bronze)",
            boxShadow: "0 0 6px color-mix(in oklch, var(--color-bronze) 50%, transparent)",
            transition: "left 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="border border-[color:var(--color-taupe)]/40 p-4 bg-[color:var(--color-cream)]/60 backdrop-blur-sm">
      <p className="eyebrow text-[color:var(--color-taupe-dark)] text-[9px] mb-1.5">{label}</p>
      <p
        className={`font-[var(--font-display)] font-bold tabular-nums leading-none ${
          emphasis ? "text-[color:var(--color-bronze-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)]" : "text-[color:var(--color-navy-deep)] text-[clamp(1.125rem,1.6vw,1.25rem)]"
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] mt-2 leading-snug">
          {hint}
        </p>
      )}
    </div>
  );
}

// Palette donut — bronze + warm accents harmonious avec palette Buteau
const SEG = {
  bronze: "var(--color-bronze)",
  bronzeDeep: "var(--color-bronze-deep)",
  taupe: "var(--color-taupe-dark)",
  navy: "var(--color-navy-deep)",
};

// ─────────────────────────────────────
// Mini-viz partagees par les autres tabs
// ─────────────────────────────────────

/** Horizontal bar chart — sensibilite au taux pour Tab Capacite */
function RateSensitivityChart({
  rates,
  capacities,
  currentRate,
  label,
}: {
  rates: number[];
  capacities: number[];
  currentRate: number;
  label: string;
}) {
  const max = Math.max(...capacities);
  return (
    <div className="border border-[color:var(--color-taupe)]/40 bg-[color:var(--color-cream)]/60 p-5">
      <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-4">{label}</p>
      <div className="space-y-3">
        {rates.map((r, i) => {
          const cap = capacities[i];
          const pct = max > 0 ? (cap / max) * 100 : 0;
          const isCurrent = Math.abs(r - currentRate) < 0.025;
          return (
            <div key={r} className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span
                  className={`tabular-nums font-semibold ${
                    isCurrent
                      ? "text-[color:var(--color-bronze-deep)]"
                      : "text-[color:var(--color-taupe-dark)]"
                  }`}
                >
                  {r.toFixed(2)}%
                  {isCurrent && <span className="ml-1.5 text-[10px] uppercase tracking-wider">← actuel</span>}
                </span>
                <span
                  className={`tabular-nums font-semibold ${
                    isCurrent
                      ? "text-[color:var(--color-bronze-deep)]"
                      : "text-[color:var(--color-navy-deep)]"
                  }`}
                >
                  {fmtCAD(cap)}
                </span>
              </div>
              <div className="relative h-2 bg-[color:var(--color-taupe)]/15 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isCurrent
                      ? "var(--color-bronze)"
                      : "color-mix(in oklch, var(--color-bronze) 45%, transparent)",
                    boxShadow: isCurrent
                      ? "0 0 8px color-mix(in oklch, var(--color-bronze) 40%, transparent)"
                      : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** SVG line chart 2 lignes — courbes interets cumules pour Tab Comparaison */
function CumulativeInterestChart({
  fixedSeries,
  variableSeries,
  monthsLabels,
  fixedLabel,
  variableLabel,
}: {
  fixedSeries: number[];
  variableSeries: number[];
  monthsLabels: string[];
  fixedLabel: string;
  variableLabel: string;
}) {
  const W = 520;
  const H = 200;
  const PAD = { t: 16, r: 16, b: 28, l: 56 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = Math.max(...fixedSeries, ...variableSeries, 1);
  const n = fixedSeries.length - 1;

  const path = (series: number[]) =>
    series
      .map((v, i) => {
        const x = PAD.l + (i / n) * innerW;
        const y = PAD.t + innerH - (v / max) * innerH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(max * p));

  return (
    <div className="border border-[color:var(--color-taupe)]/40 bg-[color:var(--color-cream)]/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow text-[color:var(--color-bronze-deep)]">
          Intérêts cumulés
        </p>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-[color:var(--color-navy-deep)]" />
            <span className="text-[color:var(--color-taupe-dark)]">{fixedLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-[color:var(--color-bronze)]" />
            <span className="text-[color:var(--color-taupe-dark)]">{variableLabel}</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-hidden="true">
        {/* Y-axis ticks */}
        {yTicks.map((v, i) => {
          const y = PAD.t + innerH - (v / max) * innerH;
          return (
            <g key={i}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y}
                y2={y}
                stroke="color-mix(in oklch, var(--color-taupe) 25%, transparent)"
                strokeWidth={i === 0 ? 1 : 0.5}
                strokeDasharray={i === 0 ? "" : "3 3"}
              />
              <text
                x={PAD.l - 8}
                y={y + 3}
                textAnchor="end"
                fill="var(--color-taupe-dark)"
                fontSize="10"
                className="tabular-nums"
              >
                {fmtCAD(v)}
              </text>
            </g>
          );
        })}
        {/* X-axis labels */}
        {monthsLabels.map((lbl, i) => {
          const x = PAD.l + (i / (monthsLabels.length - 1)) * innerW;
          return (
            <text
              key={i}
              x={x}
              y={H - 8}
              textAnchor="middle"
              fill="var(--color-taupe-dark)"
              fontSize="10"
            >
              {lbl}
            </text>
          );
        })}
        {/* Fixed line — navy */}
        <path
          d={path(fixedSeries)}
          fill="none"
          stroke="var(--color-navy-deep)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Variable line — bronze */}
        <path
          d={path(variableSeries)}
          fill="none"
          stroke="var(--color-bronze)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** 3 scenarios MDF side-by-side pour Tab Mise de fonds */
function MdfComparisonGrid({
  prix,
  taux,
  amort,
  schlRateFn,
}: {
  prix: number;
  taux: number;
  amort: number;
  schlRateFn: (ltv: number) => number;
}) {
  const scenarios = [5, 10, 20].map((pct) => {
    const mdf = (prix * pct) / 100;
    const principal = Math.max(0, prix - mdf);
    const ltv = principal / prix;
    const schlApplies = pct < 20;
    const primeRate = schlApplies ? schlRateFn(ltv) : 0;
    const prime = schlApplies ? principal * primeRate : 0;
    const loanWithSchl = principal + prime;
    // Reuse local monthly payment formula (semi-annual canadien)
    const m = taux > 0 ? Math.pow(1 + taux / 2 / 100, 2 / 12) - 1 : 0;
    const n = amort * 12;
    const pmt =
      m > 0
        ? (loanWithSchl * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1)
        : loanWithSchl / n;
    return { pct, mdf, prime, pmt };
  });

  return (
    <div className="border border-[color:var(--color-taupe)]/40 bg-[color:var(--color-cream)]/60 p-5">
      <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-4">
        Impact de la mise de fonds
      </p>
      <div className="grid grid-cols-3 gap-3">
        {scenarios.map((s) => (
          <div
            key={s.pct}
            className={`border p-4 text-center ${
              s.pct === 20
                ? "border-[color:var(--color-bronze)] bg-[color:var(--color-bronze)]/8"
                : "border-[color:var(--color-taupe)]/40"
            }`}
          >
            <p className="font-[var(--font-display)] font-bold text-[color:var(--color-bronze-deep)] text-3xl mb-1">
              {s.pct}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-taupe-dark)] mb-3">
              MDF {fmtCAD(s.mdf)}
            </p>
            <div className="space-y-1.5 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-taupe-dark)]">
                  Paiement
                </p>
                <p className="font-bold text-[color:var(--color-navy-deep)] tabular-nums">
                  {fmtCAD(s.pmt)}/mo
                </p>
              </div>
              <div className="pt-1.5 border-t border-[color:var(--color-taupe)]/30">
                <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-taupe-dark)]">
                  Prime SCHL
                </p>
                <p
                  className={`font-bold tabular-nums ${
                    s.prime > 0
                      ? "text-[color:var(--color-bronze-deep)]"
                      : "text-[color:var(--color-taupe-dark)]"
                  }`}
                >
                  {s.prime > 0 ? fmtCAD(s.prime) : "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] mt-4 leading-snug">
        20 % MDF = aucune prime SCHL + paiement réduit, mais cash initial plus élevé. Le bon arbitrage dépend de votre liquidité disponible.
      </p>
    </div>
  );
}

type CalcMode = "full" | "preview";

// ─────────────────────────────────────
// Tab 1 — Capacite d'emprunt (ABD/ATD)
// ─────────────────────────────────────
function TabCapacite({ mode }: { mode: CalcMode }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [revenuBrut, setRevenuBrut] = useState(95000);
  const [dettesMensuelles, setDettesMensuelles] = useState(450);
  const [taux, setTaux] = useState(5.25);
  const [mdf, setMdf] = useState(60000);

  // Cibles GDS/TDS courantes (Buteau article : 32-39 % ABD / 40-44 % ATD)
  const abdRatio = 0.35;
  const atdRatio = 0.42;
  const revenuMensuel = revenuBrut / 12;
  // Charges habitation hors hypotheque (taxes + chauffage + 50 % copro si applicable)
  const chargesHab = 350;

  // Limite ABD : (revenu * 0.35) - charges habitation = paiement hypothecaire max
  const paimntAbd = Math.max(0, revenuMensuel * abdRatio - chargesHab);
  // Limite ATD : (revenu * 0.42) - charges - dettes = paiement hypothecaire max
  const paimntAtd = Math.max(0, revenuMensuel * atdRatio - chargesHab - dettesMensuelles);
  // Cap final = min(ABD, ATD)
  const paimntMax = Math.min(paimntAbd, paimntAtd);
  // Reverse-solve principal sur 25 ans avec taux donne
  // P = pmt * ((1+m)^n - 1) / (m * (1+m)^n)
  const m = Math.pow(1 + taux / 2 / 100, 2 / 12) - 1;
  const n = 25 * 12;
  const principalMax =
    m > 0 ? (paimntMax * (Math.pow(1 + m, n) - 1)) / (m * Math.pow(1 + m, n)) : paimntMax * n;
  const prixMax = principalMax + mdf;

  // Sensibilite : capacite d'emprunt a 5 taux differents (autour du taux actuel)
  const sensitivityRates = [3.5, 4.5, 5.5, 6.5, 7.5];
  const sensitivityCapacities = sensitivityRates.map((r) => {
    const mr = Math.pow(1 + r / 2 / 100, 2 / 12) - 1;
    return mr > 0 ? (paimntMax * (Math.pow(1 + mr, n) - 1)) / (mr * Math.pow(1 + mr, n)) : paimntMax * n;
  });

  const segments: DonutSegment[] = [
    {
      value: paimntAbd,
      color: SEG.bronze,
      label: isFr ? "Limite ABD (35 %)" : "GDS limit (35%)",
    },
    {
      value: Math.max(0, paimntAtd - dettesMensuelles),
      color: SEG.bronzeDeep,
      label: isFr ? "Limite ATD (42 %)" : "TDS limit (42%)",
    },
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
      <div className="space-y-5">
        <BronzeSlider
          label={isFr ? "Revenu brut annuel" : "Gross annual income"}
          value={revenuBrut}
          min={30000}
          max={400000}
          step={1000}
          onChange={setRevenuBrut}
          unit="$"
        />
        <BronzeSlider
          label={isFr ? "Dettes mensuelles (auto, cartes…)" : "Monthly debts (car, cards…)"}
          value={dettesMensuelles}
          min={0}
          max={3000}
          step={25}
          onChange={setDettesMensuelles}
          unit="$/mois"
        />
        <BronzeSlider
          label={isFr ? "Taux hypothécaire estimé" : "Estimated mortgage rate"}
          value={taux}
          min={2}
          max={9}
          step={0.05}
          onChange={setTaux}
          unit="%"
        />
        <BronzeSlider
          label={isFr ? "Mise de fonds disponible" : "Available down payment"}
          value={mdf}
          min={0}
          max={500000}
          step={1000}
          onChange={setMdf}
          unit="$"
        />

        <div className="pt-2">
          <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] leading-relaxed text-pretty hyphens-auto">
            {isFr
              ? "Estimation basée sur les ratios ABD/ATD courants (35 % / 42 %), amortissement 25 ans, charges habitation 350 $/mois (taxes + chauffage). Hors stress-test B-20 — un courtier valide votre dossier réel."
              : "Estimate based on standard GDS/TDS ratios (35% / 42%), 25-year amortization, $350/mo housing costs (taxes + heating). Excludes B-20 stress test — a broker validates your real file."}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-5">
          <DonutSvg
            segments={segments}
            centerLabel={isFr ? "Paiement max" : "Max payment"}
            centerValue={`${fmtCAD(paimntMax)}/mo`}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Tile
            label={isFr ? "Capacité d'emprunt" : "Borrowing capacity"}
            value={fmtCAD(principalMax)}
            emphasis
          />
          <Tile
            label={isFr ? "Prix de propriété max" : "Max property price"}
            value={fmtCAD(prixMax)}
            hint={isFr ? `Avec ${fmtCAD(mdf)} de mise de fonds` : `With ${fmtCAD(mdf)} down`}
          />
        </div>

        <Link
          to="/"
          hash="contact"
          className="group inline-flex items-center gap-3 mt-3 text-xs uppercase tracking-[0.22em] font-bold text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          {isFr ? "Valider avec Andrew" : "Validate with Andrew"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Pleine largeur — sensibilite au taux : combien d'emprunt a 5 taux differents (mode full uniquement) */}
      {mode === "full" && (
        <div className="lg:col-span-2 mt-6 border-t border-[color:var(--color-taupe)]/30 pt-10">
          <RateSensitivityChart
            rates={sensitivityRates}
            capacities={sensitivityCapacities}
            currentRate={taux}
            label={isFr ? "Sensibilité de votre capacité au taux" : "Capacity sensitivity to rate"}
          />
          <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] mt-3 leading-snug">
            {isFr
              ? "Avec le même revenu et les mêmes dettes, une baisse d'1 % de taux peut bonifier votre capacité de plusieurs dizaines de milliers de dollars. Le timing du marché compte."
              : "With the same income and debts, a 1% rate drop can lift your capacity by tens of thousands. Market timing matters."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Tab 2 — Paiement mensuel + amortissement
// ─────────────────────────────────────
function TabPaiement({ mode }: { mode: CalcMode }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [prix, setPrix] = useState(450000);
  const [mdf, setMdf] = useState(45000);
  const [taux, setTaux] = useState(5.25);
  const [amort, setAmort] = useState(25);

  const principal = Math.max(0, prix - mdf);
  const pmt = monthlyPayment(principal, taux, amort);
  const totalPaye = pmt * amort * 12;
  const totalInterets = Math.max(0, totalPaye - principal);
  // Taux mensuel composé semi-annuel — pour graph + What If
  const monthlyR = taux > 0 ? Math.pow(1 + taux / 2 / 100, 2 / 12) - 1 : 0;
  const nPayments = amort * 12;

  const segments: DonutSegment[] = [
    {
      value: principal,
      color: SEG.bronze,
      label: isFr ? "Capital" : "Principal",
    },
    {
      value: totalInterets,
      color: SEG.taupe,
      label: isFr ? "Intérêts totaux" : "Total interest",
    },
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
      <div className="space-y-5">
        <BronzeSlider
          label={isFr ? "Prix de la propriété" : "Property price"}
          value={prix}
          min={100000}
          max={2000000}
          step={5000}
          onChange={setPrix}
          unit="$"
        />
        <BronzeSlider
          label={isFr ? "Mise de fonds" : "Down payment"}
          value={mdf}
          min={0}
          max={Math.min(prix, 1000000)}
          step={1000}
          onChange={setMdf}
          unit="$"
        />
        <BronzeSlider
          label={isFr ? "Taux hypothécaire" : "Mortgage rate"}
          value={taux}
          min={1}
          max={12}
          step={0.05}
          onChange={setTaux}
          unit="%"
        />
        <BronzeSlider
          label={isFr ? "Amortissement" : "Amortization"}
          value={amort}
          min={5}
          max={30}
          step={1}
          onChange={setAmort}
          unit={isFr ? "ans" : "yrs"}
        />

        <div className="pt-2">
          <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] leading-relaxed text-pretty hyphens-auto">
            {isFr
              ? "Calcul selon la formule canadienne semi-annuelle composée (LBC art. 6). Indicatif uniquement — votre prêteur établit le paiement réel selon le taux confirmé."
              : "Calculation per Canadian semi-annual compounded formula (IRA s. 6). Indicative only — your lender sets the actual payment based on confirmed rate."}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-5">
          <DonutSvg
            segments={segments}
            centerLabel={isFr ? "Mensualité" : "Monthly"}
            centerValue={`${fmtCAD(pmt)}`}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Tile
            label={isFr ? "Capital emprunté" : "Principal borrowed"}
            value={fmtCAD(principal)}
          />
          <Tile
            label={isFr ? "Intérêts totaux" : "Total interest"}
            value={fmtCAD(totalInterets)}
            emphasis
            hint={
              isFr
                ? `Sur ${amort} ans à ${taux.toFixed(2)} %`
                : `Over ${amort} years at ${taux.toFixed(2)}%`
            }
          />
        </div>

        <Link
          to="/"
          hash="contact"
          className="group inline-flex items-center gap-3 mt-3 text-xs uppercase tracking-[0.22em] font-bold text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          {isFr ? "Bloquer ce taux" : "Lock this rate"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Pleine largeur : graph amortissement + What If scenarios (mode full uniquement) */}
      {mode === "full" && (
        <div className="lg:col-span-2 space-y-10 mt-6">
          <div className="border-t border-[color:var(--color-taupe)]/30 pt-10">
            <AmortizationSparkline
              principal={principal}
              monthlyPayment={pmt}
              monthlyRate={monthlyR}
              numberOfPayments={nPayments}
            />
          </div>
          <div className="border-t border-[color:var(--color-taupe)]/30 pt-10">
            <WhatIfScenarios
              principal={principal}
              monthlyPayment={pmt}
              monthlyRate={monthlyR}
              numberOfPayments={nPayments}
              totalInterest={totalInterets}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Tab 3 — Fixe vs Variable (comparaison 5 ans)
// ─────────────────────────────────────
function TabComparaison({ mode }: { mode: CalcMode }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [principal, setPrincipal] = useState(400000);
  const [tauxFixe, setTauxFixe] = useState(5.0);
  const [tauxVarInit, setTauxVarInit] = useState(5.75);
  const [tauxVarMoyen, setTauxVarMoyen] = useState(5.25);
  const amort = 25;
  const terme = 5;

  // Fixe : un seul taux sur tout le terme
  const pmtFixe = monthlyPayment(principal, tauxFixe, amort);
  const totalFixe = pmtFixe * terme * 12;
  const soldeFixe = balanceAfter(principal, tauxFixe, amort, terme * 12);
  const interetsFixe = totalFixe - (principal - soldeFixe);

  // Variable : on simule 2 ans au taux initial puis 3 ans au taux moyen (approximation)
  const pmtVar1 = monthlyPayment(principal, tauxVarInit, amort);
  const soldeApres2 = balanceAfter(principal, tauxVarInit, amort, 24);
  // Phase 2 : reamortissement sur 23 ans restants au nouveau taux
  const pmtVar2 = monthlyPayment(soldeApres2, tauxVarMoyen, amort - 2);
  const total24m = pmtVar1 * 24;
  const total36m = pmtVar2 * 36;
  const totalVar = total24m + total36m;
  const soldeVar = balanceAfter(soldeApres2, tauxVarMoyen, amort - 2, 36);
  const interetsVar = totalVar - (principal - soldeVar);

  const ecart = totalFixe - totalVar;
  const ecartInterets = interetsFixe - interetsVar;
  const variableGagnant = ecart > 0;

  // Series interets cumules sur 60 mois pour le graph
  function cumulativeInterest(princ: number, ratePct: number, amortYears: number, months: number): number[] {
    if (ratePct === 0 || princ <= 0) return Array.from({ length: months + 1 }, () => 0);
    const m = Math.pow(1 + ratePct / 2 / 100, 2 / 12) - 1;
    const N = amortYears * 12;
    const pmt = (princ * m * Math.pow(1 + m, N)) / (Math.pow(1 + m, N) - 1);
    let bal = princ;
    let cum = 0;
    const out: number[] = [0];
    for (let k = 1; k <= months; k++) {
      const int = bal * m;
      cum += int;
      bal = bal + int - pmt;
      out.push(cum);
    }
    return out;
  }
  const fixedSeries = cumulativeInterest(principal, tauxFixe, amort, 60);
  // Variable : 24 mois au tauxVarInit puis 36 mois reamortise au tauxVarMoyen
  const varSeriesPhase1 = cumulativeInterest(principal, tauxVarInit, amort, 24);
  const balAfter24Phase = balanceAfter(principal, tauxVarInit, amort, 24);
  const varSeriesPhase2Raw = cumulativeInterest(balAfter24Phase, tauxVarMoyen, amort - 2, 36);
  const cumAt24 = varSeriesPhase1[24];
  const variableSeries = [
    ...varSeriesPhase1,
    ...varSeriesPhase2Raw.slice(1).map((v) => v + cumAt24),
  ];
  const monthsLabels = ["0", "12", "24", "36", "48", "60"];

  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-start">
      <div className="space-y-5">
        <BronzeSlider
          label={isFr ? "Capital hypothécaire" : "Mortgage principal"}
          value={principal}
          min={100000}
          max={1500000}
          step={5000}
          onChange={setPrincipal}
          unit="$"
        />
        <BronzeSlider
          label={isFr ? "Taux fixe 5 ans" : "5-year fixed rate"}
          value={tauxFixe}
          min={2}
          max={9}
          step={0.05}
          onChange={setTauxFixe}
          unit="%"
        />
        <BronzeSlider
          label={isFr ? "Taux variable de départ" : "Initial variable rate"}
          value={tauxVarInit}
          min={2}
          max={9}
          step={0.05}
          onChange={setTauxVarInit}
          unit="%"
        />
        <BronzeSlider
          label={isFr ? "Taux variable moyen anticipé (an 3-5)" : "Anticipated variable avg (yr 3-5)"}
          value={tauxVarMoyen}
          min={2}
          max={9}
          step={0.05}
          onChange={setTauxVarMoyen}
          unit="%"
        />

        <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] leading-relaxed pt-2 text-pretty hyphens-auto">
          {isFr
            ? "Scénario simplifié : 24 mois au taux variable initial, puis 36 mois au taux moyen anticipé. La réalité dépend des décisions de la Banque du Canada — pas une prédiction."
            : "Simplified scenario: 24 months at initial variable rate, then 36 months at anticipated average. Reality depends on Bank of Canada decisions — not a prediction."}
        </p>
      </div>

      <div className="space-y-5">
        {/* Comparison side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[color:var(--color-taupe)]/40 p-5 bg-[color:var(--color-cream)]/60">
            <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-3">
              {isFr ? "Fixe" : "Fixed"}
            </p>
            <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl tabular-nums mb-1">
              {fmtCAD(pmtFixe)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-taupe-dark)] mb-4">
              /{isFr ? "mois" : "mo"}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Total payé (5 ans)" : "Total (5 yrs)"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(totalFixe)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Intérêts (5 ans)" : "Interest (5 yrs)"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(interetsFixe)}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[color:var(--color-taupe)]/30">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Solde fin terme" : "End-of-term balance"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(soldeFixe)}
                </span>
              </div>
            </div>
          </div>

          <div
            className="border p-5 transition-colors duration-500"
            style={{
              borderColor: variableGagnant
                ? "var(--color-bronze)"
                : "color-mix(in oklch, var(--color-taupe) 50%, transparent)",
              background: variableGagnant
                ? "color-mix(in oklch, var(--color-bronze) 8%, var(--color-cream))"
                : "color-mix(in oklch, var(--color-cream) 60%, transparent)",
            }}
          >
            <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-3">
              {isFr ? "Variable" : "Variable"}
            </p>
            <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl tabular-nums mb-1">
              {fmtCAD(pmtVar1)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-taupe-dark)] mb-4">
              /{isFr ? "mois (an 1-2)" : "mo (yr 1-2)"}
              <br />
              {fmtCAD(pmtVar2)} /{isFr ? "mois (an 3-5)" : "mo (yr 3-5)"}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Total payé (5 ans)" : "Total (5 yrs)"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(totalVar)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Intérêts (5 ans)" : "Interest (5 yrs)"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(interetsVar)}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[color:var(--color-taupe)]/30">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Solde fin terme" : "End-of-term balance"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
                  {fmtCAD(soldeVar)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="border-l-3 border-[color:var(--color-bronze)] pl-5 py-2 bg-[color:var(--color-cream-warm)]/40">
          <p className="eyebrow text-[color:var(--color-bronze-deep)] mb-2">
            {isFr ? "Écart sur 5 ans" : "5-year delta"}
          </p>
          <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-2xl tabular-nums">
            {variableGagnant ? "+" : ""}
            {fmtCAD(Math.abs(ecart))}
          </p>
          <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-navy-deep)]/80 mt-2 leading-snug">
            {variableGagnant
              ? isFr
                ? `Dans ce scénario, le variable économise ${fmtCAD(Math.abs(ecartInterets))} d'intérêts. Mais le risque est sur vous : un taux supérieur changerait le verdict.`
                : `In this scenario, variable saves ${fmtCAD(Math.abs(ecartInterets))} in interest. But you carry the risk: a higher rate flips the result.`
              : isFr
                ? `Dans ce scénario, le fixe est plus prévisible et économise ${fmtCAD(Math.abs(ecartInterets))} d'intérêts vs ce variable. Sécurité ≥ pari.`
                : `In this scenario, fixed is more predictable and saves ${fmtCAD(Math.abs(ecartInterets))} vs variable. Security ≥ bet.`}
          </p>
        </div>

        <Link
          to="/"
          hash="contact"
          className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-bold text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          {isFr ? "Discuter de ma stratégie" : "Discuss my strategy"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Pleine largeur — courbes interets cumules fixe vs variable sur 60 mois (mode full uniquement) */}
      {mode === "full" && (
        <div className="lg:col-span-2 mt-6 border-t border-[color:var(--color-taupe)]/30 pt-10">
          <CumulativeInterestChart
            fixedSeries={fixedSeries}
            variableSeries={variableSeries}
            monthsLabels={monthsLabels}
            fixedLabel={isFr ? "Fixe" : "Fixed"}
            variableLabel={isFr ? "Variable" : "Variable"}
          />
          <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] mt-3 leading-snug">
            {isFr
              ? "L'écart visuel entre les 2 courbes représente votre gain (ou perte) potentiel sur le terme. Plus la courbe est haute, plus vous payez d'intérêts."
              : "The visual gap between the 2 curves shows your potential gain (or loss) over the term. The higher the curve, the more interest paid."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Tab 4 — Mise de fonds + frais d'acquisition
// ─────────────────────────────────────
function TabMiseDeFonds({ mode }: { mode: CalcMode }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [prix, setPrix] = useState(450000);
  const [mdfPct, setMdfPct] = useState(10);
  const [residence, setResidence] = useState<"primaire" | "secondaire">("primaire");

  const mdf = (prix * mdfPct) / 100;
  const principal = Math.max(0, prix - mdf);
  const ltv = principal / prix;

  // SCHL applicable si mise de fonds < 20 % ET residence primaire
  const schlApplicable = mdfPct < 20 && residence === "primaire";
  const primeRate = schlApplicable ? schlPremiumRate(ltv) : 0;
  const primeSchl = schlApplicable ? principal * primeRate : 0;
  const tps = primeSchl * 0.09975; // TVQ + TPS sur prime SCHL au QC

  // Frais de cloture estimes
  const tdm = tdmQuebec(prix);
  const notaire = clamp(1500, 1000, 2500); // forfait notarial moyen QC
  const inspection = 600;
  const evaluation = 400;
  const ajustementsTaxes = 800; // taxes municipales/scolaires proratees moyenne
  const fraisCloture = tdm + notaire + inspection + evaluation + ajustementsTaxes;

  const cashTotal = mdf + fraisCloture + tps;

  const segments: DonutSegment[] = [
    { value: mdf, color: SEG.bronze, label: isFr ? "Mise de fonds" : "Down payment" },
    { value: tdm, color: SEG.bronzeDeep, label: isFr ? "Taxe de bienvenue" : "Welcome tax" },
    {
      value: notaire + inspection + evaluation + ajustementsTaxes + tps,
      color: SEG.taupe,
      label: isFr ? "Frais professionnels + taxes" : "Pro fees + taxes",
    },
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
      <div className="space-y-5">
        <BronzeSlider
          label={isFr ? "Prix de la propriété" : "Property price"}
          value={prix}
          min={100000}
          max={2000000}
          step={5000}
          onChange={setPrix}
          unit="$"
        />
        <BronzeSlider
          label={isFr ? "Mise de fonds" : "Down payment"}
          value={mdfPct}
          min={5}
          max={50}
          step={0.5}
          onChange={setMdfPct}
          unit="%"
        />

        {/* Toggle residence */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-taupe-dark)] font-semibold mb-2">
            {isFr ? "Type d'occupation" : "Occupancy type"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["primaire", "secondaire"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setResidence(opt)}
                className={`text-sm font-semibold py-2.5 transition-colors duration-200 border ${
                  residence === opt
                    ? "border-[color:var(--color-bronze)] bg-[color:var(--color-bronze)]/10 text-[color:var(--color-bronze-deep)]"
                    : "border-[color:var(--color-taupe)]/40 text-[color:var(--color-taupe-dark)] hover:border-[color:var(--color-bronze)]/60"
                }`}
              >
                {isFr
                  ? opt === "primaire"
                    ? "Résidence principale"
                    : "Investissement / secondaire"
                  : opt === "primaire"
                    ? "Primary residence"
                    : "Investment / secondary"}
              </button>
            ))}
          </div>
        </div>

        <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] leading-relaxed pt-2 text-pretty hyphens-auto">
          {isFr
            ? "Frais estimés : taxe de bienvenue (barème Québec), notaire ~1 500 $, inspection 600 $, évaluation 400 $, ajustements taxes 800 $. SCHL applicable < 20 % MDF en résidence principale uniquement."
            : "Estimated fees: welcome tax (Quebec scale), notary ~$1,500, inspection $600, appraisal $400, tax adjustments $800. CMHC insurance only applies < 20% DP on primary residence."}
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-5">
          <DonutSvg
            segments={segments}
            centerLabel={isFr ? "Liquidités requises" : "Cash needed"}
            centerValue={fmtCAD(cashTotal)}
            size="lg"
          />
        </div>

        <div className="space-y-2 text-sm border border-[color:var(--color-taupe)]/40 bg-[color:var(--color-cream)]/60 p-4">
          <div className="flex justify-between">
            <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Mise de fonds" : "Down payment"}</span>
            <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">{fmtCAD(mdf)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Taxe de bienvenue (QC)" : "Welcome tax (QC)"}</span>
            <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">{fmtCAD(tdm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Notaire + inspection + évaluation" : "Notary + inspection + appraisal"}</span>
            <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">
              {fmtCAD(notaire + inspection + evaluation)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "Ajustements taxes" : "Tax adjustments"}</span>
            <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">{fmtCAD(ajustementsTaxes)}</span>
          </div>
          {schlApplicable && (
            <>
              <div className="flex justify-between pt-2 border-t border-[color:var(--color-taupe)]/30">
                <span className="text-[color:var(--color-taupe-dark)]">
                  {isFr ? `Prime SCHL (${(primeRate * 100).toFixed(2)} %)` : `CMHC premium (${(primeRate * 100).toFixed(2)}%)`}
                </span>
                <span className="text-[color:var(--color-bronze-deep)] font-semibold tabular-nums">
                  {fmtCAD(primeSchl)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--color-taupe-dark)]">{isFr ? "TVQ + TPS sur prime SCHL" : "QST + GST on CMHC"}</span>
                <span className="text-[color:var(--color-navy-deep)] font-semibold tabular-nums">{fmtCAD(tps)}</span>
              </div>
              <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] pt-1 leading-snug">
                {isFr
                  ? `Prime SCHL ajoutée au prêt — pas exigée en liquide, mais les taxes (${fmtCAD(tps)}) sont dues à la signature.`
                  : `CMHC premium added to loan — not due in cash, but taxes (${fmtCAD(tps)}) are due at signing.`}
              </p>
            </>
          )}
          <div className="flex justify-between pt-2 mt-1 border-t border-[color:var(--color-bronze)]/30 bg-[color:var(--color-bronze)]/8 -mx-4 px-4 py-2">
            <span className="text-[color:var(--color-bronze-deep)] font-semibold uppercase tracking-wider text-xs">
              {isFr ? "Total liquidités" : "Total cash"}
            </span>
            <span className="text-[color:var(--color-bronze-deep)] font-bold tabular-nums">{fmtCAD(cashTotal)}</span>
          </div>
        </div>

        <Link
          to="/"
          hash="contact"
          className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] font-bold text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
        >
          {isFr ? "Préparer mon dossier" : "Prepare my file"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Pleine largeur — comparaison 3 scenarios MDF (5 / 10 / 20 %) — mode full uniquement */}
      {mode === "full" && (
        <div className="lg:col-span-2 mt-6 border-t border-[color:var(--color-taupe)]/30 pt-10">
          <MdfComparisonGrid prix={prix} taux={5.25} amort={25} schlRateFn={schlPremiumRate} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Container
// ─────────────────────────────────────
type TabId = "capacite" | "paiement" | "comparaison" | "mdf";

export function CalcMultiViewsButeau({ mode = "full" }: { mode?: CalcMode } = {}) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [activeTab, setActiveTab] = useState<TabId>("paiement");
  const isPreview = mode === "preview";

  const tabs: Array<{ id: TabId; icon: typeof Wallet; label: string; hint: string }> = [
    {
      id: "capacite",
      icon: Wallet,
      label: isFr ? "Capacité d'emprunt" : "Borrowing capacity",
      hint: isFr ? "ABD / ATD" : "GDS / TDS",
    },
    {
      id: "paiement",
      icon: HomeIcon,
      label: isFr ? "Paiement mensuel" : "Monthly payment",
      hint: isFr ? "Formule canadienne" : "Canadian formula",
    },
    {
      id: "comparaison",
      icon: TrendingUp,
      label: isFr ? "Fixe vs variable" : "Fixed vs variable",
      hint: isFr ? "Sur 5 ans" : "Over 5 years",
    },
    {
      id: "mdf",
      icon: PiggyBank,
      label: isFr ? "Mise de fonds" : "Down payment",
      hint: isFr ? "+ frais clôture" : "+ closing costs",
    },
  ];

  return (
    <section
      id="calculateur"
      className={`relative overflow-hidden ${
        isPreview
          ? "py-20 md:py-24 surface-cream border-t border-[color:var(--color-taupe)]/20"
          : "py-24 md:py-32 surface-cream border-t border-[color:var(--color-taupe)]/20"
      }`}
    >
      {/* Filigrane $ XL */}
      <span
        aria-hidden="true"
        className="absolute -top-12 right-0 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/8 text-[22rem] leading-none pointer-events-none select-none"
      >
        $
      </span>

      <Container size="xl" className="relative">
        {/* Header signature — adapte au mode */}
        <div className={`max-w-3xl ${isPreview ? "mb-8 md:mb-10" : "mb-12 md:mb-16"}`}>
          <p className="eyebrow text-[color:var(--color-bronze-deep)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
            {isPreview
              ? isFr ? "Calculateur · Aperçu" : "Calculator · Preview"
              : isFr ? "Calculateur" : "Calculator"}
          </p>
          <h2
            className={`font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] uppercase tracking-[0.04em] leading-[1.05] mb-5 text-balance ${
              isPreview
                ? "text-[clamp(1.5rem,3vw,2.25rem)]"
                : "text-[clamp(1.875rem,4vw,3rem)]"
            }`}
          >
            {isFr ? "Vos chiffres, sans détour." : "Your numbers, no detour."}
          </h2>
          <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
          <p className="font-[var(--font-editorial)] italic text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/80 text-pretty">
            {isPreview
              ? isFr
                ? "Quatre vues du même dossier — capacité, paiement, stratégie de taux, liquidités. Faites bouger les chiffres, puis ouvrez le calculateur complet pour les graphiques et scénarios approfondis."
                : "Four views of the same file — capacity, payment, rate strategy, cash. Play with the numbers, then open the full calculator for charts and deeper scenarios."
              : isFr
                ? "Quatre vues du même dossier — capacité, paiement, stratégie de taux, liquidités à prévoir. Les résultats sont indicatifs ; votre dossier réel est validé par un courtier inscrit AMF."
                : "Four views of the same file — capacity, payment, rate strategy, cash to plan. Results are indicative; your real file is validated by an AMF-registered broker."}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-[color:var(--color-taupe)]/40 mb-10 md:mb-12 -mx-3 md:mx-0">
          <div className="flex gap-1 md:gap-2 overflow-x-auto px-3 md:px-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={active}
                  className={`group/tab flex-shrink-0 px-4 md:px-6 py-4 md:py-5 transition-all duration-300 border-b-2 -mb-px ${
                    active
                      ? "border-[color:var(--color-bronze)]"
                      : "border-transparent hover:border-[color:var(--color-bronze)]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2 : 1.5}
                      className={`transition-colors ${
                        active
                          ? "text-[color:var(--color-bronze-deep)]"
                          : "text-[color:var(--color-taupe-dark)] group-hover/tab:text-[color:var(--color-bronze-deep)]"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col items-start text-left">
                      <span
                        className={`font-[var(--font-display)] font-semibold uppercase tracking-[0.05em] text-[clamp(0.75rem,1.1vw,0.875rem)] whitespace-nowrap transition-colors ${
                          active
                            ? "text-[color:var(--color-navy-deep)]"
                            : "text-[color:var(--color-taupe-dark)] group-hover/tab:text-[color:var(--color-navy-deep)]"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`font-[var(--font-editorial)] italic text-[10px] md:text-xs transition-colors ${
                          active
                            ? "text-[color:var(--color-bronze-deep)]"
                            : "text-[color:var(--color-taupe)]/80"
                        }`}
                      >
                        {tab.hint}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tab content — key remount = fade animation */}
        <div key={activeTab} className="animate-[buteauFadeUp_500ms_ease-out_both]">
          {activeTab === "capacite" && <TabCapacite mode={mode} />}
          {activeTab === "paiement" && <TabPaiement mode={mode} />}
          {activeTab === "comparaison" && <TabComparaison mode={mode} />}
          {activeTab === "mdf" && <TabMiseDeFonds mode={mode} />}
        </div>

        {/* CTA Aperçu -> calculateur complet (mode preview uniquement) */}
        {isPreview && (
          <div className="mt-10 pt-8 border-t border-[color:var(--color-taupe)]/30 flex flex-col sm:flex-row items-baseline justify-between gap-y-4 gap-x-6">
            <p className="font-[var(--font-editorial)] italic text-sm text-[color:var(--color-taupe-dark)] leading-snug max-w-xl text-pretty">
              {isFr
                ? "Graphiques d'amortissement, sensibilité au taux, courbes fixe vs variable et comparaisons mise de fonds — disponibles dans le calculateur complet."
                : "Amortization charts, rate sensitivity, fixed vs variable curves and down payment comparisons — available in the full calculator."}
            </p>
            <HeartbeatCta>
              <Link
                to="/outils"
                hash="calculateur"
                className="group inline-flex items-center gap-2 px-6 py-3 border border-[color:var(--color-bronze)] text-[color:var(--color-bronze-deep)] hover:bg-[color:var(--color-bronze)] hover:text-[color:var(--color-cream)] hover:-translate-y-0.5 text-xs uppercase tracking-[0.22em] font-bold whitespace-nowrap transition-all duration-300"
              >
                <span>{isFr ? "Calculateur complet" : "Full calculator"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </Link>
            </HeartbeatCta>
          </div>
        )}

        {/* Footer note + AMF (mode full uniquement) */}
        {!isPreview && (
          <div className="mt-12 pt-6 border-t border-[color:var(--color-taupe)]/30 max-w-3xl">
            <p className="font-[var(--font-editorial)] italic text-xs text-[color:var(--color-taupe-dark)] leading-relaxed text-pretty hyphens-auto">
              {isFr
                ? "Outils indicatifs uniquement. Les conditions, taux, primes SCHL et frais varient selon votre dossier, la propriété, le prêteur et le moment du marché. L'Équipe Buteau opère sous le cabinet Planiprêt — courtage hypothécaire inscrit à l'AMF. Le service de courtage est gratuit pour l'acheteur."
                : "Indicative tools only. Conditions, rates, CMHC premiums and fees vary based on your file, the property, the lender and market timing. L'Équipe Buteau operates under Planiprêt — mortgage brokerage registered with AMF. Brokerage service is free for the buyer."}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
