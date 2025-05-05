import { describe, it, expect } from "vitest";
import { VELOCITY } from "./index";

describe("core-game", () => {
  describe("constants", () => {
    describe("VELOCITY", () => {
      it("should be a number", () => {
        expect(typeof VELOCITY).toBe("number");
      });
    });
  });
});
