import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TerraScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function TerraScore({ score, size = "md", showLabel = true }: TerraScoreProps) {
  const getColor = () => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 50) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getTextColor = () => {
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
  const radius = size === "sm" ? 16 : size === "lg" ? 36 : 24;
  const svgSize = (radius + 4) * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const strokeWidth = size === "sm" ? 3 : size === "lg" ? 5 : 4;
  const fontSize = size === "sm" ? 10 : size === "lg" ? 18 : 13;

  const gauge = (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={dims}
    >
      {/* Background ring */}
      <circle
        cx={svgSize / 2} cy={svgSize / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeOpacity="0.12" className={getTextColor()}
      />
      {/* Score ring */}
      <circle
        cx={svgSize / 2} cy={svgSize / 2} r={radius}
        fill="none" stroke={getColor()} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
      {/* Score text */}
      <text
        x={svgSize / 2} y={svgSize / 2}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={fontSize} fontWeight="bold"
        fill={getColor()}
      >
        {score}
      </text>
    </svg>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-help">
          {gauge}
          {showLabel && (
            <div>
              <p className={`text-xs font-semibold ${getTextColor()}`}>
                {getEmoji()} TerraScore
              </p>
              <p className="text-xs text-muted-foreground">{getLabel()}</p>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="font-semibold text-sm mb-1">TerraScore™ {score}/100</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>📍 <span className="font-medium text-foreground">Location</span> — proximity to amenities, infrastructure</p>
          <p>💰 <span className="font-medium text-foreground">Value</span> — price vs market comparables</p>
          <p>📈 <span className="font-medium text-foreground">Growth</span> — area appreciation potential</p>
          <p>⚠️ <span className="font-medium text-foreground">Risk</span> — market volatility, legal status</p>
          <p>🔄 <span className="font-medium text-foreground">Liquidity</span> — ease of resale</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
