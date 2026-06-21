'use server';
/**
 * @fileOverview A Genkit flow that analyzes a database schema and suggests relevant natural language prompts or common SQL queries.
 *
 * - recommendPromptsFromSchema - A function that handles the prompt recommendation process.
 * - RecommendPromptsFromSchemaInput - The input type for the recommendPromptsFromSchema function.
 * - RecommendPromptsFromSchemaOutput - The return type for the recommendPromptsFromSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPromptsFromSchemaInputSchema = z.object({
  databaseSchema: z.string().describe('The database schema, typically in DDL format or a descriptive text, for which to recommend prompts.')
});
export type RecommendPromptsFromSchemaInput = z.infer<typeof RecommendPromptsFromSchemaInputSchema>;

const RecommendPromptsFromSchemaOutputSchema = z.object({
  recommendedPrompts: z.array(z.string()).describe('A list of natural language prompts or common SQL queries relevant to the provided database schema.')
});
export type RecommendPromptsFromSchemaOutput = z.infer<typeof RecommendPromptsFromSchemaOutputSchema>;

const recommendPromptsPrompt = ai.definePrompt({
  name: 'recommendPromptsFromSchemaPrompt',
  input: {schema: RecommendPromptsFromSchemaInputSchema},
  output: {schema: RecommendPromptsFromSchemaOutputSchema},
  prompt: `You are an expert data analyst and an AI assistant specializing in helping users interact with SQL databases using natural language.
Given the following database schema, your task is to suggest relevant natural language prompts and common SQL queries that a user might ask.
Focus on common data analysis tasks, relationships between tables, and potential insights.

Provide a list of at least 5 to 10 distinct and useful prompts/queries.
Each item in the list should be a clear, concise natural language question or a SQL query example.

Database Schema:
{{{databaseSchema}}}`
});

const recommendPromptsFromSchemaFlow = ai.defineFlow(
  {
    name: 'recommendPromptsFromSchemaFlow',
    inputSchema: RecommendPromptsFromSchemaInputSchema,
    outputSchema: RecommendPromptsFromSchemaOutputSchema
  },
  async (input) => {
    try {
      const {output} = await recommendPromptsPrompt(input);
      return output!;
    } catch (error: any) {
      console.warn("Genkit Quota Exceeded or Error in recommendPromptsFromSchemaFlow. Using fallbacks.", error.message);
      // Fallback data to prevent UI crash when API quota is hit
      return {
        recommendedPrompts: [
          "Compare MTTR trends by machine shift",
          "Identify machines with highest maintenance frequency",
          "List all pending work orders for today",
          "Average downtime minutes per machine category",
          "Summarize technician performance for the last quarter"
        ]
      };
    }
  }
);

export async function recommendPromptsFromSchema(
  input: RecommendPromptsFromSchemaInput
): Promise<RecommendPromptsFromSchemaOutput> {
  return recommendPromptsFromSchemaFlow(input);
}
