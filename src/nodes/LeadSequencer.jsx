import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const numRows = 2;
const numNotes = 32;

const selector = (id) => (store) => ({
  setNote: (i) => (e) =>
    store.updateNode(id, { [`note${i}`]: +e.target.value }),
});

function Node({ id, data }) {
  const { setNote } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <Handle className={tw("w-3 h-3")} type="target" position="top" />

      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Lead Sequencer
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
                    style={{
                      appearance: "slider-vertical",
                      accentColor: j === data.currentNote ? "red" : "black",
                    }}
                    className="nodrag"
                    orient="vertical"
                    key={j}
                    min={0}
                    max={1200}
                    step={100}
                    type="range"
                    value={data[`note${j}`]}
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

const key = "leadSequencer";
const name = "Lead Sequencer";
function createAudioNode(context, data, id) {
  const node = new AudioWorkletNode(context, "sequencer32", { hold: true });
  for (let i = 1; i <= numNotes; i++) {
    const parameterName = `note${i}`;
    node[parameterName] = node.parameters.get(parameterName);
    node[parameterName].value = data[parameterName];
  }
  node.currentNote = 1;
  node.port.onmessage = (message) => {
    useStore.getState().updateNode(id, { currentNote: message.data });
  };

  return node;
}

const initialData = {
  currentNote: 1,
};

for (let i = 1; i <= numNotes; i++) {
  initialData[`note${i}`] = 1;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
