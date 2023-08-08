import { default as Adsr } from "./Adsr";
import { default as Osc } from "./Osc";
import { default as Vco } from "./Vco";
import { default as Vca } from "./Vca";
import { default as BiOsc } from "./BiOsc";
import { default as RNP } from "./RNP";
import { default as Clk } from "./Clk";
import { default as DrumSequencer } from "./DrumSequencer";
import { default as LeadSequencer } from "./LeadSequencer";
import { default as Gain } from "./Gain";
import { default as BiquadFilter } from "./BiquadFilter";
import { default as ConstantSource } from "./ConstantSource";
import { default as TriggerButton } from "./TriggerButton";

// TODO: Set the keys here, not in the modules?
export default new Map([
  [Adsr.key, Adsr],
  [Osc.key, Osc],
  [Vco.key, Vco],
  [Vca.key, Vca],
  [BiOsc.key, BiOsc],
  [RNP.key, RNP],
  [Clk.key, Clk],
  [DrumSequencer.key, DrumSequencer],
  [LeadSequencer.key, LeadSequencer],
  [Gain.key, Gain],
  [BiquadFilter.key, BiquadFilter],
  [ConstantSource.key, ConstantSource],
  [TriggerButton.key, TriggerButton],
]);
