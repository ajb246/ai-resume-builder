import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token || !url.startsWith("https://")) return null;
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const redis = createRedis();

function makeLimit(limiter: Ratelimit["limiter"], analytics = true) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter, analytics });
}

export const chatRateLimit = makeLimit(Ratelimit.slidingWindow(20, "1 m"));
export const uploadRateLimit = makeLimit(Ratelimit.slidingWindow(5, "1 h"));
export const apiRateLimit = makeLimit(Ratelimit.slidingWindow(100, "1 m"));

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; reset?: number }> {
  if (!limiter) return { success: true };
  return limiter.limit(identifier);
}
