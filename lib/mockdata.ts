import { TPlant } from "@/types/plant";

export const PLANT_TYPES = {
  VEGETABLE: "Vegetable plants",
  FLOWERING: "Flowering",
  ORNAMENTAL: "Ornamental",
  INDOOR: "Indoor plants",
  BERRY: "Berry plants",
} as const;

export const DEST = {
  in: "inside",
  out: "outside",
};

export type PlantType = (typeof PLANT_TYPES)[keyof typeof PLANT_TYPES];

export const plants: TPlant[] = [
  {
    name: "Cucumbers",
    type: PLANT_TYPES.VEGETABLE,
    price: "$250.00",
    size: "30",
    dest: DEST.in,
    amount: "1",
    id: "01",
    dateAdded: new Date(),
  },
  {
    name: "Tulips",
    type: PLANT_TYPES.FLOWERING,
    price: "$150.00",
    size: "40",
    dest: DEST.in,
    amount: "2",
    id: "02",
    dateAdded: new Date(),
  },
  {
    name: "Oleandr",
    type: PLANT_TYPES.ORNAMENTAL,
    price: "$350.00",
    size: "20",
    dest: DEST.out,
    amount: "3",
    id: "03",
    dateAdded: new Date(),
  },
  {
    name: "Rubber Tree",
    type: PLANT_TYPES.INDOOR,
    price: "$450.00",
    size: "20",
    dest: DEST.in,
    amount: "3",
    id: "04",
    dateAdded: new Date(),
  },
  {
    name: "Palm tree",
    type: PLANT_TYPES.ORNAMENTAL,
    price: "$550.00",
    size: "25",
    dest: DEST.out,
    amount: "10",
    id: "05",
    dateAdded: new Date(),
  },
  {
    name: "Strawberry",
    type: PLANT_TYPES.BERRY,
    price: "$200.00",
    size: "20",
    dest: DEST.out,
    amount: "23",
    id: "06",
    dateAdded: new Date(),
  },
  {
    name: "Chili",
    type: PLANT_TYPES.VEGETABLE,
    price: "$300.00",
    size: "50",
    dest: DEST.in,
    amount: "4",
    id: "07",
    dateAdded: new Date(),
  },
];
