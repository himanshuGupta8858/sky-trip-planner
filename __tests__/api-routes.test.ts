import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as healthGet } from "@/app/api/health/route";
import { POST as contactPost } from "@/app/api/contact/route";
import { POST as chatPost } from "@/app/api/chat/route";
import { POST as placeDetailPost } from "@/app/api/google-place-detail/route";

vi.mock("@/lib/arcjet", () => ({
  default: {
    protect: vi.fn().mockResolvedValue({
      isDenied: () => false,
      reason: { remaining: 10 },
    }),
  },
}));

describe("API routes", () => {
  it("GET /api/health returns service status ok", async () => {
    const res = await healthGet();
    const data = (await res.json()) as { status: string; service: string };
    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.service).toBe("sky-trip-planner");
  });

  it("POST /api/contact validates payloads and accepts valid inquiries", async () => {
    const invalidReq = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "A", email: "bad", subject: "Hi", message: "short" }),
    });
    const invalidRes = await contactPost(invalidReq);
    expect(invalidRes.status).toBe(400);

    const validReq = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Himanshu Gupta",
        email: "himanshu@example.com",
        subject: "Travel Inquiry",
        message: "Testing contact form submission flow end to end.",
      }),
    });
    const validRes = await contactPost(validReq);
    const validBody = (await validRes.json()) as { success: boolean; ticketId: string };
    expect(validRes.status).toBe(200);
    expect(validBody.success).toBe(true);
    expect(validBody.ticketId).toMatch(/^SKY-/);
  });

  it("POST /api/chat returns 400 when tripContext is missing", async () => {
    process.env.GROQ_API_KEY = "test-key";
    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }] }),
    });
    const res = await chatPost(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/google-place-detail returns null gracefully when placeName is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/google-place-detail", {
      method: "POST",
      body: JSON.stringify({ placeName: "" }),
    });
    const res = await placeDetailPost(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toBeNull();
  });
});
