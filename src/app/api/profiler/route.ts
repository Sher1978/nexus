import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max allowed for Hobby plan

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `
Ты — проводник в проект Shadow Code. Твоя задача — распознать «Теневой Код» (психотип) собеседника через глубокий диалог.

ПРАВИЛА ВЗАИМОДЕЙСТВИЯ:
Правило 1: Никаких тестов с выбором ответа. Только открытые вопросы.
Правило 2: Анализируй структуру и семантику речи (как говорит), а не только смысл (что говорит).
Правило 3: Энергозатраты. Если ответ детальный — это сильная зона. Если шаблонный — слабая.
Правило 4: ЛИНЕЙНОСТЬ И ЗАПРЕТ ПОВТОРОВ. Тебе ЗАПРЕЩЕНО задавать один и тот же вопрос или дважды возвращаться к одной и той же теме (например, к Резонансу или Острову), даже если ответ был коротким. Если данных мало — переходи к следующей теме или меняй ракурс анализа, но не дублируй суть вопроса.
Правило 5: ПРИЗНАНИЕ ОШИБОК. Если пользователь говорит, что ты повторяешься — не оправдывайся «протоколом». Мгновенно переходи к ЭТАПУ 2 (Уточнение) или выдавай результат.

АЛГОРИТМ (ПРОТОКОЛ ДИАГНОСТИКИ):

ЭТАП 1: БАЗОВОЕ СКАНИРОВАНИЕ (Теги: База)
Пройдись по темам ниже. Задавай по 1 вопросу за раз. 
- Резонанс (Любимый персонаж/человек)
- Реакция (За что хвалят/критикуют)
- Остров (3 предмета в рюкзак 20л)
- Идеальное пространство / Темы интереса
НЕ задерживайся на этом этапе дольше 3-4 сообщений. Если затронул 3 темы — двигайся дальше.

ЭТАП 2: ПРИЦЕЛЬНАЯ ДОПРОВЕРКА (Теги: Уточнение)
Сформируй рабочую гипотезу Кода. Задай 1-2 ОСТРЫХ уточняющих вопроса для проверки дихотомий (Логика/Этика, Сенсорика/Интуиция, Экстра/Интро). Эти вопросы должны быть уникальными и основываться на предыдущих ответах.

ЭТАП 3: ФИНАЛИЗАЦИЯ
Когда картина ясна, выдай результат. Начало сообщения ОБЯЗАТЕЛЬНО: "АНАЛИЗ ЗАВЕРШЕН. ВАШ ТЕНЕВОЙ КОД:".

СТИЛЬ ОБЩЕНИЯ:
Shadow Code (Nexus) — цифровой минимализм, премиальность. Используй термины: Shadow Code, Карта Тени, Распознавание.
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
      "gemini-2.0-flash", 
      "gemini-1.5-flash",
      "gemini-1.5-pro"
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
          
          if (text) break; 
        } catch (error: any) {
          lastError = error;
          console.error(`Error with ${modelName} (retries left: ${retries}):`, error.message || error);
          
          if (error.message?.includes('429') || error.message?.includes('500') || error.message?.includes('503')) {
            retries--;
            if (retries > 0) {
              await new Promise(r => setTimeout(r, 1500)); 
              continue;
            }
          } else {
            break; 
          }
        }
      }
      if (text) break; 
    }

    if (!text) {
      throw lastError || new Error("All models failed to respond.");
    }

    const isCompleted = text.includes('АНАЛИЗ ЗАВЕРШЕН');
    
    if (sessionId) {
      const updatedMessages = [...messages, { role: 'assistant', content: text }];
      const resultArchetype = isCompleted ? (text.match(/ВАШ ТЕНЕВОЙ КОД: ([\wа-яА-ЯёЁ\s]+)/i)?.[1] || null) : null;

      const { data: sessionData, error: updateError } = await supabaseAdmin
        .from('induction_sessions')
        .update({
          conversation: updatedMessages,
          is_completed: isCompleted,
          result_archetype: resultArchetype && resultArchetype.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select('agent_id')
        .single();

      if (isCompleted && resultArchetype && sessionData?.agent_id) {
        await supabaseAdmin
          .from('agents')
          .update({ archetype: resultArchetype.trim() })
          .eq('id', sessionData.agent_id);
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
