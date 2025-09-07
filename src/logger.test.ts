import { describe, it, expect } from "vitest";
import { setLogLevel } from "./logger";

describe("logger", () => {
  it("sets level without throwing", () => {
    setLogLevel("error");
    expect(true).toBe(true);
  });
});