import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setNote: (i) => (e) =>
    store.updateNode(id, { [`note${i}`]: +e.target.checked }),
});

function Node({ id, data }) {
  const { setNote } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <Handle className={tw("w-3 h-3")} type="target" position="top" />

      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Sequencer
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Notes</p>
        <div className={tw("flex")}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
            <input
              key={i}
              type="checkbox"
              checked={data[`note${i}`]}
              onChange={setNote(i)}
            />
          ))}
        </div>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}></label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "seq";
const name = "Sequencer";
function createAudioNode(context, data) {
  const node = new AudioWorkletNode(context, "sequencer");
  for (let i = 1; i <= 16; i++) {
    const parameterName = `note${i}`;
    node[parameterName] = node.parameters.get(parameterName);
    node[parameterName].value = data[parameterName];
  }
  return node;
}

const initialData = {
  note1: 1.0,
  note2: 0.0,
  note3: 0.0,
  note4: 0.0,
  note5: 0.0,
  note6: 0.0,
  note7: 0.0,
  note8: 0.0,
  note9: 0.0,
  note10: 0.0,
  note11: 0.0,
  note12: 0.0,
  note13: 0.0,
  note14: 0.0,
  note15: 0.0,
  note16: 0.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
