import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";

// TODO: Add support for setPeriodicWave.
// TODO: Support proper handle layouts.

const selector = (id) => (store) => ({
  setGain: (e) => store.updateNode(id, { gain: +e.target.value }),
});

function Node({ id, data }) {
  const { setGain } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        VCA
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input</p>
        <div className={tw("place-self-center")}>
          <Handle type="target" position="bottom" />
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Gain</p>
        <div className={tw("place-self-center")}>
          <Handle type="target" position="bottom" id="gain" />
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <div className={tw("place-self-center")}>
          <Handle type="source" position="bottom" />
        </div>
      </label>
    </div>
  );
}

const key = "vca";
const name = "VCA";

function createAudioNode(context, data) {
  const node = new GainNode(context, data);

  return node;
}

const initialData = {
  gain: 0.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
