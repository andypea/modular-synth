// From: https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode
export class CompositeAudioNode {
  get _isCompositeAudioNode() {
    return true;
  }

  constructor(context, options) {
    this.context = context;
    this._input = this.context.createGain();
    this._output = this.context.createGain();
  }

  connect() {
    this._output.connect.apply(this._output, arguments);
  }

  disconnect() {
    this._output.disconnect.apply(this._output, arguments);
  }
}

export function patchAudioNodeConnect() {
  AudioNode.prototype._connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args[0]._isCompositeAudioNode) args[0] = args[0]._input;

    this._connect.apply(this, args);
  };
}
