import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContactRequest } from "./contactEmail";

const valid = { name: "Ada", email: "ada@example.org", subject: "Alternance", message: "Bonjour, un poste à pourvoir.", company: "" };
const env = { RESEND_API_KEY: "test" };

const post = (body, headers = {}) =>
  new Request("https://site.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

afterEach(() => vi.unstubAllGlobals());

describe("contact Worker", () => {
  it("sends a valid message", async () => {
    const send = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", send);
    const res = await handleContactRequest(post(valid, { Origin: "https://site.test" }), env);
    expect(res.status).toBe(200);
    expect(JSON.parse(send.mock.calls[0][1].body).subject).toBe("[Portfolio] Alternance");
  });

  it("refuses invalid fields with a reason", async () => {
    for (const bad of [{ email: "nope" }, { name: "" }, { message: "court" }, { message: "x".repeat(2001) }, { subject: "s".repeat(121) }]) {
      const res = await handleContactRequest(post({ ...valid, ...bad }), env);
      expect(res.status, JSON.stringify(bad).slice(0, 40)).toBe(400);
    }
  });

  it("keeps line breaks out of the subject", async () => {
    const send = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", send);
    await handleContactRequest(post({ ...valid, subject: "A\r\nBcc: x@y.z" }), env);
    expect(JSON.parse(send.mock.calls[0][1].body).subject).toBe("[Portfolio] A Bcc: x@y.z");
  });

  it("drops honeypot messages, other origins and oversized bodies", async () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    expect((await handleContactRequest(post({ ...valid, company: "bot" }), env)).status).toBe(200);
    expect((await handleContactRequest(post(valid, { Origin: "https://evil.test" }), env)).status).toBe(403);
    expect((await handleContactRequest(post({ ...valid, message: "x".repeat(20000) }), env)).status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate-limits per visitor", async () => {
    const limited = { ...env, CONTACT_LIMITER: { limit: async () => ({ success: false }) } };
    expect((await handleContactRequest(post(valid), limited)).status).toBe(429);
  });

  it("hides the provider's error from the visitor", async () => {
    vi.stubGlobal("fetch", async () => new Response("secret detail", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleContactRequest(post(valid), env);
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain("secret");
  });
});
