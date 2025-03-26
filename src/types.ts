export type Color = {
  id: string;
  name: string;
  hexCode: string;
  inStock: boolean;
  svgUrl?: string; // Path to color-specific SVG
}

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageSrc: string;
  description: string;
  hasRFID?: boolean;
  colors: Color[];
  isNew: boolean;
}
