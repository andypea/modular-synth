import React from "react";
import { Handle } from "../Utils/Handle";
import { tw } from "twind";
import { useStore } from "../../store";

// TODO: Add a wet/dry mix parameter.

function Node({ id, data }) {
  return (
    <div className={tw("rounded-md bg-white shadow-xl w-32")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
      >
        Reverb
      </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Input</p>
        <div className={tw("place-self-center")}>
          <Handle type="target" position="bottom" />
        </div>
      </label>

      <hr className={tw("border-gray-200 mx-2")} />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Output</p>
        <div className={tw("place-self-center")}>
          <Handle type="source" position="bottom" />
        </div>
      </label>
    </div>
  );
}

const key = "reverb";
const name = "Reverb";

function createAudioNode(context, data) {
  const node = new ConvolverNode(context, data);
  node.buffer = impulseResponse(context, 2.0, 2.0);

  return node;
}

const initialData = {};

function impulseResponse(audioContext, duration, decay, reverse) {
  // From: https://stackoverflow.com/questions/34482319/web-audio-api-how-do-i-add-a-working-convolver
  var sampleRate = audioContext.sampleRate;
  var length = sampleRate * duration;
  var impulse = audioContext.createBuffer(2, length, sampleRate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);

  if (!decay) decay = 2.0;
  for (var i = 0; i < length; i++) {
    var n = reverse ? length - i : i;
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }
  return impulse;
}

export default {
  node: Node,
  key: key,
  createAudioNode: createAudioNode,
  name: name,
  initialData: initialData,
};
