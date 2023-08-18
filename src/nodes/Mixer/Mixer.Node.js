import { CompositeAudioNode } from "../Utils/CompositeAudioNode";

export default class Node extends CompositeAudioNode {
  constructor(context, options) {
    super(context);

    this.output = new GainNode(context, { gain: 1.0 });
    this.outputs[0] = { node: this.output, outputIndex: 0 };

    this.gain0 = new GainNode(context, { gain: 1.0 });
    this.inputs[0] = { node: this.gain0, inputIndex: 0 };
    this.gain0.connect(this.output);

    this.gain1 = new GainNode(context, { gain: 0.0 });
    this.inputs[1] = { node: this.gain1, inputIndex: 0 };
    this.gain1.connect(this.output);

    this.inverter = new GainNode(context, { gain: -1.0 });
    this.inverter.connect(this.gain0.gain);

    this.mixParameter = new ConstantSourceNode(context, {
      offset: options?.levels ?? 0.5,
    });
    this.mixParameter.start();
    this.mixParameter.connect(this.inverter);
    this.mixParameter.connect(this.gain1.gain);

    this.levels = this.mixParameter.offset;
  }
}
