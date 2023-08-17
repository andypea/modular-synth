import { CompositeAudioNode } from "../Utils/CompositeAudioNode";

export default class Node extends CompositeAudioNode {
  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  constructor(context, options) {
    super(context, options);

    // Do stuffs below.
    this._osc = new OscillatorNode(context, {
      frequency: options.frequency ?? 261.625565,
      type: options.type ?? "sine",
    });
    this.frequency = this._osc.frequency;
    this._osc.connect(this._output);

    this._fmGain = new GainNode(context, {
      gain: options.fmGain ?? 100.0,
    });
    this._fmGain.connect(this._osc.detune);
    this.fmGain = this._fmGain.gain;
    this.fm = this._fmGain;

    this._cvGain = new GainNode(context, { gain: 6000.0 });
    this._cvGain.connect(this._osc.detune);
    this.cv = this._cvGain;

    this._osc.start();
  }
}
