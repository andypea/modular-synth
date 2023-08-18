import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";
import { default as MixerNode } from "./Mixer.Node";

const selector = (id) => (store) => ({
  setLevels: (e) => store.updateNode(id, { levels: +e.target.value }),
});

function Node({ id, data }) {
  const { setLevels } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Mixer
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input 0</p>
        <Handle type="target" position="bottom" id="0" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input 1</p>
        <Handle type="target" position="bottom" id="1" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Levels</p>
        <input
          className="nodrag"
          type="range"
          min={0.0}
          max={1.0}
          step="any"
          value={data.levels}
          onChange={setLevels}
        />
        <p className={tw("text-right text-xs")}>{data.levels.toFixed(3)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "mixer";
const name = "Mixer";

function createAudioNode(context, data) {
  const node = new MixerNode(context, data);

  return node;
}

const initialData = {
  levels: 0.5,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
