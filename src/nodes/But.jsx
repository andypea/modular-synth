import React from "react";
import { Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setAttack: (e) => store.updateNode(id, { attack: +e.target.value }),
  setSweep: (e) => store.updateNode(id, { sweep: +e.target.value }),
  setRelease: (e) => store.updateNode(id, { release: +e.target.value }),
  trigger: (e) => store.updateNode(id, { trigger: true }),
});

export default function But({ id, data }) {
  const { trigger } = useStore(selector(id), shallow);
  const { setAttack } = useStore(selector(id), shallow);
  const { setSweep } = useStore(selector(id), shallow);
  const { setRelease } = useStore(selector(id), shallow);

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <Handle className={tw("w-2 h-2")} type="target" position="top" />

      <p
        className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
      >
        Button
      </p>
      <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
        <p className={tw("text-xs font-bold mb-2")}>Attack</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.attack}
          onChange={setAttack}
        />
        <p className={tw("text-right text-xs")}>{data.attack.toFixed(2)}</p>

        <p className={tw("text-xs font-bold mb-2")}>Sweep</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="3"
          step="0.01"
          value={data.sweep}
          onChange={setSweep}
        />
        <p className={tw("text-right text-xs")}>{data.sweep.toFixed(2)}</p>

        <p className={tw("text-xs font-bold mb-2")}>Release</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.release}
          onChange={setRelease}
        />
        <p className={tw("text-right text-xs")}>{data.release.toFixed(2)}</p>

        <p className={tw("text-xs font-bold mb-2")}>Trigger</p>
        <input
          className="nodrag"
          type="button"
          value="Trigger"
          onClick={trigger}
        />
      </label>

      <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
    </div>
  );
}
