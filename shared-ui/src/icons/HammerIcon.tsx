import React from "react";

export function HammerIcon(props: React.SVGProps<SVGSVGElement>): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M15.5 2.5a2.12 2.12 0 0 1 3 3L9.5 14.5 7 15l.5-2.5L15.5 2.5zm-2 2 1.5 1.5-1.06 1.06-1.5-1.5L13.5 4.5zM4 18.5 5.5 20l3.5-3.5-1.5-1.5L4 18.5zm14.5-9.5 1.5 1.5-6 6-1.5-1.5 6-6zM3 21h8v-2H5v-4H3v6z" />
    </svg>
  );
}
