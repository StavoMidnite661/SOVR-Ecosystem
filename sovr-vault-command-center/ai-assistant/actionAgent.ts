import { OpenAI } from 'langchain/openai';

const model = new OpenAI({ temperature: 0.3 });
export const analyzeIntent = async (command: string) => model.call(command);
