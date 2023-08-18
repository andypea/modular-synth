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
} from "./audio";
import { availableNodes } from "./nodes/nodes";
import demoString from "./demo.json?raw";

const storageKey = "modular-synth-flow";

// TODO: Prevent the same handle from being connected twice.
export const useStore = createWithEqualityFn(
  (set, get) => ({
    nodes: [
      {
        data: {
          text: 'Click the "Demo" button at the top-left to get started!',
        },
        id: "JLipwBNlFgLeC1lWPZcar",
        type: "text",
        position: { x: 0, y: 0 },
        width: 256,
        height: 122,
        selected: true,
        dragging: false,
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
        removeAudioNode(n.id);
      }
      set({
        edges: [],
        nodes: [],
      });
    },

    save() {
      const nodes = get().nodes.map(
        ({ data: { audioNode, ...dataRest }, ...rest }) => ({
          data: { ...dataRest },
          ...rest,
        })
      );
      const edges = get().edges;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ nodes: nodes, edges: edges })
      );
    },

    loadPatchFromString(patchString) {
      get().reset();
      const data = JSON.parse(patchString);

      if (data) {
        for (const n of data.nodes) {
          get().createNode(n.type, n.position.x, n.position.y, n.id);
          get().updateNode(n.id, n.data);
        }
        for (const e of data.edges) {
          get().addEdge(e);
        }
      }
    },

    restore() {
      const patchString = localStorage.getItem(storageKey);
      get().loadPatchFromString(patchString);
    },

    demo() {
      get().loadPatchFromString(demoString);
    },
  }),
  shallow
);
