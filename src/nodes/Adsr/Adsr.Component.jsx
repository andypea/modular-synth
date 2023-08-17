import React, { useState, useEffect } from "react";
import { Handle } from "../Utils/Handle";
import { useStore } from "../../store";
import { AdsrNode } from "./Adsr.Node";
import { tw } from "twind";

const selector = (id) => (store) => ({
  setAttack: (e) => store.updateNode(id, { attack: +e.target.value }),
  setDecay: (e) => store.updateNode(id, { decay: +e.target.value }),
  setSustain: (e) => store.updateNode(id, { sustain: +e.target.value }),
  setRelease: (e) => store.updateNode(id, { release: +e.target.value }),
});

function Component({ id, data }) {
  const { setAttack, setDecay, setSustain, setRelease } = useStore(
    selector(id)
  );

  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        ADSR
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Gate</p>
        <Handle type="target" position="bottom" id="0" />
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>reTrigger</p>
        <Handle type="target" position="bottom" id={1} />
      </label>

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Attack</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.attack}
          onChange={setAttack}
        />
        <p className={tw("text-right text-xs")}>{data.attack.toFixed(2)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Decay</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.decay}
          onChange={setDecay}
        />
        <p className={tw("text-right text-xs")}>{data.decay.toFixed(2)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Sustain</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={data.sustain}
          onChange={setSustain}
        />
        <p className={tw("text-right text-xs")}>{data.sustain.toFixed(2)}</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Release</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={data.release}
          onChange={setRelease}
        />
        <p className={tw("text-right text-xs")}>{data.release.toFixed(2)}</p>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "adsr";
const name = "ADSR";

function createAudioNode(context, data) {
  return new AdsrNode(context, data);
}

const initialData = {
  attack: 0.06,
  decay: 0.25,
  sustain: 0.2,
  release: 0.7,
};

export default {
  node: Component,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
