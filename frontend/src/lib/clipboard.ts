export interface CopyTextResult {
  ok: boolean;
  error?: Error;
}

export const copyTextToClipboard = async (
  text: string
): Promise<CopyTextResult> => {
  if (!window.isSecureContext) {
    return {
      ok: false,
      error: new Error(
        'Clipboard API requires a secure context (https or localhost).'
      ),
    };
  }

  if (!navigator.clipboard?.writeText) {
    return {
      ok: false,
      error: new Error('Clipboard API is not available in this browser.'),
    };
  }

  try {
    await navigator.clipboard.writeText(text);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Failed to copy text.'),
    };
  }
};
