import React, { useState, useEffect } from "react";
import { Handle } from "../UtilityComponents/Handle";
import { useStore } from "../../store";
import { ExampleAudioWorkletNode } from "./ExampleAudioWorklet.Node";
import { IndicatorLight } from "../UtilityComponents/IndicatorLight";
import { tw } from "twind";

const selector = (id) => (store) => ({
  setVolume: (e) => store.updateNode(id, { volume: +e.target.value }),
  setInterval: (e) => store.updateNode(id, { interval: +e.target.value }),
  setNoiseType: (e) => store.updateNode(id, { noiseType: e.target.value }),
});

function Component({ id, data }) {
  const { setVolume, setInterval, setNoiseType } = useStore(selector(id));
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
        Example AudioWorklet
      </p>

      <label className={tw("flex flex-col px-2 pt-1 pb-2")}>
        <p className={tw("text-xs font-bold mb-2")}>Status</p>
        <div className={tw("m-auto")}>
          <IndicatorLight on={on} />
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Volume</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="1.0"
          step="any"
          value={data.volume}
          onChange={setVolume}
        />
        <p className={tw("text-right text-xs")}>{data.volume.toFixed(3)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Volume (input)</p>
        <Handle type="target" position="bottom" id="volume" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Interval</p>
        <input
          className="nodrag"
          type="range"
          min="0.0"
          max="10.0"
          step="any"
          value={data.interval}
          onChange={setInterval}
        />
        <p className={tw("text-right text-xs")}>{data.interval.toFixed(3)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Interval (input)</p>
        <Handle type="target" position="bottom" id="interval" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-2")}>
        <p className={tw("text-xs font-bold mb-2")}>Noise Type</p>
        <select
          className="nodrag"
          value={data.noiseType}
          onChange={setNoiseType}
        >
          <option value="white">white</option>
          <option value="brown">brown</option>
          <option value="none">none</option>
        </select>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "exampleAudioWorklet";
const name = "Example Audio Worklet";

function createAudioNode(context, data) {
  return new ExampleAudioWorkletNode(context, data);
}

const initialData = { volume: 0.01, noiseType: "brown", interval: 1.0 };

export default {
  node: Component,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
