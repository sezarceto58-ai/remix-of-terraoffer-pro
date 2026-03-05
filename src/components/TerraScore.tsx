import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TerraScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const scoringFactors = [
  { label: "Location", desc: "Proximity to amenities & infrastructure" },
  { label: "Value", desc: "Price vs. market comparables" },
  { label: "Growth", desc: "Area appreciation potential" },
  { label: "Risk", desc: "Legal, zoning & market risk" },
  { label: "Liquidity", desc: "Ease of resale in this market" },
];

export default function TerraScore({ score, size = "md", showLabel = true }: TerraScoreProps) {
  const getColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getLabel = () => {
    if (score >= 80) return "High Investment";
    if (score >= 50) return "Moderate";
    return "Low Score";
  };

  const getEmoji = () => {
    if (score >= 80) return "🟢";
    if (score >= 50) return "🟡";
    return "🔴";
  };

  const dims = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-20 h-20" : "w-14 h-14";
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const fontSize = size === "sm" ? 26 : size === "lg" ? 20 : 22;
  const strokeWidth = size === "sm" ? 10 : 8;

  const gauge = (
    <svg viewBox="0 0 100 100" className={`${dims} ${getColor()}`}>
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeOpacity="0.1" />
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }} />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
        className="font-bold" fontSize={fontSize} fill="currentColor">{score}</text>
    </svg>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-help">
          {gauge}
          {showLabel && (
            <div>
              <p className={`text-xs font-semibold ${getColor()}`}>
                {getEmoji()} TerraScore
              </p>
              <p className="text-xs text-muted-foreground">{getLabel()}</p>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3">
        <p className="text-xs font-semibold mb-2">TerraScore™ — 5 Factors</p>
        <ul className="space-y-1">
          {scoringFactors.map((f) => (
            <li key={f.label} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{f.label}:</span> {f.desc}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
