class Processor extends AudioWorkletProcessor {
  constructor(options) {
    const {
      // numberOfInputs, // This node has a fixed numberOfInputs
      // numberOfOutputs, // This node has a fixed numberOfOutputs
      outputChannelCount,
      parameterData,
      processorOptions,
    } = options;

    super({
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: outputChannelCount,
      parameterData: parameterData,
    });

    if (processorOptions?.noiseType) {
      this.noiseType = processorOptions.noiseType;
    }

    this.port.onmessage = (message) => this.portOnMessageHandler(message);

    this.previousOutputValue = 0.0;
    this.intervalFrameCount = 0;
    this.on = true;
  }

  // Called once per block (currently 128 frames).
  process(inputList, outputList, parameters) {
    const output = outputList[0];
    // We can read the parameters here as they are not a-rate and, therefore,
    // do not change within a block.
    const volume = parameters["volume"][0];
    const interval = parameters["interval"][0];
    const intervalFrames = Math.floor(interval * sampleRate);

    if (output.length > 0) {
      const channel0 = output[0];
      const blockSize = channel0.length;
      for (let i = 0; i < blockSize; i++) {
        if (interval === 0.0) {
          if (!this.on) {
            this.port.postMessage({ type: "updateOn", value: true });
          }
          this.on = true;
        } else if (this.intervalFrameCount >= intervalFrames) {
          this.on = !this.on;
          this.port.postMessage({ type: "updateOn", value: this.on });
          this.intervalFrameCount = 0;
        } else {
          this.intervalFrameCount += 1;
        }

        let outputValue = 0.0;

        if (!this.on) {
          outputValue = 0.0;
        } else {
          switch (this.noiseType) {
            case "white":
              outputValue = Math.random() * 2 - 1;
              break;
            case "brown": {
              // From: https://noisehack.com/generate-noise-web-audio-api/
              const white = Math.random() * 2 - 1;
              outputValue = (this.previousOutputValue + 0.02 * white) / 1.02;
              this.previousOutputValue = outputValue;
              outputValue *= 3.5; // (roughly) compensate for gain
              break;
            }
            default:
              outputValue = 0.0;
          }
        }

        for (const channel of output) {
          channel[i] = volume * outputValue;
        }
      }
    }

    // The return value affects garbage collection of this node.
    // If you change this, then also change the return value above.
    return true;
  }

  static get parameterDescriptors() {
    return [
      {
        name: "volume",
        automationRate: "k-rate", // Updated once per block
        minValue: 0.0,
        maxValue: 1.0,
        defaultValue: 0.01,
      },
      {
        name: "interval",
        automationRate: "k-rate",
        minValue: 0.0,
        maxValue: 10.0,
        defaultValue: 1.0,
      },
    ];
  }

  noiseType = "white";

  portOnMessageHandler(message) {
    if (message.data.type === "updateNoiseType") {
      this.noiseType = message.data.value;
    } else {
      console.error("Unknown message", message.data);
    }
  }
}

registerProcessor("adsr", Processor);
