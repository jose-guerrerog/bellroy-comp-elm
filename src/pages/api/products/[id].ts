import type { APIRoute, GetStaticPaths } from 'astro';

// Define a type for a product
type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageSrc: string;
  colors: {
    id: string;
    name: string;
    hexCode: string;
    inStock: boolean;
  }[];
  badge: string | null;
  isNew: boolean;
};

// Define a type for the products object with an index signature
type ProductsMap = {
  [key: string]: Product;
};

// Mock product data with the correct type
const products: ProductsMap = {
  'slim-sleeve': {
    id: 'slim-sleeve',
    name: 'Slim Sleeve Wallet',
    price: 79.00,
    currency: 'USD',
    imageSrc: '/images/products/3.png',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hexCode: '#000000',
        inStock: true
      },
      {
        id: 'tan',
        name: 'Tan',
        hexCode: '#D2B48C',
        inStock: true
      },
      {
        id: 'navy',
        name: 'Navy',
        hexCode: '#000080',
        inStock: false
      },
      {
        id: 'forest',
        name: 'Forest',
        hexCode: '#228B22',
        inStock: true
      }
    ],
    badge: null,
    isNew: false
  },
  'hide-seek': {
    id: 'hide-seek',
    name: 'Note Sleeve Wallet',
    price: 89.00,
    currency: 'USD',
    imageSrc: '/images/products/1.png',
    colors: [
      {
        id: 'teal',
        name: 'Teal',
        hexCode: '#008080',
        inStock: true
      },
      {
        id: 'black',
        name: 'Black',
        hexCode: '#000000',
        inStock: true
      },
      {
        id: 'cognac',
        name: 'Cognac',
        hexCode: '#8B4513',
        inStock: true
      }
    ],
    badge: '20% OFF',
    isNew: false
  },
  'zip-wallet': {
    id: 'zip-wallet',
    name: 'Apex Sleeve',
    price: 99.00,
    currency: 'USD',
    imageSrc: '/images/products/2.png',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hexCode: '#000000',
        inStock: true
      },
      {
        id: 'terracotta',
        name: 'Terracotta',
        hexCode: '#E2725B',
        inStock: true
      }
    ],
    badge: null,
    isNew: true
  }
};

// This function is required for static generation of dynamic routes
export const getStaticPaths = (() => {
  // Generate a path for each product ID
  return Object.keys(products).map(id => ({
    params: { id }
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params, request }) => {
  const id = params.id;
  
  if (!id || !products[id]) {
    return new Response(
      JSON.stringify({ error: 'Product not found' }),
      { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return new Response(
    JSON.stringify(products[id]),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};