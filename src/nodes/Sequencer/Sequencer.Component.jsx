import React, { useState, useEffect } from "react";
import { Handle } from "../Utils/Handle";
import { useStore } from "../../store";
import { SequencerNode } from "./Sequencer.Node";
import { IndicatorLight } from "../Utils/IndicatorLight";
import { tw } from "twind";

// TODO: This is a horrible hack!
function getOldValue(store, id, parameter) {
  return store.nodes.find((n) => n.id === id).data[parameter];
}

const selector = (id) => (store) => ({
  setCV: (indexToChange) => (e) =>
    store.updateNode(id, {
      cv: getOldValue(store, id, "cv").map((oldValue, i) =>
        i === indexToChange ? +e.target.value : oldValue
      ),
    }),
  setGate: (indexToChange) => (e) =>
    store.updateNode(id, {
      gate: getOldValue(store, id, "gate").map((oldValue, i) =>
        i === indexToChange ? e.target.checked : oldValue
      ),
    }),
  setReTrigger: (indexToChange) => (e) =>
    store.updateNode(id, {
      reTrigger: getOldValue(store, id, "reTrigger").map((oldValue, i) =>
        i === indexToChange ? e.target.checked : oldValue
      ),
    }),
});

function Component({ id, data }) {
  const { setCV, setGate, setReTrigger } = useStore(selector(id));
  const [on, setOn] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);

  useEffect(() => {
    let frameId = null;

    function onFrame() {
      frameId = requestAnimationFrame(onFrame);
      setOn(data.audioNode.on);
      setCurrentNote(data.audioNode.currentNote);
    }

    function start() {
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    start();
    return () => stop();
  }, [data.audioNode.on, data.audioNode.currentNote]);

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-48")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Sequencer
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-2")}>
        <p className={tw("text-xs font-bold mb-2")}>Status</p>
        <div className={tw("m-auto")}>
          <IndicatorLight on={on} />
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Clock</p>
        <Handle type="target" position="bottom" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>CV | Gate | reTrigger</p>
        <datalist id="values">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <option key={i} value={i}></option>
          ))}
        </datalist>
        <div className={tw("flex flex-row")}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={tw("flex flex-col space-y-2")}>
              <input
                className="nodrag"
                orient="vertical"
                style={{
                  appearance: "slider-vertical",
                  accentColor: i === currentNote ? "red" : "black",
                  minWidth: 0,
                }}
                type="range"
                min={0}
                max={12}
                step={1}
                value={data.cv[i]}
                onChange={setCV(i)}
                list="values"
              />
              <input
                type="checkbox"
                style={{ accentColor: i === currentNote ? "red" : "black" }}
                checked={data.gate[i]}
                onChange={setGate(i)}
              />
              <input
                type="checkbox"
                style={{ accentColor: i === currentNote ? "red" : "black" }}
                checked={data.reTrigger[i]}
                onChange={setReTrigger(i)}
              />
            </div>
          ))}
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>CV</p>
        <Handle type="source" position="bottom" id="0" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Gate</p>
        <Handle type="source" position="bottom" id="1" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>reTrigger</p>
        <Handle type="source" position="bottom" id="2" />
      </label>
    </div>
  );
}

const key = "sequencer";
const name = "Sequencer";

function createAudioNode(context, data) {
  return new SequencerNode(context, data);
}

const initialData = {
  cv: [0, 0, 0, 0, 0, 0, 0, 0],
  gate: [false, true, false, false, false, false, false, false],
  reTrigger: [false, false, true, false, false, false, false, false],
};

export default {
  node: Component,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
