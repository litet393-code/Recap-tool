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

    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json(
        { status: "ok", message: "Recap Worker is running" },
        { headers: cors }
      );
    }

    if (url.pathname === "/api/recap" && request.method === "POST") {
      try {
        const body = await request.json();
        const image = body.image;

        if (!image || typeof image !== "string") {
          return Response.json(
            { error: "Image is required" },
            { status: 400, headers: cors }
          );
        }

        if (image.length > 5000000) {
          return Response.json(
            { error: "Image is too large" },
            { status: 413, headers: cors }
          );
        }

        const result = await env.AI.run(
          "@cf/moondream/moondream3.1-9B-A2B",
          {
            task: "query",
            image,
            question: "ဒီရုပ်ရှင်ဇာတ်ဝင်ခန်းပုံကို သေချာကြည့်ပြီး မြင်ရတဲ့လူတွေ၊ သူတို့ရဲ့လုပ်ဆောင်ချက်နဲ့ နောက်ခံအခြေအနေကို သဘာဝကျတဲ့ မြန်မာစကားပြောဟန်နဲ့ ၃ ကြောင်းမှ ၅ ကြောင်းအတွင်း ရှင်းပြပါ။ ပုံထဲမှာ မမြင်ရတဲ့အကြောင်းအရာကို မခန့်မှန်းပါနဲ့။"
          }
        );

        return Response.json(
          { success: true, recap: result.answer },
          { headers: cors }
        );
      } catch (error) {
        return Response.json(
          { error: "AI processing failed", detail: error.message },
          { status: 500, headers: cors }
        );
      }
    }

    return new Response("Auto Movie Recap API is ready.", {
      headers: cors
    });
  }
};
