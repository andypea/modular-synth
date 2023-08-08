import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setType } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        VCO
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Waveform</p>
        <select className="nodrag" value={data.type} onChange={setType}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
        </select>
      </label>

      <Handle
        className={tw("w-3 h-3")}
        type="target"
        position="top"
        id="frequencyInput"
      />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "vco";
const name = "VCO";

const initialData = { type: "sine" };

function createAudioNode(context, data) {
  const node = context.createOscillator();
  node.type = data.type;
  node.start();

  const frequencyInput = context.createGain();
  frequencyInput.gain.value = 440.0;
  frequencyInput.connect(node.frequency);
  node.frequencyInput = frequencyInput;

  node.frequency.value = 0.0;

  return node;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
