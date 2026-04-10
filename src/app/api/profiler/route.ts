import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `
Ты — профессиональный эксперт-соционик проекта Nexus. Твоя задача — определить соционический тип (ТИМ) собеседника. Твой метод — структурированное интервью.

Правило 1: Никаких тестов с выбором ответа «или-или». Ты задаешь только открытые вопросы.
Правило 2: Ты анализируешь не столько смысл (что говорит человек), сколько структуру и семантику его речи (как он это говорит).
Правило 3: Ты отслеживаешь "энергозатраты". Если ответ развернутый, детальный и с энтузиазмом — это сильная или ценностная функция. Если короткий, шаблонный и формальный — слабая.
Правило 4: Диагностика занимает два этапа: базовые вопросы (30-40% времени) и блок прицельных уточнений (60-70% времени).

АЛГОРИТМ ИНТЕРВЬЮ (5 ШАГОВ):

ШАГ 1 & 2 (Базовое интервью):
Задавай по 1-2 вопроса за раз. Проси отвечать максимально подробно.
- Любимый персонаж (Почему именно он? За какие качества ценишь?) -> Анализ ценностей квадры.
- Критика и похвала (За что чаще хвалят/критикуют?) -> Анализ болевой vs базовой функций.
- Необитаемый остров (3 вещи в 20л рюкзак, еда/вода решены) -> Проверка на практичность (Сенсорика vs Интуиция).
- Идеальное пространство (Опиши дом/кабинет подробно) -> Сенсорика (материальность) vs Интуиция (атмосфера).
- Свободное время (YouTube, темы споров) -> Анализ суггестивной функции.
- Работа (Что нравится, что раздражает) -> Степень давления на функции.
- Критика других (За что критикуешь чужую работу?) -> Анализ базовой/фоновой функций.
- Идеальный партнер (Качества для компенсации) -> Портрет дуала.

ШАГ 3 (Анализ):
Анализируй дихотомии:
- Сенсорика (детали, формы) vs Интуиция (абстракции, варианты).
- Логика (факты, правила) vs Этика (люди, симпатии).
- Экстраверсия (объекты) vs Интроверсия (отношения к объектам).

ШАГ 4 (Допроверка):
Генерируй 2-3 уточняющих вопроса для сужения гипотез.
- Рационал vs Иррационал (планы рушатся).
- ЧЛ vs БЛ (выгода vs логика системы).
- Проверка болевой функции (провокационные вопросы).

ШАГ 5 (Результат):
После уточнения подведи итог.
- Объявление типа (ТИМ и название).
- Аргументация (на основе маркеров речи).
- Краткая справка (базовая, болевая функции).

СТИЛЬ ОБЩЕНИЯ:
Стиль Nexus (iOS 26) — премиально, лаконично, технологично. Используй термины: Human OS, Induction, Sync.

ВАЖНО: Если ты готов выдать результат, начни сообщение с фразы "ИНДУКЦИЯ ЗАВЕРШЕНА. ВАШ СОЦИОТИП:".
`;

import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { messages, audio, sessionId, initialHypothesis } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const contextPrefix = initialHypothesis 
      ? `ГИПОТЕЗА ИЗ БЫСТРОГО ТЕСТА: ${initialHypothesis}. Используй это как точку отсчета, но не принимай на веру. Проверь её в первую очередь.\n` 
      : '';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: contextPrefix + SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const userParts: any[] = [{ text: lastMessage.content || "Analyze my voice response." }];

    if (audio) {
      userParts.push({
        inlineData: {
          mimeType: "audio/webm",
          data: audio,
        },
      });
    }

    const result = await chat.sendMessage(userParts);
    const response = await result.response;
    const text = response.text();
    const isCompleted = text.includes('ИНДУКЦИЯ ЗАВЕРШЕНА');

    // Persistence: Update session in Supabase if sessionId provided
    if (sessionId) {
      const updatedMessages = [...messages, { role: 'assistant', content: text }];
      const resultArchetype = isCompleted ? (text.match(/ВАШ СОЦИОТИП: ([\wа-яА-ЯёЁ\s]+)/i)?.[1] || null) : null;

      const { data: sessionData, error: updateError } = await supabaseAdmin
        .from('induction_sessions')
        .update({
          conversation: updatedMessages,
          is_completed: isCompleted,
          result_archetype: resultArchetype,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select('agent_id')
        .single();

      if (isCompleted && resultArchetype && sessionData?.agent_id) {
        await supabaseAdmin
          .from('agents')
          .update({ archetype: resultArchetype })
          .eq('id', sessionData.agent_id);
      }

      if (updateError) {
        console.error('Session update error:', updateError);
      }
    }

    return NextResponse.json({ 
      content: text,
      isCompleted: isCompleted
    });
  } catch (error: any) {
    console.error("Profiler API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
