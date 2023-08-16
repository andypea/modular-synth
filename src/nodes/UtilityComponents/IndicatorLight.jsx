import { tw } from "twind";

export function IndicatorLight({ on = true } = {}) {
  //return <p>{on ? "On" : "Off"}</p>;
  let className = " indicator-light";
  className += on ? " on" : " off";
  return <div className={tw("w-3 h-3") + className}></div>;
}
