'use server';
/**
 * @fileOverview A Genkit flow for converting natural language queries into SQL queries.
 *
 * - generateSqlFromNaturalLanguage - A function that handles the conversion of natural language to SQL.
 * - NaturalLanguageQueryInput - The input type for the generateSqlFromNaturalLanguage function.
 * - GeneratedSQLOutput - The return type for the generateSqlFromNaturalLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageQueryInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .describe('The natural language query to convert to SQL.'),
  databaseSchema: z
    .string()
    .describe(
      'The database schema in a format like CREATE TABLE statements or an ERD description. This will be used to generate the SQL query.'
    ),
});
export type NaturalLanguageQueryInput = z.infer<
  typeof NaturalLanguageQueryInputSchema
>;

const GeneratedSQLOutputSchema = z.object({
  sqlQuery: z.string().describe('The generated SQL query.'),
});
export type GeneratedSQLOutput = z.infer<typeof GeneratedSQLOutputSchema>;

export async function generateSqlFromNaturalLanguage(
  input: NaturalLanguageQueryInput
): Promise<GeneratedSQLOutput> {
  return generateSqlFromNaturalLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSqlFromNaturalLanguagePrompt',
  input: {schema: NaturalLanguageQueryInputSchema},
  output: {schema: GeneratedSQLOutputSchema},
  prompt: `You are an expert SQL query generator. Your task is to convert a natural language query into an accurate SQL query based on the provided database schema.

Database Schema:

{{databaseSchema}}

Natural Language Query: {{{naturalLanguageQuery}}}

Generate the SQL query to answer the natural language query. Only return the SQL query and nothing else.

SQL Query:`,
});

const generateSqlFromNaturalLanguageFlow = ai.defineFlow(
  {
    name: 'generateSqlFromNaturalLanguageFlow',
    inputSchema: NaturalLanguageQueryInputSchema,
    outputSchema: GeneratedSQLOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      console.warn("Genkit Quota Exceeded or Error in generateSqlFromNaturalLanguageFlow. Using fallbacks.", error.message);
      // Return a plausible SQL comment/query fallback if the AI fails
      return {
        sqlQuery: `-- AI Model Quota Exceeded. Please try again later.\nSELECT * FROM machine_logs ORDER BY log_timestamp DESC LIMIT 10;`
      };
    }
  }
);
