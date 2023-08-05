import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setType } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Bi-Oscillator
      </p>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Waveform</p>
        <select className="nodrag" value={data.type} onChange={setType}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
        </select>
      </label>

      <Handle
        className={tw("w-3 h-3")}
        type="target"
        id="frequency"
        position="top"
      />
      <Handle
        className={tw("w-3 h-3")}
        type="source"
        position="bottom"
        id="mixer"
      />
    </div>
  );
}

const key = "biosc";

const name = "Bi-Oscillator";

// TODO: type (and other params) are not updated.
function createAudioNode(context, data) {
  const frequency = context.createGain();

  const mixer = context.createGain();

  const gain1 = context.createGain();
  gain1.gain.value = 0.5;
  gain1.connect(mixer);

  const node1 = context.createOscillator();
  node1.frequency.value = 440;
  node1.type = data.type;
  frequency.connect(node1.frequency);
  node1.start();
  node1.connect(gain1);

  const gain2 = context.createGain();
  gain2.gain.value = 0.5;
  gain2.connect(mixer);

  const node2 = context.createOscillator();
  node2.frequency.value = 660;
  node2.type = data.type;
  frequency.connect(node2.frequency);
  node2.start();
  node2.connect(gain2);

  return {
    disconnect: (destination) => {
      if (destination) {
        mixer.disconnect(destination);
      } else {
        frequency.disconnect();
        mixer.disconnect();
        gain1.disconnect();
        node1.disconnect();
        gain2.disconnect();
        node2.disconnect();
      }
    },
    stop: () => {
      node2.stop();
      node1.stop();
    },
    connect: (destination, outputIndex, inputIndex) => {
      mixer.connect(destination, outputIndex, inputIndex);
    },
    frequency: frequency,
    mixer: mixer,
    set type(type) {
      node1.type = type;
      node2.type = type;
    },
  };
}

const initialData = { type: "sine" };

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
