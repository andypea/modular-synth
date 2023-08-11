import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

// TODO: Fix max and min so decimals can be typed.

const selector = (id) => (store) => ({
  setOffset: (e) => store.updateNode(id, { offset: +e.target.value }),
  setMin: (e) => store.updateNode(id, { min: +e.target.value }),
  setMax: (e) => store.updateNode(id, { max: +e.target.value }),
});

function Node({ id, data }) {
  const { setOffset, setMin, setMax } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Constant Source
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Offset</p>
        <input
          className="nodrag"
          type="range"
          min={data.min}
          max={data.max}
          step="any"
          value={data.offset}
          onChange={setOffset}
        />
        <p className={tw("text-right text-xs")}>{data.offset}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Min</p>
        <input
          className="nodrag"
          type="number"
          step={0.1}
          value={data.min}
          onChange={setMin}
        />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Max</p>
        <input
          className="nodrag"
          type="number"
          step={0.1}
          precision={2}
          value={data.max}
          onChange={setMax}
        />
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "constantSource";
const name = "Constant Source";
function createAudioNode(context, data) {
  const node = context.createConstantSource();
  node.offset.value = data.offset;
  node.start();

  return node;
}

const initialData = { offset: 0.0, min: -1.0, max: 1.0 };

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
