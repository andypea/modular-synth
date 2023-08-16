import { tw } from "twind";

export function IndicatorLight({ on = true } = {}) {
  return (
    <div
      className={tw(
        `w-3 h-3 rounded-full border-1 ${on ? "bg-yellow-300" : "bg-gray-100"}`
      )}
    />
  );
}
