export class ClockNode extends ConstantSourceNode {
  bpm = 120.0;
  gateLength = 0.05;
  schedulerInterval = 25;
  scheduleAheadTime = 0.1;
  nextNoteTime = 0.0;

  constructor(context, options) {
    super(context, options);

    if (options !== undefined) {
      if (options.bpm !== undefined) {
        this.bpm = options.bpm;
      }
      if (options.gateLength !== undefined) {
        this.gateLength = options.gateLength;
      }
    }

    this.nextNoteTime = context.currentTime;

    this.offset.value = 0.0;
    this.start();

    setInterval(this.scheduler.bind(this), this.schedulerInterval);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (
      this.nextNoteTime <
      this.context.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.nextNoteTime);
      this.nextNote();
    }
  }

  scheduleNote(time) {
    this.offset.cancelScheduledValues(time);
    this.offset.setValueAtTime(1.0, time);
    this.offset.setValueAtTime(0.0, time + this.gateLength);
  }

  nextNote() {
    // Advance current note and time by a 16th note...
    const secondsPerBeat = 60.0 / this.bpm; // Notice this picks up the CURRENT
    // tempo value to calculate beat length.
    // TODO: Allow the interval to be changed (16ths, 8ths, 4ths, ...)
    //       Currently the 0.25 hardcodes 16ths.
    this.nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time
  }
}
