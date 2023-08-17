import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";
import { default as KeyboardNode } from "./Keyboard.Node";

const selector = (id) => (store) => ({
  setGate: (value) => () => store.updateNode(id, { gate: value }),
  setCV: (value) => () => store.updateNode(id, { cv: value }),
});

function Node({ id, data }) {
  const { setGate, setCV } = useStore(selector(id));

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Keyboard
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Keys</p>
        <div className={tw("flex flex-row mb-1")}>
          <div className={tw("mx-1 w-3")}></div>
          {[1, 3, -1, 6, 8, 10].map((semitone) =>
            semitone > 0 ? (
              <input
                key={semitone}
                className={tw("nodrag mx-1 w-6")}
                type="button"
                value=""
                onPointerDown={() => {
                  setGate(1.0)();
                  setCV((semitone * 0.2) / 12)();
                }}
                onPointerUp={setGate(0.0)}
              />
            ) : (
              <div key={semitone} className={tw("mx-1 w-6")}></div>
            )
          )}
        </div>
        <div className={tw("flex flex-row")}>
          {[0, 2, 4, 5, 7, 9, 11, 12].map((semitone) => (
            <input
              key={semitone}
              className={tw("nodrag mx-1 w-6")}
              type="button"
              value=""
              onPointerDown={() => {
                setGate(1.0)();
                setCV((semitone * 0.2) / 12)();
              }}
              onPointerUp={setGate(0.0)}
            />
          ))}
        </div>
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Gate</p>
        <Handle type="source" position="bottom" id="0" />
      </label>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>CV</p>
        <Handle type="source" position="bottom" id="1" />
      </label>
    </div>
  );
}

const key = "keyboard";
const name = "Keyboard";

function createAudioNode(context, data) {
  const node = new KeyboardNode(context, data);
  return node;
}

const initialData = {
  gate: 0.0,
  cv: 0.0,
};

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
