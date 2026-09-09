export type ProductColorId = "blue" | "pink";

export type ProductColorOption = {
  id: ProductColorId;
  hex: string;
  image: string;
  label: { ar: string; fr: string; en: string };
};

export const KIDS_ART_COLORS: ProductColorOption[] = [
  {
    id: "blue",
    hex: "#3D9BE0",
    image: "/products/kids-art-set-easel-208/color-blue.webp",
    label: { ar: "أزرق", fr: "Bleu", en: "Blue" },
  },
  {
    id: "pink",
    hex: "#E85A8C",
    image: "/products/kids-art-set-easel-208/color-pink.webp",
    label: { ar: "وردي", fr: "Rose", en: "Pink" },
  },
];

export const KIDS_ART_DEFAULT_COLOR: ProductColorId = "blue";

export function getKidsArtColor(id: string): ProductColorOption {
  return KIDS_ART_COLORS.find((color) => color.id === id) ?? KIDS_ART_COLORS[0];
}

export function kidsArtColorOrderNote(id: string): string {
  return `اللون: ${getKidsArtColor(id).label.ar}`;
}
