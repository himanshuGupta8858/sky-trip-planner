import { describe, expect, it } from "vitest";
import {
  extractJsonPayload,
  inferUiFromText,
  sanitizeMessages,
  validateContactSubmission,
} from "@/lib/ai-helpers";

describe("ai-helpers", () => {
  describe("extractJsonPayload", () => {
    it("parses direct JSON string and markdown-fenced JSON", () => {
      expect(extractJsonPayload('{"resp":"Hello","ui":"destination"}')).toEqual({
        resp: "Hello",
        ui: "destination",
      });

      const fenced = '```json\n{"resp":"Choose budget","ui":"budget"}\n```';
      expect(extractJsonPayload(fenced)).toEqual({
        resp: "Choose budget",
        ui: "budget",
      });
    });

    it("unwraps tool-call arguments objects and stringified arguments", () => {
      const wrappedObj = { arguments: { resp: "Days?", ui: "duration" } };
      expect(extractJsonPayload(wrappedObj)).toEqual({ resp: "Days?", ui: "duration" });

      const wrappedStr = JSON.stringify({
        name: "respond",
        arguments: JSON.stringify({ resp: "Group size?", ui: "groupSize" }),
      });
      expect(extractJsonPayload(wrappedStr)).toEqual({
        resp: "Group size?",
        ui: "groupSize",
      });
    });

    it("extracts JSON embedded inside surrounding prose", () => {
      const prose = 'Here is your response: {"resp":"Where from?","ui":"location"} Enjoy!';
      expect(extractJsonPayload(prose)).toEqual({
        resp: "Where from?",
        ui: "location",
      });
    });

    it("returns null on empty or completely invalid input", () => {
      expect(extractJsonPayload("")).toBeNull();
      expect(extractJsonPayload(null)).toBeNull();
      expect(extractJsonPayload("not valid json")).toBeNull();
    });
  });

  describe("inferUiFromText", () => {
    it("maps conversational prompts to appropriate UI widgets", () => {
      expect(inferUiFromText("Who are you traveling with on this trip?")).toBe("groupSize");
      expect(inferUiFromText("What is your budget preference?")).toBe("budget");
      expect(inferUiFromText("How many days will your trip last?")).toBe("duration");
      expect(inferUiFromText("What interests or travel style do you enjoy?")).toBe("interests");
      expect(inferUiFromText("Which destination would you like to visit?")).toBe("destination");
      expect(inferUiFromText("Where are you starting your journey?")).toBe("location");
    });
  });

  describe("sanitizeMessages", () => {
    it("strips extra UI keys and stringifies non-string content", () => {
      const sanitized = sanitizeMessages([
        { role: "user", content: "Plan a trip to Goa" },
        { role: "assistant", content: { text: "Sure!" }, ui: "budget" } as {
          role: string;
          content: unknown;
        },
      ]);

      expect(sanitized).toEqual([
        { role: "user", content: "Plan a trip to Goa" },
        { role: "assistant", content: '{"text":"Sure!"}' },
      ]);
      expect("ui" in sanitized[1]).toBe(false);
    });
  });

  describe("validateContactSubmission", () => {
    it("accepts and trims valid submissions", () => {
      const result = validateContactSubmission({
        name: "  Himanshu Gupta  ",
        email: "himanshu@example.com",
        subject: "Partnership Inquiry",
        message: "We would love to collaborate on accessible AI travel tools.",
      });
      expect(result.valid).toBe(true);
      expect(result.sanitized?.name).toBe("Himanshu Gupta");
    });

    it("rejects invalid emails and short messages", () => {
      expect(
        validateContactSubmission({
          name: "Hi",
          email: "invalid-email",
          subject: "Help",
          message: "Valid long message body here.",
        }).valid
      ).toBe(false);

      expect(
        validateContactSubmission({
          name: "Himanshu",
          email: "himanshu@example.com",
          subject: "Help",
          message: "Short",
        }).valid
      ).toBe(false);
    });
  });
});
