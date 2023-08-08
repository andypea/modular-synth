class Sequencer extends AudioWorkletProcessor {
  constructor() {
    super();

    this.high = false;
    this.currentNote = 0;
  }

  process(inputList, outputList, parameters) {
    const inputChannel = inputList[0][0];

    const notes = [
      parameters.note1[0],
      parameters.note2[0],
      parameters.note3[0],
      parameters.note4[0],
      parameters.note5[0],
      parameters.note6[0],
      parameters.note7[0],
      parameters.note8[0],
      parameters.note9[0],
      parameters.note10[0],
      parameters.note11[0],
      parameters.note12[0],
      parameters.note13[0],
      parameters.note14[0],
      parameters.note15[0],
      parameters.note16[0],
    ];

    let outputValue = 0.0;

    // TODO: Handle multiple channels and outputs correctly.

    if (inputChannel) {
      for (let i = 0; i < inputChannel.length; i++) {
        if (!this.high && inputChannel[i] > 0.5) {
          this.high = true;
          this.currentNote = (this.currentNote + 1) % 16;
          outputValue = notes[this.currentNote];
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
        automationRate: "k-rate",
      },
      {
        name: "note2",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note3",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note4",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note5",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note6",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note7",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note8",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note9",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note10",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note11",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note12",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note13",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note14",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note15",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: "note16",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }
}

// define the customGain parameter used in process method

registerProcessor("sequencer", Sequencer);
