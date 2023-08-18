// TODO: Provide proper override for disconnect() with no destination.

// Inspired by https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode
export class CompositeAudioNode {
  isCompositeAudioNode = true;
  inputs = [];
  outputs = [];
  context = undefined;

  constructor(context) {
    this.context = context;
  }

  connect(destination, outputIndex = 0, inputIndex = 0) {
    const outputInfo = this.outputs[outputIndex];
    if (arguments.length < 3) {
      // When connecting to an AudioParam inputIndex must not be supplied!
      outputInfo.node.connect(destination, outputInfo.outputIndex);
    } else {
      outputInfo.node.connect(destination, outputInfo.outputIndex, inputIndex);
    }
  }

  disconnect(destination = undefined, output = 0, input = 0) {
    if (arguments.length < 1) {
      for (const outputInfo of this.outputs) {
        outputInfo.node.disconnect();
      }
    } else {
      const outputInfo = this.outputs[output];
      if (arguments.length < 3) {
        outputInfo.node.disconnect(destination, outputInfo.outputIndex);
      } else {
        outputInfo.node.disconnect(destination, outputInfo.outputIndex, input);
      }
    }
  }
}

export function patchAudioNodeConnect() {
  AudioNode.prototype._connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (
    destination,
    outputIndex = 0,
    inputIndex = 0
  ) {
    if (destination.isCompositeAudioNode) {
      const inputInfo = destination.inputs[inputIndex];
      this._connect(inputInfo.node, outputIndex, inputInfo.inputIndex);
    } else {
      this._connect(...arguments);
    }
  };

  AudioNode.prototype._disconnect = AudioNode.prototype.disconnect;
  AudioNode.prototype.disconnect = function (
    destination = undefined,
    output = 0,
    input = 0
  ) {
    if (destination?.isCompositeAudioNode) {
      const inputInfo = destination.inputs[input];
      this._disconnect(inputInfo.node, output, inputInfo.inputIndex);
    } else {
      this._disconnect(...arguments);
    }
  };
}
