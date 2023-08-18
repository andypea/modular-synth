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

    this._osc = new OscillatorNode(context, {
      frequency: options.frequency ?? 261.625565,
      type: options.type ?? "sine",
    });
    this._osc.start();
    this.frequency = this._osc.frequency;
    this.outputs[0] = { node: this._osc, outputIndex: 0 };

    this._fmGain = new GainNode(context, {
      gain: options.fmGain ?? 100.0,
    });
    this._fmGain.connect(this._osc.detune);
    this.fmGain = this._fmGain.gain;

    this._fmSource = new ConstantSourceNode(context, { offset: 0.0 });
    this._fmSource.start();
    this._fmSource.connect(this._fmGain);
    this.fm = this._fmSource.offset;

    this._cvGain = new GainNode(context, { gain: 6000.0 });
    this._cvGain.connect(this._osc.detune);

    this._cvSource = new ConstantSourceNode(context, { offset: 0.0 });
    this._cvSource.start();
    this._cvSource.connect(this._cvGain);
    this.cv = this._cvSource.offset;
  }
}
