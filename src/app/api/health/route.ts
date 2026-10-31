import { connection, NextResponse } from 'next/server';
import { isAiConfigured, resolveModelName } from '@/lib/ai/client';

/**
 * Public capability probe. Exposes only whether a server credential exists —
 * never the credential itself.
 *
 * Request-time rendering keeps the reported model and credential state in sync
 * with the running deployment instead of a build-time snapshot.
 */
export async function GET() {
  await connection();

  return NextResponse.json(
    {
      status: 'ok',
      aiConfigured: isAiConfigured(),
      model: resolveModelName(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
