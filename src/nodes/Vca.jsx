import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const leftHandleStyle = { left: "10%" };
const rightHandleStyle = { left: "90%" };

function Node({ id, data }) {
  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        VCA
      </p>

      <div>
        <Handle
          className={tw("w-3 h-3")}
          type="target"
          position="top"
          style={leftHandleStyle}
        />
        <Handle
          className={tw("w-3 h-3")}
          type="target"
          position="top"
          id="gain"
          style={rightHandleStyle}
        />
      </div>
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "vca";
const name = "VCA";

const initialData = {};

function createAudioNode(context, data) {
  const node = new GainNode(context, {
    channelCountMode: "explicit",
    channelCount: 1,
  });
  node.gain.value = 0.0;

  return node;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
