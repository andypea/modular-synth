import React from "react";
import { tw } from "twind";
import { useStore } from "../../store";

const selector = (id) => (store) => ({
  setText: (e) => store.updateNode(id, { text: e.target.value }),
});

function Node({ id, data }) {
  const { setText } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-64")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Text
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Note</p>
        <textarea
          className={tw("nodrag border-1")}
          value={data.text}
          onChange={setText}
        />
      </label>
    </div>
  );
}

const key = "text";
const name = "Text";

function createAudioNode(context, data) {
  // TODO: THis is an ugly hack.
  const node = new GainNode(context);

  return node;
}

const initialData = {
  text: "Hello world!",
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
