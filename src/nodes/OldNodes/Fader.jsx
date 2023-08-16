import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const leftHandleStyle = { left: "10%" };
const rightHandleStyle = { left: "90%" };

const selector = (id) => (store) => ({
  setFade: (e) => store.updateNode(id, { fade: +e.target.value }),
});

function Node({ id, data }) {
  const { setFade } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Fader
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Fade</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="any"
          value={data.fade}
          onChange={setFade}
        />
        <p className={tw("text-right text-xs")}>{data.fade}</p>
      </label>

      <div>
        <Handle
          className={tw("w-3 h-3")}
          type="target"
          position="top"
          id="input0"
          style={leftHandleStyle}
        />
        <Handle
          className={tw("w-3 h-3")}
          type="target"
          position="top"
          id="input1"
          style={rightHandleStyle}
        />
      </div>
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "fader";
const name = "Fader";

const initialData = { fade: 0 };

function createAudioNode(context, data) {
  const node = new GainNode(context);
  node.input0 = new GainNode(context);
  node.input0.gain.value = 1 - data.fade;
  node.input0.connect(node);
  node.input1 = new GainNode(context);
  node.input1.gain.value = data.fade;
  node.input1.connect(node);

  Object.defineProperty(node, "fade", {
    set(value) {
      node.input0.gain.value = 1 - data.fade;
      node.input1.gain.value = data.fade;
    },
  });

  return node;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
