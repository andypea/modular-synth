import { default as ExampleSimple } from "./ExampleSimple/ExampleSimple.Component";
import { default as ExampleComposite } from "./ExampleComposite/ExampleComposite.Component";
import { default as ExampleAudioWorklet } from "./ExampleAudioWorklet/ExampleAudioWorklet.Component";
import exampleWorkletProcessorUrl from "./ExampleAudioWorklet/ExampleAudioWorklet.Processor.js?url";
import { default as AudioOutput } from "./AudioOutput/AudioOutput.Component";

export const availableNodes = new Map([
  [ExampleSimple.key, ExampleSimple],
  [ExampleAudioWorklet.key, ExampleAudioWorklet],
  [ExampleComposite.key, ExampleComposite],
  [AudioOutput.key, AudioOutput],
]);

export async function addModules(context) {
  await context.audioWorklet
    .addModule(exampleWorkletProcessorUrl)
    .catch((reason) => console.error(reason));
}
