class Sequencer extends AudioWorkletProcessor {
  constructor() {
    super();

    this.high = false;
    this.currentNote = 0;
  }

  process(inputList, outputList, parameters) {
    const inputChannel = inputList[0][0];

    const notes = [
      parameters.note1,
      parameters.note2,
      parameters.note3,
      parameters.note4,
      parameters.note5,
      parameters.note6,
      parameters.note7,
      parameters.note8,
      parameters.note9,
      parameters.note10,
      parameters.note11,
      parameters.note12,
      parameters.note13,
      parameters.note14,
      parameters.note15,
      parameters.note16,
    ];

    let outputValue = 0.0;

    // TODO: Handle multiple channels and outputs correctly.

    if (inputChannel) {
      for (let i = 0; i < inputChannel.length; i++) {
        if (!this.high && inputChannel[i] > 0.5) {
          this.high = true;
          this.currentNote = (this.currentNote + 1) % 16;
          outputValue =
            notes[this.currentNote].length === 1
              ? notes[this.currentNote][0]
              : notes[this.currentNote][i];
        } else if (this.high && inputChannel[i] < 0.5) {
          this.high = false;
        }

        for (const output of outputList) {
          for (const outputChannel of output) {
            outputChannel[i] = outputValue;
          }
        }
        outputValue = 0.0;
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  static get parameterDescriptors() {
    return [
      {
        name: "note1",
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note2",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note3",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note4",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note5",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note6",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note7",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note8",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note9",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note10",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note11",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note12",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note13",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note14",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note15",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
      {
        name: "note16",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
    ];
  }
}

// define the customGain parameter used in process method

registerProcessor("sequencer", Sequencer);
