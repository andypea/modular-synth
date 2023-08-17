// From: https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode
export class CompositeAudioNode {
  get _isCompositeAudioNode() {
    return true;
  }

  _outputs = [];

  constructor(context, options) {
    this.context = context;
    this._input = this.context.createGain();
    this._output = this.context.createGain();
  }

  connect(destination, outputIndex, inputIndex) {
    if (outputIndex || outputIndex === 0) {
      this._outputs[outputIndex].connect(destination, 0, inputIndex);
    } else {
      this._output.connect.apply(this._output, arguments);
    }
  }

  disconnect(destination, output, input) {
    if (output || output === 0) {
      this._outputs[output].disconnect(destination, 0, input);
    } else {
      this._output.disconnect.apply(this._output, arguments);
    }
  }
}

export function patchAudioNodeConnect() {
  AudioNode.prototype._connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args[0]._isCompositeAudioNode) {
      args[0] = args[0]._input;
    }

    this._connect.apply(this, args);
  };

  AudioNode.prototype._disconnect = AudioNode.prototype.disconnect;
  AudioNode.prototype.disconnect = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args[0] && args[0]._isCompositeAudioNode) {
      args[0] = args[0]._input;
    }

    this._disconnect.apply(this, args);
  };
}
