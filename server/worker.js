import { handleContactRequest, jsonResponse } from "./contactEmail.js";
import { handleVisitsRequest } from "./visits";
import { handleLabRequest } from "./aiLab/handler";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/lab/")) {
      return handleLabRequest(request, env);
    }

    if (url.pathname === "/api/visits") {
      return handleVisitsRequest(request, env);
    }

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
