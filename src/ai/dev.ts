import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sql-from-natural-language.ts';
import '@/ai/flows/recommend-prompts-from-schema.ts';