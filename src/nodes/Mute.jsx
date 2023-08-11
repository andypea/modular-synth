import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setGain: (e) => store.updateNode(id, { gain: +e.target.checked ? 0.0 : 1.0 }),
});

function Node({ id, data }) {
  const { setGain } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Mute
      </p>

      <label className={tw("flex flex-col px-2 py-1 pb-3")}>
        <input
          className="nodrag"
          type="checkbox"
          checked={data.gain === 0.0}
          onChange={setGain}
        />
      </label>

      <Handle className={tw("w-3 h-3")} type="target" position="top" />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "mute";
const name = "Mute";
function createAudioNode(context, data) {
  const node = context.createGain();
  node.gain.value = data.gain;

  return node;
}

const initialData = { gain: 1.0 };

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
