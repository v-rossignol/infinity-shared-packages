import React from "react";

export interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export function Spinner({
  size = 24,
  color = "currentColor",
  label = "Loading…",
}: SpinnerProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      role="status"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx={12} cy={12} r={10} opacity={0.25} />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
