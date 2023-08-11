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
        Volt to Cents
      </p>

      <Handle className={tw("w-3 h-3")} type="target" position="top" />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "voltToCents";
const name = "Volt To Cents";

const initialData = {};

function createAudioNode(context) {
  const node = new AudioWorkletNode(context, "voltToCents");
  return node;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
