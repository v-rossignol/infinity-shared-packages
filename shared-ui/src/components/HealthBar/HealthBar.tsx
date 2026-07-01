import React from "react";

export interface HealthBarProps {
  current: number;
  max: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
}

export function HealthBar({
  current,
  max,
  color = "#43a047",
  backgroundColor = "#1e2640",
  height = 8,
  showLabel = false,
}: HealthBarProps): React.ReactElement {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div role="meter" aria-valuenow={current} aria-valuemax={max} aria-valuemin={0}>
      <div
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: color,
            borderRadius: height / 2,
            transition: "width 300ms ease-in-out",
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 12 }}>
          {current} / {max}
        </span>
      )}
    </div>
  );
}
