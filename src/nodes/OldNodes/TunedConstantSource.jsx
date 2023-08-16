import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

// TODO: Fix max and min so decimals can be typed.

const selector = (id) => (store) => ({
  setNote: (e) => store.updateNode(id, { note: +e.target.value }),
});

function Node({ id, data }) {
  const { setNote } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Tuned Constant Source
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Note</p>
        <input
          className="nodrag"
          type="range"
          min={1}
          max={13}
          step={1}
          value={data.note}
          onChange={setNote}
        />
        <p className={tw("text-right text-xs")}>{data.note}</p>
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "tunedConstantSource";
const name = "Tuned Constant Source";
function createAudioNode(context, data) {
  const node = context.createConstantSource();
  node.offset.value = 100 * (data.note - 1);
  node.start();

  Object.defineProperty(node, "note", {
    set(value) {
      node.offset.value = 100 * (value - 1);
    },
  });

  return node;
}

const initialData = { note: 1 };

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
