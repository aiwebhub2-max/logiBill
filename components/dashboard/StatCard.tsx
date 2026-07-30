
import { cn, formatFC } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: number;
  trendLabel?: string;
  glowColor?: string;
  suffix?: string;
  isCount?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendLabel,
  glowColor,
  suffix = " FC",
  isCount = false,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group",
        "bg-surface-card border-surface-border",
        "hover:border-opacity-60 hover:-translate-y-0.5 hover:shadow-card-hover",
        "animate-fade-in"
      )}
      style={
        glowColor
          ? ({
              "--glow-color": glowColor,
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            } as React.CSSProperties)
          : {}
      }
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: glowColor
            ? `radial-gradient(ellipse at top left, ${glowColor}15 0%, transparent 60%)`
            : undefined,
        }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={2} />
        </div>

        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative">
        <p className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">
          {isCount
            ? value.toString()
            : new Intl.NumberFormat("fr-CD").format(value) + suffix}
        </p>
        <p className="text-sm text-gray-500 font-medium">{title}</p>

        {trendLabel && (
          <p className="text-xs text-gray-600 mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
