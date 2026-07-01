import React from "react";
import { theme } from "../../theme";

const FILL_COLORS = {
  low: "#6bcf7f",
  medium: "#e6c547",
  high: "#ff6b6b",
} as const;

const containerStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.xs}`,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.xs,
  fontSize: theme.typography.fontSizeSm,
  color: theme.colors.textSecondary,
};

const labelStyle: React.CSSProperties = {
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const valueStyle: React.CSSProperties = {
  color: theme.colors.textPrimary,
  fontVariantNumeric: "tabular-nums",
};

const trackStyle: React.CSSProperties = {
  height: "0.5rem",
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.colors.surfaceAlt,
  border: `1px solid ${theme.colors.border}`,
  overflow: "hidden",
};

const fillBaseStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: theme.borderRadius.sm,
  transition: `width ${theme.animation.durationDefault} ease, background-color ${theme.animation.durationDefault} ease`,
};

function getFillColor(fillPercent: number): string {
  if (fillPercent > 75) {
    return FILL_COLORS.high;
  }

  if (fillPercent >= 50) {
    return FILL_COLORS.medium;
  }

  return FILL_COLORS.low;
}

export interface CargoGaugeProps {
  capacity: number;
  used: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CargoGauge({
  capacity,
  used,
  className,
  style,
}: CargoGaugeProps): React.ReactElement {
  const clampedUsed = Math.max(0, used);
  const fillPercent = capacity > 0 ? Math.min(100, (clampedUsed / capacity) * 100) : 0;
  const fillColor = getFillColor(fillPercent);

  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <div style={headerStyle}>
        <span style={labelStyle}>Cargo</span>
        <span style={valueStyle}>
          {clampedUsed} / {capacity}
        </span>
      </div>
      <div
        style={trackStyle}
        role="progressbar"
        aria-label="Cargo space used"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={Math.min(clampedUsed, capacity)}
      >
        <div style={{ ...fillBaseStyle, width: `${fillPercent}%`, backgroundColor: fillColor }} />
      </div>
    </div>
  );
}
