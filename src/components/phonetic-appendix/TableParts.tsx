import React from "react";

export function TableCaption({ children }: { children: React.ReactNode }) {
  return (
    <caption className="caption-top px-2 py-3 text-left text-base font-extrabold text-[#24411a] sm:text-lg">
      {children}
    </caption>
  );
}

export function TableCell({
  children,
  header = false,
  emphasized = false,
  italic = false,
}: {
  children?: React.ReactNode;
  header?: boolean;
  emphasized?: boolean;
  italic?: boolean;
}) {
  const Tag = header ? "th" : "td";

  return (
    <Tag
      className={[
        "border border-[#b9cbae] px-3 py-2.5 text-left align-top",
        header ? "bg-[#edf6e6] font-extrabold text-[#2d4e21]" : "bg-white",
        emphasized ? "font-extrabold text-[#24411a]" : "",
        italic ? "italic" : "",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

export function TableFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#cfe0c5] bg-white shadow-sm">
      {children}
    </div>
  );
}
