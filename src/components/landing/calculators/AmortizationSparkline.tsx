import { useMemo } from "react";

/**
 * Sparkline amortization — visualisation live de la répartition capital vs intérêts
 * sur la durée du prêt. Chaque point représente le solde restant à un mois donné.
 *
 * Pourquoi NOVEL : aucun calculator hypothécaire concurrent ne montre la courbe
 * en temps réel. Buteau démontre la transparence ("voici exactement ce que vous payez")
 * via cette dataviz luxury Wall Street Journal-style.
 *
 * Format SVG inline — pas de lib chart (perf + bundle).
 */
type AmortizationSparklineProps = {
  principal: number;
  monthlyPayment: number;
  monthlyRate: number;
  numberOfPayments: number;
};

export function AmortizationSparkline({
  principal,
  monthlyPayment,
  monthlyRate,
  numberOfPayments,
}: AmortizationSparklineProps) {
  // Calcule la trajectoire du solde restant + la part interest cumulative
  const data = useMemo(() => {
    if (principal <= 0 || numberOfPayments <= 0 || !Number.isFinite(monthlyPayment)) {
      return null;
    }
    const points: Array<{ month: number; balance: number; interestPaid: number; principalPaid: number }> = [];
    let balance = principal;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    // On échantillonne 60 points max pour SVG smooth (au lieu de 300+ pts pour 25 ans)
    const step = Math.max(1, Math.floor(numberOfPayments / 60));

    for (let m = 0; m <= numberOfPayments; m += step) {
      points.push({
        month: m,
        balance: Math.max(0, balance),
        interestPaid: cumulativeInterest,
        principalPaid: cumulativePrincipal,
      });
      // Avance step mois
      for (let i = 0; i < step && balance > 0; i++) {
        const interestPart = balance * monthlyRate;
        const principalPart = Math.max(0, monthlyPayment - interestPart);
        balance -= principalPart;
        cumulativeInterest += interestPart;
        cumulativePrincipal += principalPart;
      }
    }
    // S'assure que le dernier point est exactement à numberOfPayments
    if (points[points.length - 1]?.month !== numberOfPayments) {
      points.push({
        month: numberOfPayments,
        balance: 0,
        interestPaid: cumulativeInterest,
        principalPaid: cumulativePrincipal,
      });
    }
    return { points, totalInterest: cumulativeInterest };
  }, [principal, monthlyPayment, monthlyRate, numberOfPayments]);

  if (!data || data.points.length < 2) return null;

  // Build SVG paths : balance (capital restant) + interest cumulative
  const W = 320;
  const H = 80;
  const PADDING = 4;
  const innerW = W - PADDING * 2;
  const innerH = H - PADDING * 2;
  const xMax = data.points[data.points.length - 1].month || 1;
  const yMax = principal;

  const xy = (m: number, v: number) => ({
    x: PADDING + (m / xMax) * innerW,
    y: PADDING + innerH - (v / yMax) * innerH,
  });

  // Path balance (decreasing curve)
  const balancePath = data.points
    .map((p, i) => {
      const { x, y } = xy(p.month, p.balance);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  // Path interest cumulative (increasing curve)
  const interestPath = data.points
    .map((p, i) => {
      const { x, y } = xy(p.month, principal - p.interestPaid);
      // Inverse Y for cumulative (start high, decrease as it grows)
      const yInv = PADDING + innerH - (p.interestPaid / yMax) * innerH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${yInv.toFixed(1)}`;
    })
    .join(" ");

  // Aire balance (gradient bronze fade)
  const balanceArea = `${balancePath} L ${PADDING + innerW} ${PADDING + innerH} L ${PADDING} ${PADDING + innerH} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto block"
      role="img"
      aria-label="Courbe d'amortissement — capital restant vs intérêts cumulés"
    >
      <defs>
        <linearGradient id="amort-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.722 0.018 84)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="oklch(0.722 0.018 84)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Aire capital remaining (bronze fade) */}
      <path d={balanceArea} fill="url(#amort-area)" />

      {/* Ligne capital remaining (bronze) */}
      <path
        d={balancePath}
        fill="none"
        stroke="oklch(0.722 0.018 84)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ligne intérêts cumulés (taupe pointillée) */}
      <path
        d={interestPath}
        fill="none"
        stroke="oklch(0.722 0.018 84 / 0.8)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 3"
      />

      {/* Légende inline subtile */}
      <text
        x={PADDING + 2}
        y={PADDING + 9}
        fontSize="7"
        fill="oklch(0.585 0.020 84)"
        fontFamily="Open Sans, system-ui"
        textAnchor="start"
      >
        Capital restant
      </text>
      <text
        x={W - PADDING - 2}
        y={PADDING + innerH - 2}
        fontSize="7"
        fill="oklch(0.585 0.020 84)"
        fontFamily="Open Sans, system-ui"
        textAnchor="end"
      >
        Intérêts cumulés
      </text>
    </svg>
  );
}
