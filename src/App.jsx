import { React, useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";
import { useStore } from "./store";
import { tw } from "twind";
import { availableNodes } from "./nodes/nodes";

// import "reactflow/dist/style.css";
import "reactflow/dist/base.css";

const nodeTypes = {};

availableNodes.forEach((value, key) => {
  nodeTypes[key] = value.node;
});

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  createNode: (key) => store.createNode(key),
  reset: store.reset,
  save: store.save,
  restore: store.restore,
  demo: store.demo,
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
          fitViewOptions={{ maxZoom: 1 }}
        >
          <Panel className={tw("space-x-4")} position="top-left">
            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.demo}
            >
              Demo
            </button>
            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.save}
            >
              Save
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.restore}
            >
              Restore
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.reset}
            >
              Reset
            </button>
          </Panel>
          <Panel className={tw("space-x-4")} position="bottom-right">
            {[...availableNodes.entries()].map(([key, value]) => (
              <button
                key={key}
                className={tw("px-2 py-1 rounded bg-white shadow")}
                onClick={() => store.createNode(key)}
              >{`Add ${value.name}`}</button>
            ))}
          </Panel>
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
