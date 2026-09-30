import "server-only";
import { GoogleGenAI } from "@google/genai";
import { env } from "../env";

export interface GeneratedImage {
  data: Buffer;
  mimeType: string;
  model: string;
}

/** Thrown for provider failures; `userMessage` is safe to show, the cause is only logged. */
export class ImageGenerationError extends Error {
  constructor(public userMessage: string, cause?: unknown) {
    super(userMessage, { cause });
  }
}

let client: GoogleGenAI | undefined;

/** Server-side only: the API key never reaches the browser. */
export async function generateImage(prompt: string, timeoutMs = 55_000): Promise<GeneratedImage> {
  const { GEMINI_API_KEY, GEMINI_IMAGE_MODEL } = env();
  if (!GEMINI_API_KEY) throw new ImageGenerationError("Image generation is not configured yet.");
  client ??= new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const res = await client.models.generateContent({
      model: GEMINI_IMAGE_MODEL,
      contents: prompt,
      config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" }, abortSignal: AbortSignal.timeout(timeoutMs) },
    });
    const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
    if (!part?.inlineData?.data) {
      const reason = res.promptFeedback?.blockReason ?? res.candidates?.[0]?.finishReason;
      throw new ImageGenerationError(
        reason ? "That idea couldn't be generated. Try rephrasing your description." : "The model didn't return an image. Please try again.",
        reason,
      );
    }
    return { data: Buffer.from(part.inlineData.data, "base64"), mimeType: part.inlineData.mimeType ?? "image/png", model: GEMINI_IMAGE_MODEL };
  } catch (e) {
    if (e instanceof ImageGenerationError) throw e;
    console.error("[gemini] generation failed", e);
    throw new ImageGenerationError("The image service is busy or unavailable. Please try again.", e);
  }
}
