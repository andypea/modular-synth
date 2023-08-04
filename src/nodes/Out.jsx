import React from "react";
import { Handle } from "reactflow";
import { useStore } from "../store";
import { tw } from "twind";

const selector = (store) => ({
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
});

export default function Out({ id, data }) {
  const { isRunning, toggleAudio } = useStore(selector);

  return (
    <div className={tw("rounded-md bg-white shadow-xl px-4 py-2")}>
      <Handle className={tw("w-3 h-3")} type="target" position="top" />

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
    </div>
  );
}
