import React from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";
import { useStore } from "./store";
import { tw } from "twind";
import Out from "./nodes/Out";
import { default as Adsr } from "./nodes/Adsr";
import { default as Osc } from "./nodes/Osc";
import { default as Amp } from "./nodes/Amp";
import { default as Vco } from "./nodes/Vco";

import "reactflow/dist/style.css";

const nodeTypes = {
  [Osc.key]: Osc.node,
  [Amp.key]: Amp.node,
  [Adsr.key]: Adsr.node,
  [Vco.key]: Vco.node,
  out: Out,
};

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addOsc: () => store.createNode(Osc.key),
  addAmp: () => store.createNode(Amp.key),
  addAdsr: () => store.createNode(Adsr.key),
  addVco: () => store.createNode(Vco.key),
});

export default function App() {
  const store = useStore(selector);
  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={store.nodes}
          edges={store.edges}
          onNodesChange={store.onNodesChange}
          onNodesDelete={store.onNodesDelete}
          onEdgesChange={store.onEdgesChange}
          onEdgesDelete={store.onEdgesDelete}
          onConnect={store.addEdge}
          fitView
        >
          <Panel className={tw("space-x-4")} position="top-right">
            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addOsc}
            >
              Add {Osc.name}
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addAmp}
            >
              Add {Amp.name}
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addAdsr}
            >
              Add {Adsr.name}
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addVco}
            >
              Add {Vco.name}
            </button>
          </Panel>
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
