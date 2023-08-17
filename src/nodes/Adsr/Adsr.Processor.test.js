import "../TestUtils/AudioWorkletProcessor";
import { describe, expect, test, vi } from "vitest";
import Processor from "./Adsr.Processor.js";

vi.stubGlobal("sampleRate", 1);
vi.stubGlobal("currentFrame", 0);

describe("AdsrTests", () => {
  test("is Adsr instantiated", () => {
    const worklet = new Processor();
    expect(worklet).toBeTruthy();
  });

  test("Adsr works with no input", () => {
    const adsr = new Processor();
    const outputChannel = new Array(2).fill(0.0);
    const parameters = {
      attack: [0],
      decay: [0],
      sustain: [0.0],
      release: [0],
    };
    adsr.process([[], []], [[outputChannel]], parameters);

    const expectedOutputChannel = new Array(2).fill(0.0);

    expect(outputChannel).toEqual(expectedOutputChannel);
  });

  test("Adsr is correct for a momentary gate", () => {
    const adsr = new Processor({ processorOptions: { maxChange: 1.0 } });
    const gateChannel = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const outputChannel = new Array(10).fill(0.0);
    const parameters = {
      attack: [2],
      decay: [2],
      sustain: [0.5],
      release: [2],
    };

    adsr.process([[gateChannel], []], [[outputChannel]], parameters);

    const expectedOutputChannel = [
      0, 0, 0.5, 1.0, 0.75, 0.5, 0.25, 0.0, 0.0, 0.0,
    ];
    expect(outputChannel).toEqual(expectedOutputChannel);
  });

  test("Adsr is correct for a short gate", () => {
    const adsr = new Processor({ processorOptions: { maxChange: 1.0 } });
    const gateChannel = [0, 1, 1, 1, 1, 1, 1, 0, 0, 0];
    const outputChannel = new Array(10).fill(0.0);
    const parameters = {
      attack: [2],
      decay: [2],
      sustain: [0.5],
      release: [2],
    };

    adsr.process([[gateChannel], []], [[outputChannel]], parameters);

    const expectedOutputChannel = [
      0, 0, 0.5, 1.0, 0.75, 0.5, 0.5, 0.5, 0.25, 0.0,
    ];
    expect(outputChannel).toEqual(expectedOutputChannel);
  });
});
