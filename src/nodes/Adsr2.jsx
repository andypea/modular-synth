import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setAttack: (e) => store.updateNode(id, { attack: +e.target.value }),
  setDecay: (e) => store.updateNode(id, { decay: +e.target.value }),
  setSustain: (e) => store.updateNode(id, { sustain: +e.target.value }),
  setRelease: (e) => store.updateNode(id, { release: +e.target.value }),
  trigger: () => store.messageNode(id, { trigger: true }),
});

function Node({ id, data }) {
  const { trigger } = useStore(selector(id));
  const { setDecay } = useStore(selector(id));
  const { setAttack } = useStore(selector(id));
  const { setSustain } = useStore(selector(id));
  const { setRelease } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <Handle className={tw("w-3 h-3")} type="target" position="top" />

      <p
        className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
      >
        ADSR 2
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

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <input
          className="nodrag"
          type="button"
          value="Trigger"
          onClick={trigger}
        />
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

function trigger(context, node) {
  const time = context.currentTime;

  node.gain.cancelScheduledValues(time);
  node.gain.setValueAtTime(0, time);
  node.gain.linearRampToValueAtTime(1, time + node.attack);
  node.gain.linearRampToValueAtTime(
    node.sustain,
    time + node.attack + node.decay
  );
  node.gain.linearRampToValueAtTime(
    0,
    time + node.attack + node.decay + node.release
  );
}

function receiveMessage(message, context, node) {
  if (message.trigger) {
    trigger(context, node);
  }
}

function createAudioNode(context, data) {
  const node = context.createGain();
  node.gain.value = 0;
  node.attack = data.attack;
  node.decay = data.decay;
  node.sustain = data.sustain;
  node.release = data.release;

  node.receiveMessage = receiveMessage;

  return node;
}

const initialData = {
  attack: 0.06,
  decay: 0.25,
  sustain: 0.5,
  release: 0.7,
};

const key = "adsr2";

const name = "ADSR 2";

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
