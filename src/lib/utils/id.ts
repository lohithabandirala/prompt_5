/**
 * Identifier helpers shared by the client UI and server-side plan assembly.
 *
 * IDs are only used for React keys, list operations and local-storage records
 * — never for authentication or security decisions. When Web Crypto is
 * unavailable, a timestamp/counter/random fallback keeps IDs unique within a
 * session without adding a dependency.
 */
let fallbackIdCounter = 0;

export function createUuid(): string {
  const globalCrypto = globalThis.crypto;

  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }

  fallbackIdCounter = (fallbackIdCounter + 1) % 0xffff;
  const random = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, '0');
  const counter = fallbackIdCounter.toString(16).padStart(4, '0');
  return `${Date.now().toString(16)}-${counter}-${random}-0000`;
}

/** Prefixed ID for an entity created in the UI (e.g. `task-custom-…`). */
export function createId(prefix: string): string {
  return `${prefix}-${createUuid()}`;
}

/** Short, URL/key-friendly identifier used inside generated plan entries. */
export function shortId(): string {
  return createUuid().slice(0, 8);
}
