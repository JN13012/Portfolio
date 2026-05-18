import { handleContactRequest, jsonResponse } from "../../src/contactEmail.js";

export const onRequestPost = async ({ request, env }) => {
  return handleContactRequest(request, env);
};

const methodNotAllowed = () =>
  jsonResponse(405, { message: "Méthode non autorisée." });

export const onRequestGet = methodNotAllowed;
export const onRequestPut = methodNotAllowed;
export const onRequestDelete = methodNotAllowed;
