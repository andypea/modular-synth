export default class VoltToCents extends AudioWorkletProcessor {
  constructor({ processorOptions } = {}) {
    super();

    // Settings
    // Each octave contains 1200 cents
    this.multiplier = processorOptions?.multiplier ?? 6000.0;
  }

  // TODO: This should be a parameter not an input, so that it can be k-rate.
  process([[input]], outputList) {
    const blockSize = outputList[0]?.[0]?.length ?? 0;

    for (let i = 0; i < blockSize; i++) {
      const inputValue = input?.[i] ?? 0.0;

      const outputValue = this.multiplier * inputValue;

      for (const output of outputList) {
        for (const channel of output) {
          channel[i] = outputValue;
        }
      }
    }

    // TODO: This could lead to memory leaks!
    return true;
  }

  static get parameterDescriptors() {
    return [];
  }
}

registerProcessor("voltToCents", VoltToCents);
