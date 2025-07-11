// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Predicts potential network issues by analyzing historical data and current metrics.
 *
 * - predictNetworkIssues - A function that handles the prediction of network issues.
 * - PredictNetworkIssuesInput - The input type for the predictNetworkIssues function.
 * - PredictNetworkIssuesOutput - The return type for the predictNetworkIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictNetworkIssuesInputSchema = z.object({
  historicalData: z.string().describe('Historical network performance data, including metrics like latency, bandwidth, and error rates.'),
  currentMetrics: z.string().describe('Current network metrics, including device status, connection quality, and resource utilization.'),
});
export type PredictNetworkIssuesInput = z.infer<typeof PredictNetworkIssuesInputSchema>;

const PredictNetworkIssuesOutputSchema = z.object({
  potentialIssues: z.array(z.string()).describe('A list of potential network issues identified by the analysis.'),
  recommendations: z.array(z.string()).describe('A list of recommendations for addressing the potential network issues.'),
  confidenceLevel: z.number().describe('A confidence level (0-1) indicating the reliability of the predictions.'),
});
export type PredictNetworkIssuesOutput = z.infer<typeof PredictNetworkIssuesOutputSchema>;

export async function predictNetworkIssues(input: PredictNetworkIssuesInput): Promise<PredictNetworkIssuesOutput> {
  return predictNetworkIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictNetworkIssuesPrompt',
  input: {schema: PredictNetworkIssuesInputSchema},
  output: {schema: PredictNetworkIssuesOutputSchema},
  prompt: `You are an expert network administrator. Analyze the following historical network data and current metrics to predict potential network issues and provide recommendations.

Historical Data: {{{historicalData}}}

Current Metrics: {{{currentMetrics}}}

Based on this information, identify potential network issues, provide recommendations for addressing them, and indicate a confidence level for your predictions (0-1).

Format your response as a JSON object with 'potentialIssues' (array of strings), 'recommendations' (array of strings), and 'confidenceLevel' (number).`,
});

const predictNetworkIssuesFlow = ai.defineFlow(
  {
    name: 'predictNetworkIssuesFlow',
    inputSchema: PredictNetworkIssuesInputSchema,
    outputSchema: PredictNetworkIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
