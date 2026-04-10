export const SHADOW_CODE_NAMES: Record<string, string> = {
  'ENTP': 'Новатор',
  'ISFJ': 'Посредник',
  'ESFJ': 'Атташе',
  'INTP': 'Аналитик',
  'ESTP': 'Маршал',
  'INFP': 'Призрак',
  'ENFJ': 'Наставник',
  'ISTJ': 'Инспектор',
  'ESFP': 'Брокер',
  'INTJ': 'Стратег',
  'ENTJ': 'Директор',
  'ISFP': 'Хранитель',
  'ESTJ': 'Лидер',
  'INFJ': 'Гуманист',
  'ENFP': 'Советник',
  'ISTP': 'Мастер'
};

export type IntertypeProtocol = 
  | 'PM' | 'W' | 'Act' | 'Mir' | 'Id' 
  | 'Sup+' | 'Sup-' | 'Req+' | 'Req-' 
  | 'SD' | 'Mgr' | 'Bus' | 'Kin' | 'SE' | 'Ext' | 'QI';

export const PROTOCOL_NAMES: Record<IntertypeProtocol, string> = {
  'PM': 'Perfect Match (Дуальность)',
  'W': 'The Wall (Конфликт)',
  'Act': 'Activation (Активация)',
  'Mir': 'Mirror (Зеркало)',
  'Id': 'Identity (Тождество)',
  'Sup+': 'Supervisor (Ревизор)',
  'Sup-': 'Supervised (Подревизный)',
  'Req+': 'Requester (Заказчик)',
  'Req-': 'Recipient (Приемник)',
  'SD': 'Semi-Dual (Полудуальность)',
  'Mgr': 'Mirage (Мираж)',
  'Bus': 'Business (Деловые)',
  'Kin': 'Kindred (Родственные)',
  'SE': 'Super-Ego (Суперэго)',
  'Ext': 'Extinguishment (Погашение)',
  'QI': 'Quasi-Identity (Квазитождество)'
};

