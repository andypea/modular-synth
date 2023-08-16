import React, { useEffect, useState } from "react";
import { Handle } from "../Utils/Handle";
import { useStore } from "../../store";
import { tw } from "twind";

const selector = (store) => ({
  toggleAudio: store.toggleAudio,
});

function Node({ id, data }) {
  const { toggleAudio } = useStore(selector);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let frameId = null;

    function onFrame() {
      frameId = requestAnimationFrame(onFrame);
      setIsRunning(data.audioNode.context.state === "running");
    }

    function start() {
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    start();
    return () => stop();
  }, [data.audioNode.context.state]);

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw(
          "rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm position-self-center"
        )}
      >
        Audio Output
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Mute</p>
        <button onClick={toggleAudio}>
          {isRunning ? (
            <span role="img" aria-label="mute">
              🔈
            </span>
          ) : (
            <span role="img" aria-label="unmute">
              🔇
            </span>
          )}
        </button>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input</p>
        <Handle type="target" position="bottom" />
      </label>
    </div>
  );
}

const key = "audioOutput";
const name = "Audio Output";

function createAudioNode(context, data) {
  const node = new GainNode(context, data);
  node.connect(context.destination);
  context.resume();

  return node;
}

const initialData = {
  gain: 1.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
