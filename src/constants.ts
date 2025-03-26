interface Color {
  id: string;
  name: string;
  hexCode: string;
  inStock: boolean;
  svgUrl?: string; // Path to color-specific SVG
}

interface Product {
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

interface ProductMap {
  [key: string]: Product;
}

export const productData: ProductMap = {
  'slim-sleeve': {
    id: 'slim-sleeve',
    name: 'Slim Sleeve',
    price: 119.00,
    currency: 'USD',
    imageSrc: '/images/products/slim-sleeve-black.png',
    description: 'Billfold / 5 – 12+ cards, flat bills, coins',
    colors: [
      { 
        id: 'black', 
        name: 'Black', 
        hexCode: '#000000', 
        inStock: true,
        svgUrl: '/images/products/slim-sleeve-black.png'
      },
      { 
        id: 'brown', 
        name: 'Brown', 
        hexCode: '#8B4513', 
        inStock: true,
        svgUrl: '/images/products/slim-sleeve-brown.png'
      },
      { 
        id: 'gray', 
        name: 'Gray', 
        hexCode: '#404040', 
        inStock: true,
        svgUrl: '/images/products/slim-sleeve-gray.png'
      }
    ],
    isNew: false
  },
  'hide-and-seek': {
    id: 'hide-and-seek',
    name: 'Hide & Seek',
    price: 129.00,
    currency: 'USD',
    imageSrc: '/images/products/hide-seek-blue.png',
    description: 'Billfold / 5 – 12+ cards, flat bills, coins',
    hasRFID: true,
    colors: [
      { 
        id: 'navy', 
        name: 'Navy', 
        hexCode: '#1A2351', 
        inStock: true,
        svgUrl: '/images/products/hide-seek-blue.png'
      },
      { 
        id: 'tan', 
        name: 'Tan', 
        hexCode: '#A0522D', 
        inStock: true,
        svgUrl: '/images/products/hide-seek-tan.png'
      }
    ],
    isNew: false
  },
  'zip-wallet': {
    id: 'zip-wallet',
    name: 'Zip Wallet',
    price: 149.00,
    currency: 'USD',
    imageSrc: '/images/products/zip-wallet-black.png',
    description: 'Phone wallet / 4 – 12 cards, bills, coins',
    colors: [
      { 
        id: 'black', 
        name: 'Black', 
        hexCode: '#000000', 
        inStock: true,
        svgUrl: '/images/products/zip-wallet-black.png'
      },
      { 
        id: 'green', 
        name: 'Green', 
        hexCode: '#556B2F', 
        inStock: true,
        svgUrl: '/images/products/zip-wallet-green.png'
      }
    ],
    isNew: false
  }
};