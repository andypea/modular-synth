import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const numRows = 4;
const numNotes = 64;

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
        Drum Sequencer
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Notes</p>
        <div className={tw("flex flex-col")}>
          {[...Array(numRows).keys()].map((i) => (
            <div key={i}>
              {[...Array(numNotes / numRows).keys()]
                .map((j) => (i * numNotes) / numRows + j + 1)
                .map((j) => (
                  <input
                    key={j}
                    type="checkbox"
                    checked={data[`note${j}`]}
                    onChange={setNote(j)}
                  />
                ))}
            </div>
          ))}
        </div>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}></label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "drumSequencer";
const name = "Drum Sequencer";
function createAudioNode(context, data) {
  const node = new AudioWorkletNode(context, "sequencer64");
  for (let i = 1; i <= numNotes; i++) {
    const parameterName = `note${i}`;
    node[parameterName] = node.parameters.get(parameterName);
    node[parameterName].value = data[parameterName];
  }
  return node;
}

const initialData = {};

for (let i = 1; i <= numNotes; i++) {
  initialData[`note${i}`] = 0.0;
}

initialData["note1"] = 1.0;

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
