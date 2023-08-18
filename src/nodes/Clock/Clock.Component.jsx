import React, { useState, useEffect } from "react";
import { Handle } from "../Utils/Handle";
import { useStore } from "../../store";
import { ClockNode } from "./Clock.Node";
import { IndicatorLight } from "../Utils/IndicatorLight";
import { tw } from "twind";

const selector = (id) => (store) => ({
  setBpm: (e) => store.updateNode(id, { bpm: +e.target.value }),
});

function Component({ id, data }) {
  const { setBpm } = useStore(selector(id));
  const [on, setOn] = useState(true);

  useEffect(() => {
    let frameId = null;

    function onFrame() {
      frameId = requestAnimationFrame(onFrame);
      setOn(data.audioNode.on);
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
  }, [data.audioNode.on]);

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Clock (16ths)
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>BPM</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="240.0"
          step="any"
          value={data.bpm}
          onChange={setBpm}
        />
        <p className={tw("text-right text-xs")}>{data.bpm.toFixed(0)}</p>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "clock";
const name = "Clock";

function createAudioNode(context, data) {
  return new ClockNode(context, data);
}

const initialData = { bpm: 120.0, gateLength: 0.05 };

export default {
  node: Component,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
