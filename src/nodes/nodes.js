import { default as ExampleSimple } from "./ExampleSimple/ExampleSimple.Component";
import { default as ExampleComposite } from "./ExampleComposite/ExampleComposite.Component";
import { default as ExampleAudioWorklet } from "./ExampleAudioWorklet/ExampleAudioWorklet.Component";
import exampleWorkletProcessorUrl from "./ExampleAudioWorklet/ExampleAudioWorklet.Processor.js?url";
import { default as AudioOutput } from "./AudioOutput/AudioOutput.Component";
import { default as Adsr } from "./Adsr/Adsr.Component";
import adsrProcessorUrl from "./Adsr/Adsr.Processor.js?url";

export const availableNodes = new Map([
  [ExampleSimple.key, ExampleSimple],
  [ExampleAudioWorklet.key, ExampleAudioWorklet],
  [ExampleComposite.key, ExampleComposite],
  [AudioOutput.key, AudioOutput],
  [Adsr.key, Adsr],
]);

export async function addModules(context) {
  await Promise.all([
    context.audioWorklet.addModule(exampleWorkletProcessorUrl),
    context.audioWorklet.addModule(adsrProcessorUrl),
  ]).catch((reason) => console.error(reason));
}
