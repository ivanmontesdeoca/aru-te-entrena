export async function runProgressSave({ request, reset, success, failure, refresh }: { request: () => Promise<Response>; reset?: () => void; success: () => void; failure: () => void; refresh: () => void }) {
  try {
    const response = await request();
    if (!response.ok) throw new Error("PROGRESS_SAVE_FAILED");
    reset?.(); success(); refresh(); return true;
  } catch { failure(); return false; }
}
