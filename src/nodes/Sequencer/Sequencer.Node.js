export class SequencerNode extends AudioWorkletNode {
  #currentNote = 0;

  get currentNote() {
    return this.#currentNote;
  }

  #on = false;

  get on() {
    return this.#on;
  }

  #cv;

  set cv(value) {
    this.port.postMessage({
      type: "updateCV",
      value: value.map((v) => (v * 0.2) / 12),
    });
    this.#cv = value;
  }

  get cv() {
    return this.#cv;
  }

  #gate;

  set gate(value) {
    this.port.postMessage({ type: "updateGate", value: value });
    this.#gate = value;
  }

  get gate() {
    return this.#gate;
  }

  #reTrigger;

  set reTrigger(value) {
    this.port.postMessage({ type: "updateReTrigger", value: value });
    this.#reTrigger = value;
  }

  get reTrigger() {
    return this.#reTrigger;
  }

  constructor(context, options = {}) {
    const {
      cv = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      gate = [false, false, false, false, false, false, false, false],
      reTrigger = [false, false, false, false, false, false, false, false],
      channelCount,
      channelCountMode,
      channelInterpretation,
    } = options;

    const processorOptions = {
      cv: cv.map((v) => (v * 0.2) / 12),
      gate: gate,
      reTrigger: reTrigger,
    };

    super(context, "sequencer", {
      numberOfInputs: 1,
      numberOfOutputs: 3,
      channelCount: channelCount,
      channelCountMode: channelCountMode,
      channelInterpretation: channelInterpretation,
      processorOptions: processorOptions,
    });

    this.onprocessorerror = (error) => this.onprocesserrorHandler(error);
    this.port.onmessage = (message) => this.portOnmessageHandler(message);

    this.#cv = cv;
    this.#gate = gate;
    this.#reTrigger = reTrigger;
  }

  onprocesserrorHandler(error) {
    console.error(error);
  }

  portOnmessageHandler(message) {
    if (message.data.type === "updateCurrentNote") {
      this.#currentNote = message.data.value;
    } else if (message.data.type === "updateOn") {
      this.#on = message.data.value;
    } else {
      console.error("Unknown message", message.data);
    }
  }
}
