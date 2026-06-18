import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Configuration ---
// Using current stable free-tier models (as of April 2026)
// gemini-2.0-flash and gemini-2.0-flash-lite are DEPRECATED
// gemini-1.5-flash is REMOVED
const TEXT_MODEL = "gemini-2.5-flash";

// --- Request Queue ---
// Serializes ALL Gemini API calls to prevent multiple simultaneous requests
// This prevents burning through free-tier rate limits

interface QueueItem {
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class RequestQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private lastRequestTime = 0;
  // Free tier: ~15 RPM for gemini-2.5-flash = 1 request per 4 seconds
  private minDelayMs = 4000;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      if (!this.processing) {
        this.processNext();
      }
    });
  }

  private async processNext() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    this.processing = true;

    const item = this.queue.shift()!;
    try {
      // Enforce minimum delay between requests to stay within rate limits
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      if (elapsed < this.minDelayMs && this.lastRequestTime > 0) {
        const waitTime = this.minDelayMs - elapsed;
        console.log(`⏳ Waiting ${Math.round(waitTime / 1000)}s before next request (rate limit protection)...`);
        await sleep(waitTime);
      }

      const result = await item.fn();
      this.lastRequestTime = Date.now();
      item.resolve(result);
    } catch (err) {
      this.lastRequestTime = Date.now();
      item.reject(err);
    }

    // Process next item in queue
    this.processNext();
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Single global queue for all API calls
const requestQueue = new RequestQueue();

// --- Simple retry (single retry on 429 with Google's suggested delay) ---
async function withSingleRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error?.status === 429) {
      // Extract Google's retry delay or default to 30s
      let delayMs = 30000;
      const retryInfo = error?.errorDetails?.find(
        (d: any) => d["@type"]?.includes("RetryInfo")
      );
      if (retryInfo?.retryDelay) {
        const seconds = parseInt(retryInfo.retryDelay);
        if (!isNaN(seconds)) {
          delayMs = (seconds + 2) * 1000;
        }
      }
      console.log(`⏳ Rate limited. Retrying once in ${Math.round(delayMs / 1000)}s...`);
      await sleep(delayMs);
      return await fn();
    }
    throw error;
  }
}

// --- Main API Function: Text Generation ---
export async function generateWithGemini(
  prompt: string
): Promise<{ text: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new GeminiError("Gemini API key is not configured.", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return requestQueue.add(() =>
    withSingleRetry(async () => {
      const model = genAI.getGenerativeModel({ model: TEXT_MODEL });
      console.log(`🤖 Calling ${TEXT_MODEL}...`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`✅ ${TEXT_MODEL} responded (${text.length} chars)`);
      return { text, model: TEXT_MODEL };
    })
  );
}



// --- Custom Error Class ---
export class GeminiError extends Error {
  status: number;
  originalError?: any;

  constructor(message: string, status: number, originalError?: any) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
    this.originalError = originalError;
  }
}
