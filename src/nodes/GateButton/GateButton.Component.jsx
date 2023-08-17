import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";

const selector = (id) => (store) => ({
  setOffset: (offset) => () => store.updateNode(id, { offset: offset }),
});

function Node({ id, data }) {
  const { setOffset } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Gate Button
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <input
          className="nodrag"
          type="button"
          value="Trigger"
          onPointerDown={setOffset(1.0)}
          onPointerUp={setOffset(0.0)}
        />
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

const key = "gateButton";
const name = "Gate Button";

function createAudioNode(context, data) {
  const node = new ConstantSourceNode(context, data);
  node.start();
  return node;
}

const initialData = {
  offset: 0.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
