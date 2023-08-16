import { CompositeAudioNode } from "../Utils/CompositeAudioNode";

export class ExampleCompositeNode extends CompositeAudioNode {
  get gain() {
    return this._amp.gain;
  }

  constructor(context, options) {
    super(context, options);

    // Do stuffs below.
    this._amp = this.context.createGain();
    this._input.connect(this._amp);
    this._amp.connect(this._output);
  }
}
