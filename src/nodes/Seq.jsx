import { React, useEffect, useState } from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

function Node({ id, data }) {
  const { setFrequency, setType } = useStore(selector(id));
  const context = useStore((store) => store.context);
  const [frameId, setFrameId] = useState(0);

  useEffect(() => {
    let frameId = null;

    function onFrame() {
      setFrameId((oldId) => oldId + 1);
      frameId = requestAnimationFrame(onFrame);
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
  }, [setFrameId]);

  const positionInBar =
    (((context.currentTime - data.sequenceStart) * 1000) /
      data.sequenceLength) %
    1;

  const note = Math.floor(positionInBar * data.notes.length) + 1;

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Sequencer
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Frequency</p>
        <input
          className="nodrag"
          type="range"
          min="10"
          max="1000"
          value={data.frequency}
          onChange={setFrequency}
        />
        <p className={tw("text-right text-xs")}>{data.frequency} Hz</p>
      </label>

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

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        {data.notes.map((n, i) => (
          <p key={i + 1} className={i + 1 === note ? tw("font-bold") : ""}>
            {n}
          </p>
        ))}
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "seq";
const name = "Sequencer";
function createAudioNode(context, data) {
  const node = context.createOscillator();
  node.frequency.value = data.frequency;
  node.type = data.type;
  node.start();

  return node;
}

const initialData = {
  frequency: 440,
  type: "sine",
  notes: [1, 0, 0, 0],
  sequenceLength: 2000,
  sequenceStart: 0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
