import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";
import { default as VcoNode } from "./Vco.Node";

const selector = (id) => (store) => ({
  setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
  setFmGain: (e) => store.updateNode(id, { fmGain: +e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setFmGain } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        VCO
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Frequency (base)</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="440.0"
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
        <p className={tw("text-xs font-bold mb-2")}>Frequency Modulation</p>
        <Handle type="target" position="bottom" id="fm" />
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>FM Gain</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="100.0"
          step="any"
          value={data.fmGain}
          onChange={setFmGain}
        />
        <p className={tw("text-right text-xs")}>
          {data.fmGain.toFixed(0)} cent/V
        </p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "vco";
const name = "VCO";

function createAudioNode(context, data) {
  const node = new VcoNode(context, data);

  return node;
}

const initialData = {
  frequency: 261.625565,
  fmGain: 100.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
