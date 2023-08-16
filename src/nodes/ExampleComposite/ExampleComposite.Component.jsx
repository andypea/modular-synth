import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";
import { ExampleCompositeNode } from "./ExampleComposite.Node";

function Node({ id, data }) {
  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Example Composite Node
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input</p>
        <Handle type="target" position="bottom" />
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <Handle type="source" position="bottom" />
      </label>
    </div>
  );
}

const key = "exampleComposite";
const name = "Example Composite";

function createAudioNode(context, data) {
  const node = new ExampleCompositeNode(context, data);

  return node;
}

const initialData = {};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
