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
    case "osc": {
      const node = context.createOscillator();
      node.frequency.value = data.frequency;
      node.type = data.type;
      node.start();

      nodes.set(id, node);
      break;
    }

    case "amp": {
      const node = context.createGain();
      node.gain.value = data.gain;

      nodes.set(id, node);
      break;
    }

    case "adsr": {
      const node = context.createGain();
      node.gain.value = 0;
      node.attack = data.attack;
      node.decay = data.decay;
      node.sustain = data.sustain;
      node.release = data.release;

      nodes.set(id, node);
      break;
    }

    case "vco": {
      const node = context.createOscillator();
      node.frequency.value = 440;
      node.type = data.type;
      node.nodeType = "vco";
      node.start();

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

  if (data.trigger) {
    const time = context.currentTime;

    console.log(node.attack, node.decay, node.sustain, node.release);

    node.gain.cancelScheduledValues(time);
    node.gain.setValueAtTime(0, time);
    node.gain.linearRampToValueAtTime(1, time + node.attack);
    node.gain.linearRampToValueAtTime(
      node.sustain,
      time + node.attack + node.decay
    );
    node.gain.linearRampToValueAtTime(
      0,
      time + node.attack + node.decay + node.release
    );
  }
}

export function removeAudioNode(id) {
  const node = nodes.get(id);

  node.disconnect();
  node.stop?.();

  nodes.delete(id);
}

export function connect({ source, target, sourceHandle, targetHandle } = {}) {
  const sourceNode = nodes.get(source);
  const targetNode = nodes.get(target);

  if (targetNode.nodeType === "vco") {
    sourceNode.connect(targetNode.frequency);
  } else {
    sourceNode.connect(targetNode);
  }
}

export function disconnect(sourceId, targetId) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  if (target.nodeType === "vco") {
    source.disconnect(target.frequency);
  } else {
    source.disconnect(target);
  }
}
