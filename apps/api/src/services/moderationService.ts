/** Stub moderation — replace with provider integration later. */
export async function moderateContent(text: string): Promise<{
  passed: boolean;
  categories: string[];
}> {
  if (!text.trim()) {
    return { passed: true, categories: [] };
  }
  const blocked = /<script|javascript:/i.test(text);
  return {
    passed: !blocked,
    categories: blocked ? ['unsafe_markup'] : [],
  };
}
