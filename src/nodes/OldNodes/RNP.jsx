import { Handle } from "reactflow";
import { tw } from "twind";

// Note: Uses the AudioWorkletNode defined in:
//  public/audioWorkletProcessors/random-noise-processor.js
function Node({ id, data }) {
  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Random Noise Processor
      </p>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "rnp";
const name = "Random Noise Processor";
function createAudioNode(context, data) {
  const node = new AudioWorkletNode(context, "random-noise-processor");
  return node;
}

const initialData = {};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
