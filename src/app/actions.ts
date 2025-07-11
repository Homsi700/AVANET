
'use server';

import { predictNetworkIssues, PredictNetworkIssuesOutput } from '@/ai/flows/predict-network-issues';
import { addDevice, addPppoeUser, deleteDeviceById, updateDeviceById } from '@/lib/data';
import type { Device } from '@/lib/types';
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

// Custom Zod preprocessor to split IP and port
const ipWithPortSchema = z.string().transform((val, ctx) => {
    const [ip, port] = val.split(':');
    const ipValidation = z.string().ip().safeParse(ip);
    if (!ipValidation.success) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "عنوان IP غير صالح.",
        });
        return z.NEVER;
    }
    return { ip, port: port ? parseInt(port, 10) : undefined };
});


const serverSchema = z.object({
  id: z.string().optional(),
  type: z.literal('server').or(z.literal('MikroTik')),
  name: z.string().min(1, { message: 'الاسم مطلوب.' }),
  ip: z.string().min(1, { message: 'عنوان IP مطلوب.' }),
  port: z.coerce.number().optional(),
  username: z.string().min(1, { message: 'اسم المستخدم مطلوب.' }),
  password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
}).superRefine((data, ctx) => {
    if (data.ip.includes(':')) {
        const [ip, portStr] = data.ip.split(':');
        const ipValidation = z.string().ip().safeParse(ip);
        if (!ipValidation.success) {
             ctx.addIssue({
                path: ['ip'],
                code: z.ZodIssueCode.custom,
                message: "الجزء الخاص بعنوان IP غير صالح.",
            });
        }
        const portNumber = parseInt(portStr, 10);
        if (portStr && (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535)) {
            ctx.addIssue({
                path: ['ip'],
                code: z.ZodIssueCode.custom,
                message: "الجزء الخاص بالمنفذ غير صالح.",
            });
        }
    } else {
        const ipValidation = z.string().ip().safeParse(data.ip);
        if (!ipValidation.success) {
             ctx.addIssue({
                path: ['ip'],
                code: z.ZodIssueCode.custom,
                message: "عنوان IP غير صالح.",
            });
        }
    }
});


const dishSchema = z.object({
    id: z.string().optional(),
    type: z.literal('dish').or(z.literal('UBNT')).or(z.literal('Mimosa')),
    name: z.string().min(1, { message: 'الاسم مطلوب.' }),
    ip: z.string().ip({ message: 'عنوان IP غير صالح.' }),
    username: z.string().min(1, { message: 'اسم المستخدم مطلوب.' }),
    password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
});

export type DeviceFormState = {
    errors?: {
        name?: string[];
        ip?: string[];
        port?: string[];
        username?: string[];
        password?: string[];
        _form?: string[];
    };
    message?: string;
};

export async function handleAddDevice(prevState: any, formData: FormData): Promise<DeviceFormState> {
    const deviceType = formData.get('type') === 'server' ? 'server' : 'dish';
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


export async function handleUpdateDevice(prevState: any, formData: FormData): Promise<DeviceFormState> {
    const rawFormData = Object.fromEntries(formData.entries());
    const deviceType = rawFormData.type === 'MikroTik' ? 'server' : 'dish';
    const schema = deviceType === 'server' ? serverSchema : dishSchema;
    
    const validatedFields = schema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { id, ...deviceData } = validatedFields.data;

    if (!id) {
         return { errors: { _form: ['معرف الجهاز مفقود.'] } };
    }

    try {
        await updateDeviceById(id, deviceData as Partial<Device>);
        revalidatePath('/');
        revalidatePath('/devices');
        return { message: `تم تحديث الجهاز "${validatedFields.data.name}" بنجاح.` };
    } catch (error: any) {
        console.error(error);
        return {
            errors: { _form: [error.message || 'حدث خطأ غير متوقع أثناء تحديث الجهاز.'] },
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

export async function handleDeleteDevice(deviceId: string) {
    try {
        await deleteDeviceById(deviceId);
        revalidatePath('/');
        revalidatePath('/devices');
        return { success: true, message: 'تم حذف الجهاز بنجاح.' };
    } catch (error: any) {
        console.error(error);
        return { success: false, message: error.message || 'حدث خطأ أثناء حذف الجهاز.' };
    }
}
