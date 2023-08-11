import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const numRows = 2;
const numNotes = 32;

const leftHandleStyle = { left: "10%" };
const rightHandleStyle = { left: "90%" };

const selector = (id) => (store) => ({
  setNote: (i) => (e) =>
    store.updateNode(id, { [`note${i}`]: +e.target.value }),
});

function Node({ id, data }) {
  const { setNote } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
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
                      height: "8em",
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
                    list="markers"
                  />
                ))}
            </div>
          ))}
        </div>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}></label>

      <Handle
        className={tw("w-3 h-3")}
        type="target"
        position="top"
        id="clock"
        style={leftHandleStyle}
      />
      <Handle
        className={tw("w-3 h-3")}
        type="target"
        position="top"
        id="reset"
        style={rightHandleStyle}
      />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
      <datalist id="markers">
        <option value="0"></option>
        <option value="100"></option>
        <option value="200"></option>
        <option value="300"></option>
        <option value="400"></option>
        <option value="500"></option>
        <option value="600"></option>
        <option value="700"></option>
        <option value="800"></option>
        <option value="900"></option>
        <option value="1000"></option>
        <option value="1100"></option>
        <option value="1200"></option>
      </datalist>
    </div>
  );
}

const key = "leadSequencer";
const name = "Lead Sequencer";
function createAudioNode(context, data, id) {
  const node = new AudioWorkletNode(context, "sequencer32", {
    numberOfInputs: 2,
    hold: true,
  });
  for (let i = 1; i <= numNotes; i++) {
    const parameterName = `note${i}`;
    node[parameterName] = node.parameters.get(parameterName);
    node[parameterName].value = data[parameterName];
  }
  node.port.onmessage = (message) => {
    useStore.getState().updateNode(id, { currentNote: message.data });
  };
  node.clock = new GainNode(context);
  node.clock.connect(node, 0, 0);
  node.reset = new GainNode(context);
  node.reset.connect(node, 0, 1);

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
