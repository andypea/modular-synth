import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  toggleAudio,
  createAudioNode,
  updateAudioNode,
  messageAudioNode,
  removeAudioNode,
  connect,
  disconnect,
  context,
  outputMixer,
} from "./audio";
import { availableNodes } from "./nodes/nodes";

const storageKey = "modular-synth-flow";

// TODO: Prevent the same handle from being connected twice.
export const useStore = createWithEqualityFn(
  (set, get) => ({
    nodes: [
      {
        id: "output",
        type: "out",
        position: { x: 0, y: 0 },
        data: { audioNode: outputMixer },
      },
    ],
    edges: [],

    toggleAudio() {
      toggleAudio();
    },

    onNodesChange(changes) {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },

    createNode(type, x = 0, y = 0, id) {
      id = id ?? nanoid();

      const initialData = availableNodes.get(type).initialData;

      // TODO: Would it be better to refactor, so that this check can be avoided.
      const data =
        typeof initialData === "function"
          ? structuredClone(initialData(context))
          : structuredClone(initialData);
      const position = { x: x, y: y };
      // TODO: This probably shouldn't be part of the state.
      const node = createAudioNode(id, type, data);
      data.audioNode = node;
      set({ nodes: [...get().nodes, { id, type, data, position }] });
    },

    updateNode(id, data, doUpdateAudioNode = true) {
      if (doUpdateAudioNode) {
        updateAudioNode(id, data);
      }
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

    reset() {
      for (const e of get().edges) {
        disconnect(e);
      }
      for (const n of get().nodes) {
        if (n.type !== "out") {
          removeAudioNode(n.id);
        }
      }
      set({
        edges: [],
        nodes: [{ id: "output", type: "out", position: { x: 0, y: 0 } }],
      });
    },

    save() {
      localStorage.setItem(storageKey, JSON.stringify(get()));
    },

    restore() {
      get().reset();

      const data = JSON.parse(localStorage.getItem(storageKey));

      if (data) {
        for (const n of data.nodes) {
          if (n.type !== "out") {
            get().createNode(n.type, n.position.x, n.position.y, n.id);
            get().updateNode(n.id, n.data);
          }
        }
        for (const e of data.edges) {
          get().addEdge(e);
        }
      }
    },
  }),
  shallow
);
