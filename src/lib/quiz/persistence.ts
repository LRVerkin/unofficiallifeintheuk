import type { QuizSession } from "./types";

const STORAGE_KEY = "ulituk:quiz-session:v1";
const SUBMITTED_STORAGE_KEY = "ulituk:quiz-submitted:v1";
const SCHEMA_VERSION = 1;

interface PersistedShape {
  schema: number;
  session: QuizSession;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveSession(session: QuizSession): void {
  const storage = getStorage();
  if (!storage) return;
  const payload: PersistedShape = { schema: SCHEMA_VERSION, session };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or serialisation failure — surface nothing; the in-memory state is still authoritative.
  }
}

export function loadSession(): QuizSession | null {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedShape>;
    if (parsed?.schema !== SCHEMA_VERSION || !parsed.session) return null;
    return parsed.session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
  storage.removeItem(SUBMITTED_STORAGE_KEY);
}
