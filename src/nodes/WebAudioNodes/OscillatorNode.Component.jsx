import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../../store";

// TODO: Add support for setPeriodicWave.

const selector = (id) => (store) => ({
  setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
  setDetune: (e) => store.updateNode(id, { detune: +e.target.value }),
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setDetune, setType } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        OscillatorNode
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>type</p>
        <select className="nodrag" value={data.type} onChange={setType}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
        </select>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>frequency</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="880.0"
          step="any"
          value={data.frequency}
          onChange={setFrequency}
        />
        <p className={tw("text-right text-xs")}>
          {data.frequency.toFixed(0)} Hz
        </p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>detune</p>
        <input
          className="nodrag"
          type="range"
          min="-1200.0"
          max="1200.0"
          step="any"
          value={data.detune}
          onChange={setDetune}
        />
        <p className={tw("text-right text-xs")}>
          {data.detune.toFixed(0)} cents
        </p>
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "oscillatorNode";
const name = "OscillatorNode";

function createAudioNode(context, data) {
  const node = new OscillatorNode(context, data);
  node.start();

  return node;
}

const initialData = {
  type: "sine",
  detune: 0,
  frequency: 440,
  periodicWave: undefined,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
