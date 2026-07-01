export const theme = {
  colors: {
    primary: "#4f8ef7",
    primaryDark: "#2d6ed4",
    danger: "#e53935",
    warning: "#fb8c00",
    success: "#43a047",
    background: "#0a0e1a",
    surface: "#141929",
    surfaceAlt: "#1e2640",
    border: "#2a3454",
    textPrimary: "#e8ecf4",
    textSecondary: "#8a95b5",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    fontSizeSm: "12px",
    fontSizeMd: "14px",
    fontSizeLg: "16px",
    fontSizeXl: "20px",
    fontSizeHeading: "24px",
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  animation: {
    durationFast: "150ms",
    durationDefault: "200ms",
    durationSlow: "400ms",
    easing: "ease-in-out",
  },
} as const;

export type Theme = typeof theme;
