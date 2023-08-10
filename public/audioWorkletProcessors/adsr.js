export default class Adsr extends AudioWorkletProcessor {
  constructor() {
    super();
    this.triggerFrame = -1;
    this.releaseFrame = -1;
    this.gateHigh = false;
    this.reTriggerHigh = false;
    this.threshold = 0.5;
  }

  process([[gate], [reTrigger]], outputList, parameters) {
    const blockSize =
      gate?.length ?? reTrigger?.length ?? outputList[0]?.[0]?.length ?? 0;

    const attackFrames = parameters.attack[0] * sampleRate;
    const decayFrames = parameters.decay[0] * sampleRate;
    const releaseFrames = parameters.release[0] * sampleRate;

    for (let i = 0; i < blockSize; i++) {
      const frameNumber = currentFrame + i;
      const gateValue = gate?.[i] ?? 0.0;
      const reTriggerValue = reTrigger?.[i] ?? 0.0;

      if (
        (!this.gateHigh && gateValue > this.threshold) ||
        (!this.reTriggerHigh && reTriggerValue > this.threshold)
      ) {
        this.triggerFrame = frameNumber;
        this.releaseFrame = frameNumber + attackFrames + decayFrames;
      }

      if (
        this.gateHigh &&
        gateValue < this.threshold &&
        frameNumber > frameNumber + attackFrames + decayFrames
      ) {
        this.releaseFrame = frameNumber;
      }

      this.gateHigh = gateValue > 0.5;
      this.reTriggerHigh = reTrigger > 0.5;

      const outputValue = calcOutputValue(
        frameNumber,
        this.gateHigh,
        this.triggerFrame,
        this.releaseFrame,
        attackFrames,
        decayFrames,
        parameters.sustain[0],
        releaseFrames
      );
      for (const output of outputList) {
        for (const channel of output) {
          channel[i] = outputValue;
        }
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  // TODO: Set reasonable min and max param values.
  static get parameterDescriptors() {
    return [
      {
        name: "attack",
        defaultValue: 0.06,
        minValue: 0,
        maxValue: 2,
        automationRate: "k-rate",
      },
      {
        name: "decay",
        defaultValue: 0.25,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "sustain",
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "release",
        defaultValue: 0.7,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }
}

function calcOutputValue(
  frameNum,
  gateHigh,
  triggerFrameNum,
  releaseFrameNum,
  attackFrames,
  decayFrames,
  sustain,
  releaseFrames
) {
  if (triggerFrameNum < 0) {
    return 0.0;
  } else if (frameNum < triggerFrameNum + attackFrames) {
    return (frameNum - triggerFrameNum) / attackFrames;
  } else if (frameNum < triggerFrameNum + attackFrames + decayFrames) {
    return (
      1.0 -
      ((1.0 - sustain) * (frameNum - (triggerFrameNum + attackFrames))) /
        decayFrames
    );
  } else if (gateHigh) {
    return sustain;
  } else if (frameNum < releaseFrameNum + releaseFrames) {
    return sustain * (1.0 - (frameNum - releaseFrameNum) / releaseFrames);
  } else {
    return 0.0;
  }
}

registerProcessor("adsr", Adsr);
