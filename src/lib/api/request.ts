import type { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { isAiConfigured } from '../ai/client';
import { checkRateLimit, getClientIdentifier } from '../security/rate-limit';
import {
  safeParseJSON,
  validateRequestSize,
  validateWithSchema,
} from '../security/validate-request';
import { jsonError } from './responses';

/** Shared operator-facing message when the provider credential is absent. */
export const AI_NOT_CONFIGURED_MESSAGE =
  'The AI planner is not configured on this server. Add GEMINI_API_KEY to the server environment.';

/**
 * Apply the per-client rate limit. Returns a ready 429 response when the limit
 * is exceeded, or `null` when the caller may continue. Keeping this in one
 * place guarantees both AI routes enforce identical limits.
 */
export function enforceRateLimit(
  request: NextRequest,
  message: string,
  maxRequests = 10,
  windowMs = 60_000
): NextResponse | null {
  const rateCheck = checkRateLimit(getClientIdentifier(request.headers), maxRequests, windowMs);
  if (rateCheck.allowed) return null;
  return jsonError(message, 429, 'RATE_LIMITED');
}

/** Returns a 503 response when the server has no AI credential configured. */
export function requireAiConfigured(): NextResponse | null {
  if (isAiConfigured()) return null;
  return jsonError(AI_NOT_CONFIGURED_MESSAGE, 503, 'NOT_CONFIGURED');
}

/**
 * Read, size-check, parse and schema-validate a JSON request body.
 * Validation failures throw `ValidationError`, which `toErrorResponse` maps to
 * the same sanitized 400/413 responses as before.
 */
export async function readValidatedBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; rawBody: string }> {
  const rawBody = await request.text();
  validateRequestSize(rawBody);
  const data = validateWithSchema(schema, safeParseJSON(rawBody));
  return { data, rawBody };
}
