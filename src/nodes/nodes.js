//import { default as Adsr } from "./Adsr";
//import { default as Osc } from "./Osc";
//import { default as Vco } from "./Vco";
//import { default as Vca } from "./Vca";
//import { default as BiOsc } from "./BiOsc";
//import { default as RNP } from "./RNP";
//import { default as Clk } from "./Clk";
//import { default as DrumSequencer } from "./DrumSequencer";
//import { default as LeadSequencer } from "./LeadSequencer";
//import { default as Gain } from "./Gain";
//import { default as BiquadFilter } from "./BiquadFilter";
//import { default as ConstantSource } from "./ConstantSource";
//import { default as TunedConstantSource } from "./TunedConstantSource";
//import { default as TriggerButton } from "./TriggerButton";
//import { default as VoltToCents } from "./VoltToCents";
//import { default as Fader } from "./Fader";
//import { default as Mute } from "./Mute";
import { default as ExampleAudioWorklet } from "./ExampleAudioWorklet/ExampleAudioWorklet.Component";
import exampleWorkletProcessorUrl from "./ExampleAudioWorklet/ExampleAudioWorklet.Processor.js?url";
import { default as OscillatorNode } from "./WebAudioNodes/OscillatorNode.Component";
import { default as ExampleComposite } from "./CompositeAudioNode/ExampleComposite.Component";
import { default as AudioOutput } from "./AudioOutput/AudioOutput.Component";

// TODO: Set the keys here, not in the modules?
export const availableNodes = new Map([
  //  [Adsr.key, Adsr],
  //  [Osc.key, Osc],
  //  [Vco.key, Vco],
  //  [Vca.key, Vca],
  //  [BiOsc.key, BiOsc],
  //  [RNP.key, RNP],
  //  [Clk.key, Clk],
  //  [DrumSequencer.key, DrumSequencer],
  //  [LeadSequencer.key, LeadSequencer],
  //  [Gain.key, Gain],
  //  [BiquadFilter.key, BiquadFilter],
  //  [ConstantSource.key, ConstantSource],
  //  [TunedConstantSource.key, TunedConstantSource],
  //  [TriggerButton.key, TriggerButton],
  //  [VoltToCents.key, VoltToCents],
  //  [Fader.key, Fader],
  //  [Mute.key, Mute],
  [ExampleAudioWorklet.key, ExampleAudioWorklet],
  [ExampleComposite.key, ExampleComposite],
  [OscillatorNode.key, OscillatorNode],
  [AudioOutput.key, AudioOutput],
]);

export async function addModules(context) {
  await context.audioWorklet
    .addModule(exampleWorkletProcessorUrl)
    .catch((reason) => console.error(reason));
}
