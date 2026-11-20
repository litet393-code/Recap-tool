export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (new URL(request.url).pathname === "/api/health") {
      return Response.json(
        { status: "ok", message: "Recap Worker is running" },
        { headers: cors }
      );
    }

    return new Response("Auto Movie Recap API is ready.", {
      headers: { ...cors, "Content-Type": "text/plain" }
    });
  }
};
