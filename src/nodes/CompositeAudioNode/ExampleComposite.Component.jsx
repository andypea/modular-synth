import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../../store";
import { ExampleCompositeNode } from "./ExampleComposite.Node";

function Node({ id, data }) {
  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Example Composite Node
      </p>

      <Handle className={tw("w-3 h-3")} type="target" position="top" />
      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "exampleCompositeNode";
const name = "Example Composite Node";

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
