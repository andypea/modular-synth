import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";
import { default as VcoNode } from "./Vco.Node";
import { Node as VcoComponent } from "./Vco.Component";

function Node({ id, data, minFrequency = 0, maxFrequency = 100.0 }) {
  return (
    <VcoComponent
      id={id}
      data={data}
      minFrequency={minFrequency}
      maxFrequency={maxFrequency}
    />
  );
}

const key = "lfo";
const name = "LFO";

function createAudioNode(context, data) {
  const node = new VcoNode(context, data);

  return node;
}

const initialData = {
  frequency: 2.0,
  fmGain: 10.0,
  type: "sine",
  fm: 0.0,
  cv: 0.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
