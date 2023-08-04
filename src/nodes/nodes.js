import { default as Adsr } from "./Adsr";
import { default as Osc } from "./Osc";
import { default as Amp } from "./Amp";
import { default as Vco } from "./Vco";

export default new Map([
  [Adsr.key, Adsr],
  [Osc.key, Osc],
  [Amp.key, Amp],
  [Vco.key, Vco],
]);
