import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      data-variant={variant}
      style={style}
    >
      {loading ? <span aria-label="Loading…">⏳</span> : icon}
      {children}
    </button>
  );
}
