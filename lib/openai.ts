import OpenAI from "openai";

let _client: OpenAI | undefined;

function getClient(): OpenAI {
  _client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop: keyof OpenAI) {
    return getClient()[prop];
  },
});
