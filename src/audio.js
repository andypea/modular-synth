import availableNodes from "./nodes/nodes";

export const context = new AudioContext();
const nodes = new Map();

// TODO: This should probably be done in the node.
await context.audioWorklet.addModule(
  "/audioWorkletProcessors/random-noise-processor.js"
);

await context.audioWorklet.addModule("/audioWorkletProcessors/sequencer.js");

await context.audioWorklet.addModule("/audioWorkletProcessors/adsr.js");

const outputMixer = context.createGain();
outputMixer.connect(context.destination);

nodes.set("output", outputMixer);

export function isRunning() {
  return context.state === "running";
}

export function toggleAudio() {
  return isRunning() ? context.suspend() : context.resume();
}

export function createAudioNode(id, type, data) {
  const node = availableNodes.get(type).createAudioNode(context, data);
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
