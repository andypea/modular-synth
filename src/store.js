import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  isRunning,
  toggleAudio,
  createAudioNode,
  updateAudioNode,
  messageAudioNode,
  removeAudioNode,
  connect,
  disconnect,
} from "./audio";
import { default as Adsr } from "./nodes/Adsr";
import { default as Osc } from "./nodes/Osc";
import { default as Amp } from "./nodes/Amp";
import { default as Vco } from "./nodes/Vco";

export const useStore = createWithEqualityFn(
  (set, get) => ({
    nodes: [{ id: "output", type: "out", position: { x: 0, y: 0 } }],
    edges: [],
    isRunning: isRunning(),

    toggleAudio() {
      toggleAudio().then(() => {
        set({ isRunning: isRunning() });
      });
    },

    onNodesChange(changes) {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },

    createNode(type, x, y) {
      const id = nanoid();

      switch (type) {
        case Osc.key: {
          const data = Osc.initialData;
          const position = { x: 0, y: 0 };

          createAudioNode(id, type, data);
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }

        case Amp.key: {
          const data = Amp.initialData;
          const position = { x: 0, y: 0 };

          createAudioNode(id, type, data);
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }

        case Adsr.key: {
          const data = Adsr.initialData;
          const position = { x: 0, y: 0 };

          createAudioNode(id, type, data);
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }

        case Vco.key: {
          const data = Vco.initialData;
          const position = { x: 0, y: 0 };

          createAudioNode(id, type, data);
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }
      }
    },

    updateNode(id, data) {
      updateAudioNode(id, data);
      set({
        nodes: get().nodes.map((node) =>
          node.id === id
            ? { ...node, data: Object.assign(node.data, data) }
            : node
        ),
      });
    },

    messageNode(id, message) {
      messageAudioNode(id, message);
    },

    onNodesDelete(deleted) {
      for (const { id } of deleted) {
        removeAudioNode(id);
      }
    },

    onEdgesChange(changes) {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    addEdge(data) {
      const id = nanoid(6);
      const edge = { id, ...data };

      connect(data);
      set({ edges: [edge, ...get().edges] });
    },

    onEdgesDelete(deleted) {
      for (const data of deleted) {
        disconnect(data);
      }
    },
  }),
  shallow
);
