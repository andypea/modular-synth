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

    case "but": {
      const node = context.createGain();
      node.gain.value = 0;
      node.attack = data.attack;
      node.sweep = data.sweep;
      node.release = data.release;

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

    node.gain.cancelScheduledValues(time);
    node.gain.setValueAtTime(0, time);
    node.gain.linearRampToValueAtTime(1, time + node.attack);
    node.gain.linearRampToValueAtTime(0.5, time + node.sweep);
    node.gain.linearRampToValueAtTime(0, time + node.sweep + node.release);
  }
}

export function removeAudioNode(id) {
  const node = nodes.get(id);

  node.disconnect();
  node.stop?.();

  nodes.delete(id);
}

export function connect(sourceId, targetId) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  source.connect(target);
}

export function disconnect(sourceId, targetId) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  source.disconnect(target);
}
