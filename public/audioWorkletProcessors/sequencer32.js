// TODO: Make this just a cutdown seuqencer64
const numNotes = 32;

class Sequencer extends AudioWorkletProcessor {
  constructor() {
    super();

    this.high = false;
    this.currentNote = 0;
    this.outputValue = 0.0;
  }

  process(inputList, outputList, parameters) {
    const inputChannel = inputList[0][0];

    const notes = [];
    for (let i = 0; i < numNotes; i++) {
      notes[i] = parameters[`note${i + 1}`];
    }

    // TODO: Handle multiple channels and outputs correctly.
    // TODO: Don't block output if inputChannel is not defined!?
    if (inputChannel) {
      for (let i = 0; i < inputChannel.length; i++) {
        if (!this.high && inputChannel[i] > 0.5) {
          this.high = true;
          this.currentNote = (this.currentNote + 1) % numNotes;
          this.port.postMessage(this.currentNote);
          this.outputValue =
            notes[this.currentNote].length === 1
              ? notes[this.currentNote][0]
              : notes[this.currentNote][i];
        } else if (this.high && inputChannel[i] < 0.5) {
          this.high = false;
        }

        for (const output of outputList) {
          for (const outputChannel of output) {
            outputChannel[i] = this.outputValue;
          }
        }
        //outputValue = 0.0;
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  static get parameterDescriptors() {
    return [...Array(numNotes).keys()]
      .map((i) => i + 1)
      .map((i) => ({
        name: `note${i}`,
        defaultValue: i === 1 ? 1.0 : 0.0,
        minValue: 0.0,
        maxValue: 1.0,
        automationRate: "a-rate",
      }));
  }
}

// define the customGain parameter used in process method

registerProcessor("sequencer32", Sequencer);
