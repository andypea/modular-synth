import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setOffset: (offset) => () => store.updateNode(id, { offset: offset }),
});

function Node({ id, data }) {
  const { setOffset } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
      >
        Trigger Button
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

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

function createAudioNode(context, data) {
  const node = context.createConstantSource();
  node.offset.value = data.offset;
  node.start();

  return node;
}

const initialData = {
  offset: 0.0,
};

const key = "triggerButton";

const name = "Trigger Button";

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
