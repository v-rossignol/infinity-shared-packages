import React from "react";

export interface PlayerAvatarProps {
  username: string;
  avatarUrl?: string;
  size?: number;
  level?: number;
}

export function PlayerAvatar({
  username,
  avatarUrl,
  size = 40,
  level,
}: PlayerAvatarProps): React.ReactElement {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      style={{ position: "relative", display: "inline-block", width: size, height: size }}
      title={username}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username}
          width={size}
          height={size}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "#4f8ef7",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.35,
            fontWeight: 700,
            userSelect: "none",
          }}
        >
          {initials}
        </div>
      )}
      {level !== undefined && (
        <span
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            background: "#141929",
            color: "#4f8ef7",
            borderRadius: "50%",
            fontSize: 10,
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            border: "1px solid #2a3454",
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
}
