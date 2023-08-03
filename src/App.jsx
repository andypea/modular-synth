import React from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";
import { useStore } from "./store";
import { tw } from "twind";
import Osc from "./nodes/Osc";
import Amp from "./nodes/Amp";
import Out from "./nodes/Out";
import Adsr from "./nodes/Adsr";
import Vco from "./nodes/Vco";

import "reactflow/dist/style.css";

const nodeTypes = {
  osc: Osc,
  amp: Amp,
  out: Out,
  adsr: Adsr,
  vco: Vco,
};

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addOsc: () => store.createNode("osc"),
  addAmp: () => store.createNode("amp"),
  addAdsr: () => store.createNode("adsr"),
  addVco: () => store.createNode("vco"),
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
              Add Osc
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addAmp}
            >
              Add Amp
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addAdsr}
            >
              Add ADSR
            </button>

            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addVco}
            >
              Add VCO
            </button>
          </Panel>
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
