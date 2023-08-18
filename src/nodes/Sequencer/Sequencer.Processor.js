// TODO: reset input
const resetChannel = false;

export class Processor extends AudioWorkletProcessor {
  // Settings
  numNotes = 8;
  cv = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  gate = [false, false, false, false, false, false, false, false];
  reTrigger = [false, false, false, false, false, false, false, false];

  // State
  high = false;
  currentNote = 0;

  constructor(options) {
    const { outputChannelCount, parameterData, processorOptions } = options;

    super({
      numberOfInputs: 1,
      numberOfOutputs: 3,
      outputChannelCount: outputChannelCount,
      parameterData: parameterData,
    });

    if (processorOptions?.cv) {
      this.cv = processorOptions.cv;
    }

    if (processorOptions?.gate) {
      this.gate = processorOptions.gate;
    }

    if (processorOptions?.reTrigger) {
      this.reTrigger = processorOptions.reTrigger;
    }

    this.port.onmessage = (message) => this.portOnMessageHandler(message);

    this.previousOutputValue = 0.0;
    this.intervalFrameCount = 0;
    this.on = true;
  }

  process([clock], [cvOutput, gateOutput, reTriggerOutput]) {
    const blockSize =
      cvOutput?.[0].length ??
      gateOutput?.[0].length ??
      reTriggerOutput?.[0].length ??
      0;

    for (let i = 0; i < blockSize; i++) {
      let reTriggerOutputValue = 0.0;
      if (resetChannel && resetChannel[i] > 0.5) {
        this.currentNote = 0;
      }

      if (clock[0] && !this.high && clock[0][i] > 0.5) {
        this.high = true;
        this.currentNote = (this.currentNote + 1) % this.numNotes;
        this.port.postMessage({
          type: "updateCurrentNote",
          value: this.currentNote,
        });
        this.port.postMessage({
          type: "updateOn",
          value: true,
        });
        reTriggerOutputValue = this.reTrigger[this.currentNote];
      } else if (clock[0] && this.high && clock[0][i] < 0.5) {
        this.high = false;
        this.port.postMessage({
          type: "updateOn",
          value: false,
        });
      }

      for (const outputChannel of cvOutput) {
        // outputChannel[i] = this.cv[this.currentNote];
        outputChannel[i] = this.cv[this.currentNote];
      }
      for (const outputChannel of gateOutput) {
        outputChannel[i] = this.gate[this.currentNote];
      }
      for (const outputChannel of reTriggerOutput) {
        outputChannel[i] = reTriggerOutputValue;
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  static get parameterDescriptors() {
    return [];
  }

  portOnMessageHandler(message) {
    if (message.data.type === "updateCV") {
      this.cv = message.data.value;
    } else if (message.data.type === "updateGate") {
      this.gate = message.data.value;
    } else if (message.data.type === "updateReTrigger") {
      this.reTrigger = message.data.value;
    } else {
      console.error("Unknown message", message.data);
    }
  }
}

registerProcessor("sequencer", Processor);
