import { default as Adsr } from "./nodes/Adsr";
import { default as Osc } from "./nodes/Osc";
import { default as Amp } from "./nodes/Amp";
import { default as Vco } from "./nodes/Vco";

const context = new AudioContext();
const nodes = new Map();

nodes.set("output", context.destination);

export function isRunning() {
  return context.state === "running";
}

export function toggleAudio() {
  return isRunning() ? context.suspend() : context.resume();
}

export function createAudioNode(id, type, data) {
  switch (type) {
    case Osc.key: {
      const node = Osc.createAudioNode(context, data);
      nodes.set(id, node);
      break;
    }

    case Amp.key: {
      const node = Amp.createAudioNode(context, data);
      nodes.set(id, node);
      break;
    }

    case Adsr.key: {
      const node = Adsr.createAudioNode(context, data);
      nodes.set(id, node);
      break;
    }

    case Vco.key: {
      const node = Vco.createAudioNode(context, data);
      nodes.set(id, node);
      break;
    }
  }
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
