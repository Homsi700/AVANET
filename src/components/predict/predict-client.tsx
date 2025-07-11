'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handlePrediction, PredictionState } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Lightbulb, AlertTriangle, CheckCircle, Percent, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';

const initialState: PredictionState = {};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin me-2" /> : <Lightbulb className="me-2" />}
            <span>تنبأ بالمشاكل</span>
        </Button>
    )
}

export function PredictClient() {
  const [state, formAction] = useFormState(handlePrediction, initialState);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>أداة التنبؤ بالشبكة بالذكاء الاصطناعي</CardTitle>
          <CardDescription>
            أدخل بيانات الشبكة التاريخية والمقاييس الحالية للحصول على تنبؤات حول المشاكل المحتملة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="historicalData">البيانات التاريخية</Label>
              <Textarea
                id="historicalData"
                name="historicalData"
                placeholder="مثال: متوسط الكمون خلال الأسبوع الماضي كان 50ms، ووصل استخدام النطاق الترددي إلى ذروته عند 80%..."
                rows={5}
                required
              />
              {state.errors?.historicalData && (
                 <p className="text-sm text-destructive">{state.errors.historicalData[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentMetrics">المقاييس الحالية</Label>
              <Textarea
                id="currentMetrics"
                name="currentMetrics"
                placeholder="مثال: حالة الجهاز: متصل، جودة الاتصال: 95%، استخدام الموارد: CPU 70%..."
                rows={5}
                required
              />
               {state.errors?.currentMetrics && (
                 <p className="text-sm text-destructive">{state.errors.currentMetrics[0]}</p>
              )}
            </div>

            {state.errors?._form && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{state.errors._form[0]}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.data && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>نتائج التحليل</CardTitle>
                <CardDescription>فيما يلي المشاكل المحتملة والتوصيات بناءً على البيانات المقدمة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center"><AlertTriangle className="me-2 text-destructive"/> المشاكل المحتملة</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {state.data.potentialIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center"><CheckCircle className="me-2 text-green-500"/> التوصيات</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {state.data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center"><Percent className="me-2 text-primary"/> مستوى الثقة</h3>
                    <div className="flex items-center gap-4">
                        <Progress value={state.data.confidenceLevel * 100} className="flex-1" />
                        <span className="font-bold text-lg text-primary">{(state.data.confidenceLevel * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
