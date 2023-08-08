import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setType } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Biquad Filter
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Frequency</p>
        <input
          className="nodrag"
          type="range"
          min="10"
          max="1000"
          value={data.frequency}
          onChange={setFrequency}
        />
        <p className={tw("text-right text-xs")}>{data.frequency} Hz</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Type</p>
        <select className="nodrag" value={data.type} onChange={setType}>
          <option value="lowpass">lowpass</option>
          <option value="highpass">highpass</option>
          <option value="bandpass">bandpass</option>
          <option value="lowshelf">lowshelf</option>
          <option value="highshelf">highshelf</option>
          <option value="peaking">peaking</option>
          <option value="notch">notch</option>
          <option value="allpass">allpass</option>
        </select>
      </label>

      <Handle className={tw("w-3 h-3")} type="target" position="top" />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "bqf";
const name = "Biquad Filter";
function createAudioNode(context, data) {
  const node = context.createBiquadFilter();
  node.frequency.value = data.frequency;
  node.detune.value = data.detune;
  node.Q.value = data.Q;
  node.gain.value = data.gain;
  node.type = "lowpass";

  return node;
}

const initialData = {
  frequency: 350,
  detune: 0.0,
  Q: 1.0,
  gain: 0,
  type: "lowpass",
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
