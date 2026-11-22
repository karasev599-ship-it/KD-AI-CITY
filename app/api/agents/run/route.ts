import { timingSafeEqual } from 'node:crypto';
import { run } from '@openai/agents';
import { NextResponse } from 'next/server';
import { director } from '@/lib/agents';

export const runtime = 'nodejs';

function hasValidOwnerKey(request: Request) {
  const expectedKey = process.env.KD_AI_CITY_ACCESS_KEY;
  const authorization = request.headers.get('authorization') ?? '';

  if (!expectedKey || !authorization.startsWith('Bearer ')) return false;

  const suppliedKey = authorization.slice('Bearer '.length);
  const expected = Buffer.from(expectedKey);
  const supplied = Buffer.from(suppliedKey);

  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function POST(request: Request) {
  try {
    if (!process.env.KD_AI_CITY_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'AI Director закрыт: сначала задай KD_AI_CITY_ACCESS_KEY в серверных переменных окружения.' },
        { status: 503 }
      );
    }

    if (!hasValidOwnerKey(request)) {
      return NextResponse.json(
        { error: 'Ключ владельца не принят. Проверь его и попробуй ещё раз.' },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Добавь OPENAI_API_KEY в серверные переменные окружения. AI Director пока не подключён к модели.' },
        { status: 503 }
      );
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > 8192) {
      return NextResponse.json({ error: 'Запрос слишком большой.' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Некорректный JSON в запросе.' }, { status: 400 });
    }

    const task =
      typeof body === 'object' && body !== null && 'task' in body && typeof body.task === 'string'
        ? body.task.trim()
        : '';

    if (!task || task.length > 4000) {
      return NextResponse.json(
        { error: 'Задача должна содержать от 1 до 4000 символов.' },
        { status: 400 }
      );
    }

    const result = await run(director, task, { maxTurns: 8 });
    return NextResponse.json({
      output: result.finalOutput ?? 'Агент завершил запуск без текстового результата.',
    });
  } catch (error) {
    console.error('KD AI CITY agent error:', error);
    return NextResponse.json(
      { error: 'Ошибка запуска агента. Проверь API-ключ и серверные логи.' },
      { status: 500 }
    );
  }
}