// Intertype Matrix (Rows: Self, Columns: Other)
export const SYNC_MATRIX: Record<string, Record<string, IntertypeProtocol>> = {
  'ENTP': { 'ENTP': 'Id', 'ISFJ': 'PM', 'ESFJ': 'Act', 'INTP': 'Mir', 'ESTP': 'Req+', 'INFP': 'SD', 'ENFJ': 'Bus', 'ISTJ': 'Sup+', 'ESFP': 'QI', 'INTJ': 'Ext', 'ENTJ': 'Sup-', 'ISFP': 'W', 'ESTJ': 'Req-', 'INFJ': 'Mgr', 'ENFP': 'Kin', 'ISTP': 'SE' },
  'ISFJ': { 'ENTP': 'PM', 'ISFJ': 'Id', 'ESFJ': 'Mir', 'INTP': 'Act', 'ESTP': 'SD', 'INFP': 'Req+', 'ENFJ': 'Sup+', 'ISTJ': 'Bus', 'ESFP': 'Ext', 'INTJ': 'QI', 'ENTJ': 'W', 'ISFP': 'Sup-', 'ESTJ': 'Mgr', 'INFJ': 'Req-', 'ENFP': 'SE', 'ISTP': 'Kin' },
  'ESFJ': { 'ENTP': 'Act', 'ISFJ': 'Mir', 'ESFJ': 'Id', 'INTP': 'PM', 'ESTP': 'Bus', 'INFP': 'Sup-', 'ENFJ': 'Req+', 'ISTJ': 'SD', 'ESFP': 'Sup+', 'INTJ': 'W', 'ENTJ': 'QI', 'ISFP': 'Ext', 'ESTJ': 'Req-', 'INFJ': 'Kin', 'ENFP': 'Mgr', 'ISTP': 'SE' },
  'INTP': { 'ENTP': 'Mir', 'ISFJ': 'Act', 'ESFJ': 'PM', 'INTP': 'Id', 'ESTP': 'Sup-', 'INFP': 'Bus', 'ENFJ': 'SD', 'ISTJ': 'Req+', 'ESFP': 'W', 'INTJ': 'Sup+', 'ENTJ': 'Ext', 'ISFP': 'QI', 'ESTJ': 'Kin', 'INFJ': 'Req-', 'ENFP': 'SE', 'ISTP': 'Mgr' },
  'ESTP': { 'ENTP': 'Req-', 'ISFJ': 'SD', 'ESFJ': 'Bus', 'INTP': 'Sup+', 'ESTP': 'Id', 'INFP': 'PM', 'ENFJ': 'Act', 'ISTJ': 'Mir', 'ESFP': 'Req+', 'INTJ': 'SD', 'ENTJ': 'Bus', 'ISFP': 'Sup+', 'ESTJ': 'QI', 'INFJ': 'Ext', 'ENFP': 'Sup-', 'ISTP': 'W' },
  'INFP': { 'ENTP': 'SD', 'ISFJ': 'Req-', 'ESFJ': 'Sup+', 'INTP': 'Bus', 'ESTP': 'PM', 'INFP': 'Id', 'ENFJ': 'Mir', 'ISTJ': 'Act', 'ESFP': 'SD', 'INTJ': 'Req+', 'ENTJ': 'Sup+', 'ISFP': 'Bus', 'ESTJ': 'Ext', 'INFJ': 'QI', 'ENFP': 'W', 'ISTP': 'Sup-' },
  'ENFJ': { 'ENTP': 'Bus', 'ISFJ': 'Sup-', 'ESFJ': 'Req-', 'INTP': 'SD', 'ESTP': 'Act', 'INFP': 'Mir', 'ENFJ': 'Id', 'ISTJ': 'PM', 'ESFP': 'Bus', 'INTJ': 'Sup-', 'ENTJ': 'Req+', 'ISFP': 'SD', 'ESTJ': 'Sup+', 'INFJ': 'W', 'ENFP': 'QI', 'ISTP': 'Ext' },
  'ISTJ': { 'ENTP': 'Sup-', 'ISFJ': 'Bus', 'ESFJ': 'SD', 'INTP': 'Req-', 'ESTP': 'Mir', 'INFP': 'Act', 'ENFJ': 'PM', 'ISTJ': 'Id', 'ESFP': 'Sup-', 'INTJ': 'Bus', 'ENTJ': 'SD', 'ISFP': 'Req+', 'ESTJ': 'W', 'INFJ': 'Sup+', 'ENFP': 'Ext', 'ISTP': 'QI' },
  'ESFP': { 'ENTP': 'QI', 'ISFJ': 'Ext', 'ESFJ': 'Sup-', 'INTP': 'W', 'ESTP': 'Req-', 'INFP': 'SD', 'ENFJ': 'Bus', 'ISTJ': 'Sup+', 'ESFP': 'Id', 'INTJ': 'PM', 'ENTJ': 'Act', 'ISFP': 'Mir', 'ESTJ': 'Req+', 'INFJ': 'SD', 'ENFP': 'Bus', 'ISTP': 'Sup+' },
  'INTJ': { 'ENTP': 'Ext', 'ISFJ': 'QI', 'ESFJ': 'W', 'INTP': 'Sup-', 'ESTP': 'SD', 'INFP': 'Req-', 'ENFJ': 'Sup+', 'ISTJ': 'Bus', 'ESFP': 'PM', 'INTJ': 'Id', 'ENTJ': 'Mir', 'ISFP': 'Act', 'ESTJ': 'SD', 'INFJ': 'Req+', 'ENFP': 'Sup+', 'ISTP': 'Bus' },
  'ENTJ': { 'ENTP': 'Sup+', 'ISFJ': 'W', 'ESFJ': 'QI', 'INTP': 'Ext', 'ESTP': 'Bus', 'INFP': 'Sup-', 'ENFJ': 'Req-', 'ISTJ': 'SD', 'ESFP': 'Act', 'INTJ': 'Mir', 'ENTJ': 'Id', 'ISFP': 'PM', 'ESTJ': 'Bus', 'INFJ': 'Sup-', 'ENFP': 'Req+', 'ISTP': 'SD' },
  'ISFP': { 'ENTP': 'W', 'ISFJ': 'Sup+', 'ESFJ': 'Ext', 'INTP': 'QI', 'ESTP': 'Sup-', 'INFP': 'Bus', 'ENFJ': 'SD', 'ISTJ': 'Req-', 'ESFP': 'Mir', 'INTJ': 'Act', 'ENTJ': 'PM', 'ISFP': 'Id', 'ESTJ': 'Sup-', 'INFJ': 'Bus', 'ENFP': 'SD', 'ISTP': 'Req+' },
  'ESTJ': { 'ENTP': 'Req+', 'ISFJ': 'Mgr', 'ESFJ': 'Req+', 'INTP': 'Kin', 'ESTP': 'QI', 'INFP': 'Ext', 'ENFJ': 'Sup-', 'ISTJ': 'W', 'ESFP': 'Req-', 'INTJ': 'SD', 'ENTJ': 'Bus', 'ISFP': 'Sup+', 'ESTJ': 'Id', 'INFJ': 'PM', 'ENFP': 'Act', 'ISTP': 'Mir' },
  'INFJ': { 'ENTP': 'Mgr', 'ISFJ': 'Req+', 'ESFJ': 'Kin', 'INTP': 'Req+', 'ESTP': 'Ext', 'INFP': 'QI', 'ENFJ': 'W', 'ISTJ': 'Sup-', 'ESFP': 'SD', 'INTJ': 'Req-', 'ENTJ': 'Sup+', 'ISFP': 'Bus', 'ESTJ': 'PM', 'INFJ': 'Id', 'ENFP': 'Mir', 'ISTP': 'Act' },
  'ENFP': { 'ENTP': 'Kin', 'ISFJ': 'SE', 'ESFJ': 'Mgr', 'INTP': 'SE', 'ESTP': 'Sup+', 'INFP': 'W', 'ENFJ': 'QI', 'ISTJ': 'Ext', 'ESFP': 'Bus', 'INTJ': 'Sup-', 'ENTJ': 'Req-', 'ISFP': 'SD', 'ESTJ': 'Act', 'INFJ': 'Mir', 'ENFP': 'Id', 'ISTP': 'PM' },
  'ISTP': { 'ENTP': 'SE', 'ISFJ': 'Kin', 'ESFJ': 'SE', 'INTP': 'Mgr', 'ESTP': 'W', 'INFP': 'Sup+', 'ENFJ': 'Ext', 'ISTJ': 'QI', 'ESFP': 'Sup-', 'INTJ': 'Bus', 'ENTJ': 'SD', 'ISFP': 'Req-', 'ESTJ': 'Mir', 'INFJ': 'Act', 'ENFP': 'PM', 'ISTP': 'Id' }
};


