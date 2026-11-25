export type JsonRecord = Record<string, unknown>;

export interface SanitizedMessage {
  role: string;
  content: string;
}

/**
 * Extracts a JSON object from raw LLM text, markdown code blocks, or tool-call payloads.
 */
export function extractJsonPayload(contentOrError: unknown): JsonRecord | null {
  if (!contentOrError) return null;

  if (typeof contentOrError === "object") {
    const obj = contentOrError as JsonRecord;
    if (obj.arguments && typeof obj.arguments === "object") {
      return obj.arguments as JsonRecord;
    }
    if (obj.resp || obj.itinerary || obj.hotels) {
      return obj;
    }
  }

  let raw = String(contentOrError).trim();
  if (raw.startsWith("```json")) {
    raw = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (raw.startsWith("```")) {
    raw = raw.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(raw) as JsonRecord;
    if (parsed.arguments && typeof parsed.arguments === "object") {
      return parsed.arguments as JsonRecord;
    }
    if (typeof parsed.arguments === "string") {
      try {
        return JSON.parse(parsed.arguments) as JsonRecord;
      } catch {
        // Fallback to returning outer parsed object
      }
    }
    return parsed;
  } catch {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const parsed = JSON.parse(raw.slice(firstBrace, lastBrace + 1)) as JsonRecord;
        return (parsed.arguments as JsonRecord) || parsed;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Infers the conversational questionnaire UI widget from plain assistant text.
 */
export function inferUiFromText(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("traveling with") ||
    lower.includes("group") ||
    lower.includes("solo") ||
    lower.includes("couple") ||
    lower.includes("family") ||
    lower.includes("friends")
  ) {
    return "groupSize";
  }
  if (
    lower.includes("budget") ||
    lower.includes("low") ||
    lower.includes("medium") ||
    lower.includes("high") ||
    lower.includes("luxury") ||
    lower.includes("cost")
  ) {
    return "budget";
  }
  if (
    lower.includes("how many days") ||
    lower.includes("duration") ||
    lower.includes("how long") ||
    lower.includes("days") ||
    lower.includes("nights")
  ) {
    return "duration";
  }
  if (
    lower.includes("style") ||
    lower.includes("interest") ||
    lower.includes("adventure") ||
    lower.includes("relax") ||
    lower.includes("food")
  ) {
    return "interests";
  }
  if (
    lower.includes("destination") ||
    lower.includes("where to") ||
    lower.includes("visiting") ||
    lower.includes("travel to")
  ) {
    return "destination";
  }
  if (
    lower.includes("starting") ||
    lower.includes("origin") ||
    lower.includes("from where") ||
    lower.includes("departing")
  ) {
    return "location";
  }
  return "location";
}

/**
 * Strips client-only keys (`ui`, `resp`) from chat history before forwarding to LLM providers.
 */
export function sanitizeMessages(
  msgs: Array<{ role?: unknown; content?: unknown }>
): SanitizedMessage[] {
  return msgs.map((m) => ({
    role: typeof m.role === "string" ? m.role : "user",
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content ?? ""),
  }));
}

export interface ContactPayloadInput {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

export interface ValidatedContactResult {
  valid: boolean;
  error?: string;
  sanitized?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and sanitizes contact form submissions against length and format constraints.
 */
export function validateContactSubmission(payload: ContactPayloadInput): ValidatedContactResult {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return { valid: false, error: "Name must be between 2 and 100 characters." };
  }
  if (!EMAIL_REGEX.test(email) || email.length > 150) {
    return { valid: false, error: "Please provide a valid email address." };
  }
  if (subject.length < 2 || subject.length > 150) {
    return { valid: false, error: "Subject must be between 2 and 150 characters." };
  }
  if (message.length < 10 || message.length > 2000) {
    return { valid: false, error: "Message must be between 10 and 2000 characters." };
  }

  return {
    valid: true,
    sanitized: { name, email, subject, message },
  };
}
