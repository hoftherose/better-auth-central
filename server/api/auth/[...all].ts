import { auth } from "~~/lib/auth";
import { toWebRequest } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const webRequest = toWebRequest(event);
    const res = await auth.handler(webRequest);
    return new Response(res.body, res);
  } catch (err: any) {
    throw createError({ statusCode: 500, message: String(err?.message || err), stack: err?.stack });
  }
});
