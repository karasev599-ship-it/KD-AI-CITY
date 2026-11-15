import { Agent, run } from '@openai/agents';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
const director = new Agent({
  name: 'KD AI Director',
  instructions: 'Ты — главный директор виртуальной компании KD AI CITY. Получив поручение владельца, определи подходящий отдел, составь конкретный план и выдай полезный результат. Не утверждай, что выполнил внешнее действие, если инструмент реально его не выполнял. Не выдумывай факты. Для финансовых, публикационных, destructive и иных внешних действий требуй подтверждение владельца. Отвечай по-русски, структурированно и по делу.'
});
export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Добавь OPENAI_API_KEY в .env.local и Vercel Environment Variables. Агент пока не подключён к модели.' }, { status: 503 });
    const body = await request.json();
    const task = typeof body.task === 'string' ? body.task.trim() : '';
    if (!task || task.length > 4000) return NextResponse.json({ error: 'Задача должна содержать от 1 до 4000 символов.' }, { status: 400 });
    const result = await run(director, task);
    return NextResponse.json({ output: result.finalOutput ?? 'Агент завершил запуск без текстового результата.' });
  } catch (error) {
    console.error('KD AI CITY agent error:', error);
    return NextResponse.json({ error: 'Ошибка запуска агента. Проверь API-ключ и серверные логи.' }, { status: 500 });
  }
}
