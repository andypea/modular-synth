import { CompositeAudioNode } from "../Utils/CompositeAudioNode";

export default class Node extends CompositeAudioNode {
  constructor(context, options) {
    super(context, options);

    // Do stuffs below.
    this._gate = new ConstantSourceNode(context, {
      offset: options.gate ?? 0.0,
    });
    this.gate = this._gate.offset;
    this._gate.start();

    // Do stuffs below.
    this._cv = new ConstantSourceNode(context, {
      offset: options.cv ?? 0.0,
    });
    this.cv = this._cv.offset;
    this._cv.start();

    this._outputs = [this._gate, this._cv];
  }
}
