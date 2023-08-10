import { React, useEffect, useState } from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setTempo: (e) => store.updateNode(id, { tempo: +e.target.value }),
  setGateLength: (e) => store.updateNode(id, { gateLength: +e.target.value }),
});

function Node({ id, data }) {
  const { setTempo, setGateLength } = useStore(selector(id));

  useEffect(() => {
    let frameId = null;

    function onFrame() {
      frameId = requestAnimationFrame(onFrame);
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
  }, [data]);

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Clock (16ths)
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Tempo</p>
        <input
          className="nodrag"
          type="range"
          min="1"
          max="240"
          value={data.tempo}
          onChange={setTempo}
        />
        <p className={tw("text-right text-xs")}>{data.tempo} bpm</p>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Gate Length</p>
        <input
          className="nodrag"
          type="range"
          min="0.05"
          max="1"
          step="0.05"
          value={data.gateLength}
          onChange={setGateLength}
        />
        <p className={tw("text-right text-xs")}>{data.gateLength} s</p>
      </label>

      <Handle className={tw("w-3 h-3")} type="source" position="bottom" />
    </div>
  );
}

const key = "clk";
const name = "Clock";

// TODO: implement the sequencer on the audio side.
function createAudioNode(context, data) {
  const schedulerInterval = 25; // ms
  const scheduleAheadTime = 0.1; // s
  let nextNoteTime = context.currentTime;

  const node = context.createConstantSource();
  node.offset.value = 0.0;
  node.start();

  setInterval(scheduler, schedulerInterval);

  function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < context.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTime);
      nextNote();
    }
  }

  function scheduleNote(time) {
    node.offset.cancelScheduledValues(time);
    node.offset.setValueAtTime(1.0, time);
    node.offset.setValueAtTime(0.0, time + data.gateLength);
  }

  function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / data.tempo; // Notice this picks up the CURRENT
    // tempo value to calculate beat length.
    // TODO: Allow the interval to be changed (16ths, 8ths, 4ths, ...)
    //       Currently the 0.25 hardcodes 16ths.
    nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time
  }

  return node;
}

const initialData = (context) => ({
  tempo: 120,
  gateLength: 0.05, // s
});

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
