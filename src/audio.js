import { availableNodes, addModules } from "./nodes/nodes";
import { patchAudioNodeConnect } from "./nodes/Utils/CompositeAudioNode";

export const context = new AudioContext();
await addModules(context);
patchAudioNodeConnect();

const nodes = new Map();

export function toggleAudio() {
  return context.state === "running" ? context.suspend() : context.resume();
}

export function createAudioNode(id, type, data) {
  const node = availableNodes.get(type).createAudioNode(context, data, id);
  nodes.set(id, node);
  return node;
}

export function updateAudioNode(id, data) {
  const node = nodes.get(id);

  for (const [key, val] of Object.entries(data)) {
    if (node[key] instanceof AudioParam) {
      node[key].value = val;
    } else {
      node[key] = val;
    }
  }
}

export function messageAudioNode(id, message) {
  const node = nodes.get(id);
  node.receiveMessage(message, context, node);
}

export function removeAudioNode(id) {
  const node = nodes.get(id);

  node.disconnect();
  node.stop?.();

  nodes.delete(id);
}

export function connect({ source, target, sourceHandle, targetHandle }) {
  const sourceNode = nodes.get(source);
  const targetNode = nodes.get(target);

  const trueSource = sourceHandle ? sourceNode[sourceHandle] : sourceNode;
  const trueTarget = targetHandle ? targetNode[targetHandle] : targetNode;

  trueSource.connect(trueTarget);
}

export function disconnect({ source, target, sourceHandle, targetHandle }) {
  const sourceNode = nodes.get(source);
  const targetNode = nodes.get(target);

  const trueSource = sourceHandle ? sourceNode[sourceHandle] : sourceNode;
  const trueTarget = targetHandle ? targetNode[targetHandle] : targetNode;

  trueSource.disconnect(trueTarget);
}
