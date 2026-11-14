// The online version of the API, running on Cloudflare. It uses the same recommendation logic
// and benchmark data as the Express server in backend/, and serves the built React app for
// every other address.
import { recommendStorage } from "../backend/recommendation.js";
import benchmarkCsv from "../backend/benchmark_results.csv";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

function benchmarkResults() {
  return benchmarkCsv.trim().split(/\r?\n/).slice(1).map((line) => {
    const values = line.split(",");
    return {
      file: values[0],
      size_mb: Number(values[1]),
      download_time_sec: Number(values[2]),
      throughput_mb_s: Number(values[3]),
    };
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      return json({ status: "OK", message: "Backend is working" });
    }

    if (pathname === "/api/benchmark") {
      return json(benchmarkResults());
    }

    if (pathname === "/api/recommend") {
      if (request.method !== "POST") {
        return json({ error: "Send the workload with POST" }, 405);
      }
      let workload;
      try {
        workload = await request.json();
      } catch {
        return json({ error: "Send the workload as JSON" }, 400);
      }
      try {
        const result = recommendStorage(workload);
        return json(result, result.error ? 400 : 200);
      } catch {
        return json({ error: "Failed to generate recommendation" }, 500);
      }
    }

    if (pathname.startsWith("/api/")) {
      return json({ error: "No such API endpoint" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
