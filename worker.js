import { handleContactRequest, jsonResponse } from "./src/contactEmail.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContactRequest(request, env);
    }

    if (!env.ASSETS) {
      return jsonResponse(500, {
        message: "Binding ASSETS manquant côté Cloudflare Worker.",
      });
    }

    return env.ASSETS.fetch(request);
  },
};
