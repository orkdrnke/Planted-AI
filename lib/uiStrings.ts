import { PLANT_TYPES, PlantType } from "@/lib/constants";

// Stored plant type values stay as they are (data and image file names); only their display labels live here
const plantTypeLabels: Record<PlantType, string> = {
  [PLANT_TYPES.VEGETABLE]: "Vegetable plants",
  [PLANT_TYPES.FLOWERING]: "Flowering",
  [PLANT_TYPES.ORNAMENTAL]: "Ornamental",
  [PLANT_TYPES.INDOOR]: "Indoor plants",
  [PLANT_TYPES.BERRY]: "Berry plants",
};

// All UI text lives here (ADR-0004); components import from this module. English is the default locale.
export const uiStrings = {
  plantTypeLabel: (type: string) =>
    type in plantTypeLabels ? plantTypeLabels[type as PlantType] : type,
  header: {
    logoAlt: "Planted AI logo",
    myGarden: "My Garden",
    addPlant: "Add plant",
  },
  landing: {
    title: "Welcome to your digital garden",
    getStartedBefore: "Get started by adding plants on the",
    getStartedLink: "My Garden",
    aiTips: "Add plants to your list and get AI-generated care tips",
    myGarden: "My Garden",
    searchPlants: "Search plants (coming soon)",
    takePhoto: "Plant photo (coming soon)",
    vercelAlt: "Vercel logo",
    about: "About Planted AI",
    calendar: "Calendar",
    notifications: "Notifications",
  },
  addPlantForm: {
    title: "Add a new plant",
    name: {
      label: "Plant name",
      placeholder: "name",
      description: "This is the name of your plant",
      tooShort: "Name must be at least 3 characters",
    },
    type: {
      label: "Plant type",
      placeholder: "Select a type",
      description: "Select the plant type",
      required: "Select the plant type",
    },
    size: {
      label: "Size",
      placeholder: "size",
      description: "How big it is",
    },
    amount: {
      label: "Amount",
      placeholder: "amount",
      description: "How many plants",
    },
    dest: {
      label: "Destination",
      placeholder: "destination",
      description: "Is it for outside or inside?",
      tooShort: "Destination must be at least 5 characters",
    },
    price: {
      label: "Price",
      placeholder: "price",
      description: "How much it cost",
    },
    dateAdded: {
      label: "Date added",
      placeholder: "date added",
      description: "When did you add this plant to your collection?",
    },
    submit: "Add",
  },
  dashboard: {
    title: "My Garden",
    addPlant: "Add plant",
    columns: {
      name: "Name",
      type: "Type",
      location: "Location",
      watering: "Watering",
      light: "Light",
    },
  },
  status: {
    label: "Collection status",
    total: (count: number) => `Plants: ${count}`,
    ready: (count: number) => `Ready: ${count}`,
    generating: (count: number) => `Generating: ${count}`,
    failed: (count: number) => `Failed: ${count}`,
  },
  careTipState: {
    ready: "Ready",
    generating: "Generating",
    failed: "Failed",
  },
  // Watering and light cells of a plant without stored tips
  cell: {
    generating: "Pending",
    failed: "Unavailable",
    noLocation: "—",
  },
  emptyState: {
    title: "Your garden has no plants yet",
    description: "Add your first plant to get care tips.",
    action: "Add your first plant",
  },
  plantPage: {
    back: "Back to garden",
    botanicalName: "Botanical name",
    regenerate: "Regenerate",
    generating: "Care tips are being prepared…",
    failed: "Could not create care tips.",
    retry: "Try again",
    remove: "Remove plant",
    sections: {
      category: "Category",
      watering: "Watering",
      light: "Light",
      temperature: "Temperature",
      soil: "Soil",
      careTips: "Care tips",
    },
    sidebar: {
      lastWatered: "Last watered",
      noWateringInfo: "No data",
      lastWateredOn: (date: string) => `Last watered: ${date}`,
      daysSince: (days: number) => `Days since: ${days}`,
      nextFertilization: "Next fertilization",
      notPlanned: "not planned",
      additionalDetails: "Additional details",
      size: "Size",
      sizeValue: (size: string) => `${size} cm`,
      price: "Price",
      location: "Location",
      amount: "Amount",
      notes: "Notes",
      noNotes: "No notes",
    },
  },
  notFound: {
    title: "Plant not found 🌱",
    back: "Back to garden",
  },
  removeDialog: {
    title: (name: string) => `Remove "${name}"?`,
    description: "The plant will be removed from your garden. This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Remove",
  },
} as const;
