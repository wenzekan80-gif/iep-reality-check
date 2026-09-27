export const MAX_EXCERPT_LENGTH = 2400;

// These are authored examples, not model responses or a cache of model results.
export const SYNTHETIC_EXAMPLES = [
  {
    id: "ethan-clear", label: "Clear example",
    text: "FICTIONAL DEMO CASE — NO REAL STUDENT DATA\nSpeech-language pathology services will be provided twice weekly for 30 minutes per session.",
  },
  {
    id: "ethan-vague", label: "Vague example",
    text: "FICTIONAL DEMO CASE — NO REAL STUDENT DATA\nEthan will receive speech services as appropriate.",
  },
] as const;

export function approvedExample(text: string) {
  return SYNTHETIC_EXAMPLES.find(example => example.text === text);
}