export type Quadra = 'Alpha' | 'Beta' | 'Gamma' | 'Delta';

export const TYPE_QUADRA: Record<string, Quadra> = {
  'ENTP': 'Alpha', 'ISFJ': 'Alpha', 'ESFJ': 'Alpha', 'INTP': 'Alpha',
  'ESTP': 'Beta', 'INFP': 'Beta', 'ENFJ': 'Beta', 'ISTJ': 'Beta',
  'ESFP': 'Gamma', 'INTJ': 'Gamma', 'ENTJ': 'Gamma', 'ISFP': 'Gamma',
  'ESTJ': 'Delta', 'INFJ': 'Delta', 'ENFP': 'Delta', 'ISTP': 'Delta',
};

export const QUADRA_DATA: Record<Quadra, { 
  name: string, 
  values: string, 
  description: string, 
  strengths: string, 
  shadows: string,
  business: string,
  life: string,
  color: string,
  accent: string
}> = {
  'Alpha': {
    name: 'Альфа',
    values: 'Ne, Ti, Fe, Si',
    description: 'Квадра «изобретателей» и просветителей. Демократические ценности, свободный обмен идеями, интеллектуальные дискуссии и атмосфера физического комфорта («Хакуна Матата»).',
    strengths: 'Генерация нестандартных идей, глобальные теории, позитивный эмоциональный фон, уютный быт.',
    shadows: 'Недостаток жесткой пробивной силы, идеи могут оставаться на уровне мысленных экспериментов.',
    business: 'Идеально для стартапов, мозговых штурмов и концепций. Требуется творческая, расслабленная среда.',
    life: 'Интеллектуальный резонанс, гедонизм и взаимная забота. Важно избегать волевого давления.',
    color: '#00F2FF',
    accent: 'rgba(0, 242, 255, 0.2)'
  },
  'Beta': {
    name: 'Бета',
    values: 'Se, Ni, Fe, Ti',
    description: 'Квадра «борцов» и организаторов. Коллективные цели, иерархия, авторитет власти и идеологическая борьба. Решительное изменение мира.',
    strengths: 'Волевой напор, смелость, способность вдохновлять массы и внедрять проекты с железной дисциплиной.',
    shadows: 'Жесткий диктат, излишний драматизм и агрессия. Могут игнорировать индивидуальные слабости людей.',
    business: 'Антикризисное управление, завоевание рынков. Требуются амбициозные вызовы и четкая иерархия.',
    life: 'Глубокие переживания, совместное преодоление трудностей. Поиск партнера-соратника.',
    color: '#E000FF',
    accent: 'rgba(224, 0, 255, 0.2)'
  },
  'Gamma': {
    name: 'Гамма',
    values: 'Se, Te, Ni, Fi',
    description: 'Квадра «предпринимателей» и прагматиков. Долгосрочный стратегический прагматизм, независимость и личные достижения.',
    strengths: 'Выживание в конкуренции, коммерциализация идей, проницательность в оценке людей и лояльность.',
    shadows: 'Чрезмерная расчетливость, подозрительность и безжалостность к тем, кто не оправдал доверия.',
    business: 'Реформирование и оптимизация процессов, извлечение прибыли в конкурентной среде.',
    life: 'Глубокая личная преданность и взаимоуважение. Равноправные союзы без попыток подчинения.',
    color: '#FFD700',
    accent: 'rgba(255, 215, 0, 0.2)'
  },
  'Delta': {
    name: 'Дельта',
    values: 'Ne, Te, Fi, Si',
    description: '«Стабилизационная» квадра индивидуалистов и гуманистов. Трудовая этика, самодостаточность и вера в потенциал человека.',
    strengths: 'Доведение продуктов до совершенства, высокое качество работы, дипломатичность и гуманизм.',
    shadows: 'Избегание агрессивной борьбы, недостаток пробивной энергии, возможное морализаторство.',
    business: 'Шлифовка технологий, стабилизация процессов, создание экологичной рабочей среды.',
    life: 'Межличностное доверие, помощь партнеру в становлении «лучшей версией себя». Покой и уют.',
    color: '#00FF94',
    accent: 'rgba(0, 255, 148, 0.2)'
  }
};

