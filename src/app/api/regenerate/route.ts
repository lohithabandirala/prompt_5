import { NextRequest } from 'next/server';
import { z } from 'zod';
import { EventInputSchema } from '@/lib/schemas/event-input';
import {
  RegenerateResultSchemas,
  RegenerateSectionSchema,
  type RegenerateResults,
  type RegenerateSection,
} from '@/lib/schemas/event-plan';
import { regenerateSection, AIGenerationError } from '@/lib/ai/generate-plan';
import { buildRegeneratedPayload } from '@/lib/plan/build-plan';
import {
  enforceRateLimit,
  readValidatedBody,
  requireAiConfigured,
} from '@/lib/api/request';
import { jsonOk, toErrorResponse, logMetric, errorCode } from '@/lib/api/responses';

export const maxDuration = 60;

const RegenerateRequestSchema = z
  .object({
    section: RegenerateSectionSchema,
    input: EventInputSchema,
    currentSummary: z.string().max(2000).optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const limited = enforceRateLimit(
      request,
      'Too many regeneration requests. Please wait and try again.'
    );
    if (limited) return limited;

    const {
      data: { section, input, currentSummary },
      rawBody,
    } = await readValidatedBody(request, RegenerateRequestSchema);

    const notConfigured = requireAiConfigured();
    if (notConfigured) return notConfigured;

    const rawResult = await regenerateSection(section, input, currentSummary);

    // Re-validate the section output against its exact schema. This is the
    // boundary that prevents unvalidated model data from entering the plan.
    const sectionSchema = RegenerateResultSchemas[section];
    const parsed = sectionSchema.safeParse(rawResult);
    if (!parsed.success) {
      throw new AIGenerationError(
        'The AI returned an invalid section. No changes were applied.',
        'SCHEMA_VALIDATION_FAILED',
        false
      );
    }

    const payload = buildRegeneratedPayload(
      section,
      parsed.data as RegenerateResults[RegenerateSection],
      input
    );

    logMetric('plan_section_regenerated', {
      latencyMs: Date.now() - startedAt,
      inputBytes: rawBody.length,
      section,
    });

    return jsonOk(payload);
  } catch (error) {
    logMetric('plan_regeneration_failed', {
      latencyMs: Date.now() - startedAt,
      code: errorCode(error),
    });
    return toErrorResponse(error);
  }
}
