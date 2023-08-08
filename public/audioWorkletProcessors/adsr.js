class Adsr extends AudioWorkletProcessor {
  constructor() {
    super();
    this.timeSinceTrigger = -1.0;
    this.high = false;
  }

  process(inputList, outputList, parameters) {
    const trigger = inputList[0][0];
    const timePerFrame = 1.0 / sampleRate;

    // TODO: Iterating through output might be much more efficient.
    if (trigger) {
      if (trigger.length != outputList[0][0].length) {
        console.log(trigger.length, outputList[0][0].length);
      }
      for (let i = 0; i < trigger.length; i++) {
        if (!this.high && trigger[i] > 0.5) {
          this.high = true;
          this.timeSinceTrigger = 0.0;
        } else if (this.high && trigger[i] < 0.5) {
          this.high = false;
        }

        const outputLevelValue = this.outputLevel(
          this.timeSinceTrigger,
          parameters.attack[0],
          parameters.decay[0],
          parameters.sustain[0],
          parameters.release[0]
        );

        if (this.timeSinceTrigger >= 0.0) {
          this.timeSinceTrigger += timePerFrame;
        }
        for (const output of outputList) {
          for (const channel of output) {
            channel[i] = outputLevelValue;
          }
        }
      }
    } else {
      for (const output of outputList) {
        for (const channel of output) {
          for (let i = 0; i < channel.length; i++) {
            channel[i] = 0.01;
          }
        }
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  // TODO: Implement sustain and release.
  outputLevel(timeSinceTrigger, attack, decay, sustain, release) {
    if (timeSinceTrigger < 0) {
      return 0.0;
    } else if (timeSinceTrigger < attack) {
      return Math.max(0.01, timeSinceTrigger / attack);
    } else if (timeSinceTrigger < attack + decay) {
      return Math.max(0.01, 1.0 - (timeSinceTrigger - attack) / decay);
    }
    return 0.0;
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
        defaultValue: 0.5,
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

// define the customGain parameter used in process method
registerProcessor("adsr", Adsr);