export const getProtocol = (self: string, other: string): IntertypeProtocol | null => {
  return SYNC_MATRIX[self]?.[other] || null;
};

export const getTacticalPartners = (code: string) => {
  const row = SYNC_MATRIX[code];
  if (!row) return [];

  const keyProtocols: IntertypeProtocol[] = ['PM', 'Act', 'Sup+', 'W'];
  
  return Object.entries(row)
    .filter(([_, protocol]) => keyProtocols.includes(protocol))
    .map(([partnerCode, protocol]) => ({
      code: partnerCode,
      name: SHADOW_CODE_NAMES[partnerCode],
      protocol,
      protocolName: PROTOCOL_NAMES[protocol]
    }))
    .sort((a, b) => {
      const order = { 'PM': 0, 'Act': 1, 'Sup+': 2, 'W': 3 };
      return order[a.protocol as keyof typeof order] - order[b.protocol as keyof typeof order];
    });
};

export const QUADRA_COMPATIBILITY = [
  {
    pair: 'Внутри одной квадры',
    level: 'Очень высокий',
    strengths: 'Общая система ценностей, глубокое взаимопонимание, ощущение «своих» людей.',
    weaknesses: 'Возможная нехватка дополняющих качеств (например, если нет сенсорика или логика).',
    advice: 'Идеально для долгосрочных отношений и глубокого доверительного партнерства.'
  },
  {
    pair: 'Противоположные квадры',
    level: 'Сложный',
    strengths: 'Высокая интенсивность и результативность на коротких рывках.',
    weaknesses: 'Противоречивые ценности, риск конфликтов при длительном контакте.',
    advice: 'Требуется четкое разделение зон ответственности и уважение к границам.'
  },
  {
    pair: 'Смежные квадры',
    level: 'Хороший',
    strengths: 'Продуктивное деловое взаимодействие, хорошее понимание в рабочих вопросах.',
    weaknesses: 'Различия в глобальных целях и методах достижения успеха.',
    advice: 'Эффективно для совместных проектов и профессионального сотрудничества.'
  }
];

export type QuadraType = Quadra;
