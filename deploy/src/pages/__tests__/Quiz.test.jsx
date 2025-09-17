import { describe, it, expect } from "vitest";
import { scoreQuiz } from "../Quiz";

describe("scoreQuiz", () => {
  const qs = [
    { id: 1, answer: 2 },
    { id: 2, answer: 0 },
    { id: 3, answer: 1 }
  ];
  it("scores all correct", () => {
    const selected = { 1: 2, 2: 0, 3: 1 };
    expect(scoreQuiz(qs, selected)).toBe(3);
  });
  it("scores partial correct", () => {
    const selected = { 1: 2, 2: 2, 3: 0 };
    expect(scoreQuiz(qs, selected)).toBe(1);
  });
  it("scores none correct", () => {
    const selected = { 1: 0, 2: 1, 3: 0 };
    expect(scoreQuiz(qs, selected)).toBe(0);
  });
});