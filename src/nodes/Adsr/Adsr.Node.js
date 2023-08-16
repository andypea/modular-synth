export class AdsrNode extends AudioWorkletNode {
  constructor(context, options) {
    const {
      noiseType,
      volume,
      interval,
      // numberOfInputs, // This node has a fixed numberOfInputs
      // numberOfOutputs, // This node has a fixed numberOfOutputs
      channelCount,
      channelCountMode,
      channelInterpretation,
    } = options;

    const parameterData = { volume: volume, interval: interval };
    const processorOptions = noiseType ? { noiseType: noiseType } : {};

    // TODO: Check that channelCount, channelCountMode and channelInterpretation work.
    super(context, "adsr", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: channelCount,
      channelCountMode: channelCountMode,
      channelInterpretation: channelInterpretation,
      parameterData: parameterData,
      processorOptions: processorOptions,
    });

    this.onprocessorerror = (error) => this.onprocesserrorHandler(error);
    this.port.onmessage = (message) => this.portOnmessageHandler(message);

    this.volume = this.parameters.get("volume");
    this.interval = this.parameters.get("interval");

    if (noiseType) {
      this.noiseType = noiseType;
    }
  }

  onprocesserrorHandler(error) {
    console.error(error);
  }

  portOnmessageHandler(message) {
    if (message.data.type === "updateOn") {
      this.on = message.data.value;
    } else {
      console.error("Unknown message", message.data);
    }
  }

  #noiseType = "brown"; // Must match the default value in ExampleAudioWorkletProcessor

  set noiseType(value) {
    this.port.postMessage({ type: "updateNoiseType", value: value });
    this.#noiseType = value;
  }

  get noiseType() {
    return this.#noiseType;
  }

  on = true;
}
