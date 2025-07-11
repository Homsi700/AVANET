'use server';

import { predictNetworkIssues, PredictNetworkIssuesOutput } from '@/ai/flows/predict-network-issues';
import { z } from 'zod';

const predictionSchema = z.object({
  historicalData: z.string().min(20, { message: 'البيانات التاريخية قصيرة جدًا.' }),
  currentMetrics: z.string().min(20, { message: 'المقاييس الحالية قصيرة جدًا.' }),
});

export type PredictionState = {
    errors?: {
        historicalData?: string[];
        currentMetrics?: string[];
        _form?: string[];
    };
    data?: PredictNetworkIssuesOutput;
}


export async function handlePrediction(prevState: PredictionState, formData: FormData): Promise<PredictionState> {
  const validatedFields = predictionSchema.safeParse({
    historicalData: formData.get('historicalData'),
    currentMetrics: formData.get('currentMetrics'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await predictNetworkIssues(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ['حدث خطأ غير متوقع أثناء معالجة الطلب.'] },
    };
  }
}
