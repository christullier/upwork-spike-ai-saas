import { Compass } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-7 w-7 rounded-lg" : "h-9 w-9 rounded-xl";
  const icon = size === "sm" ? 15 : 19;
  return (
    <span className={`${box} inline-flex items-center justify-center bg-indigo-600 text-white shadow-sm shadow-indigo-600/30`}>
      <Compass size={icon} strokeWidth={2.2} />
    </span>
  );
}
