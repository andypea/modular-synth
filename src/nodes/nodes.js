// import { default as ExampleSimple } from "./ExampleSimple/ExampleSimple.Component";
// import { default as ExampleComposite } from "./ExampleComposite/ExampleComposite.Component";
// import { default as ExampleAudioWorklet } from "./ExampleAudioWorklet/ExampleAudioWorklet.Component";
// import exampleWorkletProcessorUrl from "./ExampleAudioWorklet/ExampleAudioWorklet.Processor.js?url";
import { default as AudioOutput } from "./AudioOutput/AudioOutput.Component";
import { default as Adsr } from "./Adsr/Adsr.Component";
import adsrProcessorUrl from "./Adsr/Adsr.Processor.js?url";
import { default as GateButton } from "./GateButton/GateButton.Component";
import { default as Vca } from "./Vca/Vca.Component";
import { default as Vco } from "./Vco/Vco.Component";
import { default as Lfo } from "./Vco/Lfo.Component";
import { default as Keyboard } from "./Keyboard/Keyboard.Component";
import { default as Reverb } from "./Reverb/Reverb.Component";
import { default as Mixer } from "./Mixer/Mixer.Component";
import { default as Clock } from "./Clock/Clock.Component";
import { default as Sequencer } from "./Sequencer/Sequencer.Component";
import sequencerProcessorUrl from "./Sequencer/Sequencer.Processor.js?url";

export const availableNodes = new Map([
  //  [ExampleSimple.key, ExampleSimple],
  //  [ExampleAudioWorklet.key, ExampleAudioWorklet],
  //  [ExampleComposite.key, ExampleComposite],
  [AudioOutput.key, AudioOutput],
  [Adsr.key, Adsr],
  [GateButton.key, GateButton],
  [Vca.key, Vca],
  [Vco.key, Vco],
  [Lfo.key, Lfo],
  [Keyboard.key, Keyboard],
  [Reverb.key, Reverb],
  [Mixer.key, Mixer],
  [Clock.key, Clock],
  [Sequencer.key, Sequencer],
]);

export async function addModules(context) {
  await Promise.all([
    //    context.audioWorklet.addModule(exampleWorkletProcessorUrl),
    context.audioWorklet.addModule(adsrProcessorUrl),
    context.audioWorklet.addModule(sequencerProcessorUrl),
  ]).catch((reason) => console.error(reason));
}
