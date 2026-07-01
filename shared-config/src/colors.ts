export const colors = {
  primary: "#4f8ef7",
  primaryDark: "#2d6ed4",
  primaryLight: "#82b1ff",

  danger: "#e53935",
  warning: "#fb8c00",
  success: "#43a047",
  info: "#039be5",

  background: "#0a0e1a",
  surface: "#141929",
  surfaceAlt: "#1e2640",
  border: "#2a3454",

  textPrimary: "#e8ecf4",
  textSecondary: "#8a95b5",
  textMuted: "#4a5270",

  rarityCommon: "#9e9e9e",
  rarityUncommon: "#66bb6a",
  rarityRare: "#42a5f5",
  rarityEpic: "#ab47bc",
  rarityLegendary: "#ffa726",
} as const;

export type ColorKey = keyof typeof colors;
