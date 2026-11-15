/**
 * Sanitizes and ensures balanced reasoning tags without substituting canned text.
 */
export function healReasoningStream(
  rawText: string,
  _prompt: string,
  onRecovery?: () => void
): { reasoning: string; answer: string; fullText: string } {
  let text = rawText || '';
  let reasoning = '';
  let answer = text;

  if (text.includes('<think>')) {
    const startIdx = text.indexOf('<think>') + 7;
    const endIdx = text.indexOf('</think>');

    if (endIdx !== -1) {
      reasoning = text.substring(startIdx, endIdx).trim();
      answer = text.substring(endIdx + 8).trim();
    } else {
      if (onRecovery) onRecovery();
      reasoning = text.substring(startIdx).trim();
      answer = '';
      text = `<think>\n${reasoning}\n</think>`;
    }
  } else if (text.startsWith('🧠 **[DEEPTHINK') && text.includes('**')) {
    const parts = text.split('\n\n');
    reasoning = parts[0];
    answer = parts.slice(1).join('\n\n');
  }

  return { reasoning, answer, fullText: text };
}
