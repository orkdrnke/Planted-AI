import { PLANT_TYPES, PlantType } from "@/lib/constants";

// Stored plant type values stay English (data and image file names); only their labels are translated
const plantTypeLabels: Record<PlantType, string> = {
  [PLANT_TYPES.VEGETABLE]: "Овочеві рослини",
  [PLANT_TYPES.FLOWERING]: "Квітучі",
  [PLANT_TYPES.ORNAMENTAL]: "Декоративні",
  [PLANT_TYPES.INDOOR]: "Кімнатні рослини",
  [PLANT_TYPES.BERRY]: "Ягідні рослини",
};

// All Ukrainian UI text lives here (ADR-0003); components import from this module.
export const uiStrings = {
  plantTypeLabel: (type: string) =>
    type in plantTypeLabels ? plantTypeLabels[type as PlantType] : type,
  header: {
    logoAlt: "Логотип Planted AI",
    myGarden: "Мій сад",
    addPlant: "Додати рослину",
  },
  landing: {
    title: "Ласкаво просимо до вашого цифрового саду",
    getStartedBefore: "Почніть із додавання рослин на сторінці",
    getStartedLink: "Мій сад",
    aiTips: "Додавайте рослини до списку й отримуйте поради з догляду, згенеровані ШІ",
    myGarden: "Мій сад",
    searchPlants: "Пошук рослин (незабаром)",
    takePhoto: "Фото рослини (незабаром)",
    vercelAlt: "Логотип Vercel",
    about: "Про Planted AI",
    calendar: "Календар",
    notifications: "Сповіщення",
  },
  addPlantForm: {
    title: "Додати нову рослину",
    name: {
      label: "Назва рослини",
      placeholder: "назва",
      description: "Це назва вашої рослини",
      tooShort: "Назва має містити щонайменше 3 символи",
    },
    type: {
      label: "Тип рослини",
      placeholder: "Оберіть тип",
      description: "Оберіть тип рослини",
      required: "Оберіть тип рослини",
    },
    size: {
      label: "Розмір",
      placeholder: "розмір",
      description: "Наскільки вона велика",
    },
    amount: {
      label: "Кількість",
      placeholder: "кількість",
      description: "Скільки рослин",
    },
    dest: {
      label: "Призначення",
      placeholder: "призначення",
      description: "Для вулиці чи для кімнати?",
      tooShort: "Призначення має містити щонайменше 5 символів",
    },
    price: {
      label: "Ціна",
      placeholder: "ціна",
      description: "Скільки вона коштувала",
    },
    dateAdded: {
      label: "Дата додавання",
      placeholder: "дата додавання",
      description: "Коли ви додали цю рослину до колекції?",
    },
    submit: "Додати",
  },
  dashboard: {
    title: "Мій сад",
    addPlant: "Додати рослину",
    columns: {
      name: "Назва",
      type: "Тип",
      location: "Місце",
      watering: "Полив",
      light: "Світло",
    },
  },
  status: {
    label: "Стан колекції",
    total: (count: number) => `Рослин: ${count}`,
    ready: (count: number) => `Готово: ${count}`,
    generating: (count: number) => `Генерується: ${count}`,
    failed: (count: number) => `Помилка: ${count}`,
  },
  careTipState: {
    ready: "Готово",
    generating: "Генерується",
    failed: "Помилка",
  },
  // Watering and light cells of a plant without stored tips
  cell: {
    generating: "Очікується",
    failed: "Недоступно",
    noLocation: "—",
  },
  emptyState: {
    title: "У вашому саду ще немає рослин",
    description: "Додайте першу рослину, щоб отримати поради з догляду.",
    action: "Додати першу рослину",
  },
  plantPage: {
    back: "До саду",
    botanicalName: "Ботанічна назва",
    regenerate: "Згенерувати знову",
    generating: "Поради з догляду готуються…",
    failed: "Не вдалося створити поради з догляду.",
    retry: "Спробувати ще",
    remove: "Видалити рослину",
    sections: {
      category: "Категорія",
      watering: "Полив",
      light: "Світло",
      temperature: "Температура",
      soil: "Ґрунт",
      careTips: "Поради",
    },
    sidebar: {
      lastWatered: "Востаннє поливали",
      noWateringInfo: "Немає даних",
      lastWateredOn: (date: string) => `Востаннє поливали: ${date}`,
      daysSince: (days: number) => `Днів відтоді: ${days}`,
      nextFertilization: "Наступне підживлення",
      notPlanned: "не заплановано",
      additionalDetails: "Додатково",
      size: "Розмір",
      sizeValue: (size: string) => `${size} см`,
      price: "Ціна",
      location: "Місце",
      amount: "Кількість",
      notes: "Нотатки",
      noNotes: "Немає нотаток",
    },
  },
  notFound: {
    title: "Рослину не знайдено 🌱",
    back: "Повернутися до саду",
  },
  removeDialog: {
    title: (name: string) => `Видалити «${name}»?`,
    description: "Рослину буде видалено з вашого саду. Цю дію не можна скасувати.",
    cancel: "Скасувати",
    confirm: "Видалити",
  },
} as const;
