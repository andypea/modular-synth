export class AdsrNode extends AudioWorkletNode {
  constructor(context, options) {
    const {
      attack,
      decay,
      sustain,
      release,
      channelCount,
      channelCountMode,
      channelInterpretation,
    } = options;

    const parameterData = {
      attack: attack,
      decay: decay,
      sustain: sustain,
      release: release,
    };

    // TODO: Check that channelCount, channelCountMode and channelInterpretation work.
    super(context, "adsr", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      channelCount: channelCount,
      channelCountMode: channelCountMode,
      channelInterpretation: channelInterpretation,
      parameterData: parameterData,
    });

    this.onprocessorerror = (error) => this.onprocesserrorHandler(error);
    this.port.onmessage = (message) => this.portOnmessageHandler(message);

    this.attack = this.parameters.get("attack");
    this.decay = this.parameters.get("decay");
    this.sustain = this.parameters.get("sustain");
    this.release = this.parameters.get("release");
  }

  onprocesserrorHandler(error) {
    console.error(error);
  }
}
