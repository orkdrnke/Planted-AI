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

export const plants = [
  {
    name: "Cucumbers",
    type: PLANT_TYPES.VEGETABLE,
    price: "$250.00",
    size: "30",
    dest: DEST.in,
    amount: "1",
  },
  {
    name: "Tulips",
    type: PLANT_TYPES.FLOWERING,
    price: "$150.00",
    size: "40",
    dest: DEST.in,
    amount: "2",
  },
  {
    name: "Oleandr",
    type: PLANT_TYPES.ORNAMENTAL,
    price: "$350.00",
    size: "20",
    dest: DEST.out,
    amount: "3",
  },
  {
    name: "Rubber Tree",
    type: PLANT_TYPES.INDOOR,
    price: "$450.00",
    size: "20",
    dest: DEST.in,
    amount: "3",
  },
  {
    name: "Palm tree",
    type: PLANT_TYPES.ORNAMENTAL,
    price: "$550.00",
    size: "25",
    dest: DEST.out,
    amount: "10",
  },
  {
    name: "Strawberry",
    type: PLANT_TYPES.BERRY,
    price: "$200.00",
    size: "20",
    dest: DEST.out,
    amount: "23",
  },
  {
    name: "Chili",
    type: PLANT_TYPES.VEGETABLE,
    price: "$300.00",
    size: "50",
    dest: DEST.in,
    amount: "4",
  },
];
