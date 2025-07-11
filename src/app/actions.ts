'use server';

import { predictNetworkIssues, PredictNetworkIssuesOutput } from '@/ai/flows/predict-network-issues';
import { addDevice, addPppoeUser } from '@/lib/data';
import { revalidatePath } from 'next/cache';
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

const serverSchema = z.object({
  type: z.literal('server'),
  name: z.string().min(1, { message: 'الاسم مطلوب.' }),
  ip: z.string().ip({ message: 'عنوان IP غير صالح.' }),
  port: z.coerce.number().optional(),
  username: z.string().min(1, { message: 'اسم المستخدم مطلوب.' }),
  password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
});

const dishSchema = z.object({
    type: z.literal('dish'),
    name: z.string().min(1, { message: 'الاسم مطلوب.' }),
    ip: z.string().ip({ message: 'عنوان IP غير صالح.' }),
    username: z.string().min(1, { message: 'اسم المستخدم مطلوب.' }),
    password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
});

export async function handleAddDevice(prevState: any, formData: FormData): Promise<{ errors?: any; message?: string; }> {
    const deviceType = formData.get('type');
    const schema = deviceType === 'server' ? serverSchema : dishSchema;

    const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addDevice(validatedFields.data as any);
        revalidatePath('/');
        revalidatePath('/devices');
        return { message: `تمت إضافة الجهاز "${validatedFields.data.name}" بنجاح.` };
    } catch (error: any) {
        console.error(error);
        return {
            errors: { _form: [error.message || 'حدث خطأ غير متوقع أثناء إضافة الجهاز.'] },
        };
    }
}

const pppoeUserSchema = z.object({
    serverId: z.string(),
    username: z.string().min(1, "اسم المستخدم مطلوب."),
    password: z.string().min(1, "كلمة المرور مطلوبة."),
    service: z.string().min(1, "الخدمة مطلوبة."),
    profile: z.string().min(1, "البروفايل مطلوب."),
});


export async function handleAddPppoeUser(prevState: any, formData: FormData): Promise<{ errors?: any; message?: string; }> {
    const validatedFields = pppoeUserSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addPppoeUser(validatedFields.data);
        revalidatePath(`/servers/${validatedFields.data.serverId}`);
        return { message: `تمت إضافة المستخدم ${validatedFields.data.username} بنجاح.` };
    } catch (error: any) {
        console.error(error);
        return {
            errors: { _form: [error.message || 'حدث خطأ غير متوقع أثناء إضافة المستخدم.'] },
        };
    }
}
