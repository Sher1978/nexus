import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max allowed for Hobby plan

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `
Ты — проводник в проект Shadow Code. Твоя задача — распознать «Теневой Код» (психотип) собеседника. Твой метод — через глубокий диалог.

Правило 1: Никаких тестов с выбором ответа «или-или». Ты задаешь только открытые вопросы.
Правило 2: Ты анализируешь не столько смысл (что говорит человек), сколько структуру и семантику его речи (как он это говорит).
Правило 3: Ты отслеживаешь "энергозатраты". Если ответ развернутый, детальный и с энтузиазмом — это сильная или ценностная зона. Если короткий, шаблонный и формальный — слабая.
Правило 4: Процесс распознавания занимает два этапа: базовое сканирование (30-40% времени) и блок прицельных уточнений (60-70% времени) для финальной сборки Карты Тени.

АЛГОРИТМ (5 ШАГОВ):

ШАГ 1 & 2 (Базовое сканирование):
Задавай по 1-2 вопроса за раз. Проси отвечать максимально подробно.
- Резонанс (Любимый персонаж/человек? За какие качества ценишь?) -> Анализ ценностей.
- Реакция (За что чаще хвалят/критикуют?) -> Анализ болевых точек vs опорных зон.
- Стратегия выживания (3 вещи в 20л рюкзак на остров) -> Проверка на практичность.
- Идеальное пространство (Опиши дом/кабинет подробно) -> Сенсорика vs Интуиция.
- Темы интереса (YouTube, темы споров) -> Анализ скрытых стимулов.

ШАГ 3 (Анализ данных):
Анализируй дихотомии: Логика vs Этика, Сенсорика vs Интуиция, Экстраверсия vs Интроверсия.

ШАГ 4 (Допроверка):
Генерируй 2-3 уточняющих вопроса для сужения гипотез Карты Тени.

ШАГ 5 (Результат):
После уточнения подведи итог.
- Объявление кода (Название типа и суть).
- Аргументация (почему именно этот код).
- Краткая справка по Теневому Коду.

СТИЛЬ ОБЩЕНИЯ:
Стиль Shadow Code (Nexus) — цифровой минимализм, премиальность, технологичность. Используй термины: Shadow Code, Карта Тени, Распознавание.

ВАЖНО: Если ты готов выдать результат, начни сообщение с фразы "АНАЛИЗ ЗАВЕРШЕН. ВАШ ТЕНЕВОЙ КОД:".
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

    const MODELS_TO_TRY = [
      "gemini-2.5-flash", 
      "gemini-2.5-pro", 
      "gemini-2.0-flash-lite-preview-02-05",
      "gemini-2.0-flash"
    ];
    let text = "";
    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
      let retries = 2;
      while (retries > 0) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
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
                mimeType: "audio/ogg",
                data: audio,
              },
            });
          }

          const result = await chat.sendMessage(userParts);
          const response = await result.response;
          text = response.text();
          
          if (text) break; // Success!
        } catch (error: any) {
          lastError = error;
          console.error(`Error with ${modelName} (retries left: ${retries}):`, error.message);
          
          // Only retry on quota (429) or transient errors
          if (error.message?.includes('429') || error.message?.includes('500') || error.message?.includes('503')) {
            retries--;
            if (retries > 0) {
              await new Promise(r => setTimeout(r, 1500)); // Wait 1.5s before retry
              continue;
            }
          } else {
            break; // Non-retryable error, try next model
          }
        }
      }
      if (text) break; // If we got a result, stop trying models
    }

    if (!text) {
      throw lastError || new Error("All models failed to respond.");
    }

    const isCompleted = text.includes('АНАЛИЗ ЗАВЕРШЕН');
    
    // Persistence: Update session in Supabase if sessionId provided
    if (sessionId) {
      const updatedMessages = [...messages, { role: 'assistant', content: text }];
      const resultArchetype = isCompleted ? (text.match(/ВАШ ТЕНЕВОЙ КОД: ([\wа-яА-ЯёЁ\s]+)/i)?.[1] || null) : null;

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
