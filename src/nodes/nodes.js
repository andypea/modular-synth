import { default as Adsr } from "./Adsr";
import { default as Adsr2 } from "./Adsr2";
import { default as Osc } from "./Osc";
import { default as Amp } from "./Amp";
import { default as Vco } from "./Vco";
import { default as Vca } from "./Vca";
import { default as BiOsc } from "./BiOsc";
import { default as RNP } from "./RNP";
import { default as Clk } from "./Clk";
import { default as Seq } from "./Seq";
import { default as Gain } from "./Gain";

// TODO: Set the keys here, not in the modules?
export default new Map([
  [Adsr.key, Adsr],
  [Adsr2.key, Adsr2],
  [Osc.key, Osc],
  [Amp.key, Amp],
  [Vco.key, Vco],
  [Vca.key, Vca],
  [BiOsc.key, BiOsc],
  [RNP.key, RNP],
  [Clk.key, Clk],
  [Seq.key, Seq],
  [Gain.key, Gain],
]);
