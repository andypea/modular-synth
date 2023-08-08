import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setAttack: (e) => store.updateNode(id, { attack: +e.target.value }),
  setDecay: (e) => store.updateNode(id, { decay: +e.target.value }),
  setSustain: (e) => store.updateNode(id, { sustain: +e.target.value }),
  setRelease: (e) => store.updateNode(id, { release: +e.target.value }),
});

function Node({ id, data }) {
  const { setDecay } = useStore(selector(id));
  const { setAttack } = useStore(selector(id));
  const { setSustain } = useStore(selector(id));
  const { setRelease } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
      >
        ADSR
      </p>

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

      <Handle className={tw("w-3 h-3")} type="target" position="top" />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

// TODO: This should be in a seperate file.
function createAudioNode(context, data) {
  const node = new AudioWorkletNode(context, "adsr", {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [1],
  });

  node.attack = node.parameters.get("attack");
  node.attack.value = data.attack;

  node.decay = node.parameters.get("decay");
  node.decay.value = data.decay;

  node.sustain = node.parameters.get("sustain");
  node.sustain.value = data.sustain;

  node.release = node.parameters.get("release");
  node.release.value = data.release;

  return node;
}

const initialData = {
  attack: 0.06,
  decay: 0.25,
  sustain: 0.5,
  release: 0.7,
};

const key = "adsr";

const name = "ADSR";

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
