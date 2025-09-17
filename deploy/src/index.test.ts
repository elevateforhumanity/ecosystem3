import { describe, it, expect } from "vitest";

describe("math sanity", () => {
  it("adds corectly", () => {
    expect(2 + 3).toBe(5);
  });

  it("subtracts correctly", () => {
    expect(7 - 2).toBe(5);
  });

  it("multiplies correctly", () => {
    expect(3 * 4).toBe(12);
  });

  it("divides correctly", () => {
    expect(10 / 2).toBe(5);
  });
});