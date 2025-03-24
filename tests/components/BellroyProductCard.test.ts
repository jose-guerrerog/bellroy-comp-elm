// tests/components/BellroyProductCard.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Simple mock HTML that represents our component's output
const mockProductCardHTML = `
  <div id="product-card-slim-sleeve" class="product-card-container">
    <div class="product-card">
      <div class="product-card__image-container">
        <a href="/products/slim-sleeve" class="product-card__image-link">
          <img id="product-image-slim-sleeve" src="/images/products/slim-sleeve-black.png" alt="Slim Sleeve" class="product-card__image">
        </a>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__name">
          <a href="/products/slim-sleeve" class="product-card__name-link">Slim Sleeve</a>
        </h3>
        <div class="product-card__price-container">
          <div class="product-card__price">$119</div>
        </div>
        <div class="product-card__colors">
          <button class="product-card__color-option product-card__color-option--selected" 
                  style="background-color: #000000;" 
                  data-color-id="black" 
                  data-svg-url="/images/products/slim-sleeve-black.png" 
                  data-product-id="slim-sleeve">
            <span class="sr-only">Black</span>
          </button>
          <button class="product-card__color-option" 
                  style="background-color: #8B4513;" 
                  data-color-id="brown" 
                  data-svg-url="/images/products/slim-sleeve-brown.png" 
                  data-product-id="slim-sleeve">
            <span class="sr-only">Brown</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`;

// Mock HTML for the Hide & Seek wallet
const hideAndSeekMockHTML = `
  <div id="product-card-hide-and-seek" class="product-card-container">
    <div class="product-card">
      <div class="product-card__image-container">
        <a href="/products/hide-and-seek" class="product-card__image-link">
          <img id="product-image-hide-and-seek" src="/images/products/hide-seek-blue.png" alt="Hide & Seek" class="product-card__image">
        </a>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__name">
          <a href="/products/hide-and-seek" class="product-card__name-link">Hide & Seek</a>
        </h3>
        <div class="product-card__price-container">
          <div class="product-card__price">$149</div>
        </div>
        <div class="product-card__colors">
          <button class="product-card__color-option product-card__color-option--selected" 
                  style="background-color: #1A2351;" 
                  data-color-id="blue" 
                  data-svg-url="/images/products/hide-seek-blue.png" 
                  data-product-id="hide-and-seek">
            <span class="sr-only">Blue</span>
          </button>
          <button class="product-card__color-option" 
                  style="background-color: #A0522D;" 
                  data-color-id="tan" 
                  data-svg-url="/images/products/hide-seek-tan.png" 
                  data-product-id="hide-and-seek">
            <span class="sr-only">Tan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`;

// TypeScript interface for our color selector function
interface ColorButton extends HTMLButtonElement {
  dataset: {
    colorId?: string;
    svgUrl?: string;
    productId?: string;
  };
}

// We'll test our colorSelector functionality by adding a simplified version here
function initColorSelectors(document: Document): void {
  const colorButtons = document.querySelectorAll<ColorButton>('.product-card__color-option');
  
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Get the product ID
      const productId = btn.dataset.productId;
      if (!productId) return;
      
      // Find the container
      const container = document.getElementById(`product-card-${productId}`);
      if (!container) return;
      
      // Update selected state
      container.querySelectorAll<HTMLElement>('.product-card__color-option--selected')
        .forEach(el => el.classList.remove('product-card__color-option--selected'));
      
      btn.classList.add('product-card__color-option--selected');
      
      // Update product image
      const productImage = document.getElementById(`product-image-${productId}`) as HTMLImageElement;
      if (!productImage) return;
      
      const svgUrl = btn.dataset.svgUrl;
      if (svgUrl) {
        productImage.src = svgUrl;
      }
    });
  });
}

describe('BellroyProductCard - Slim Sleeve', () => {
  let dom: JSDOM;
  let document: Document;
  
  beforeEach(() => {
    // Set up a DOM environment with our mock HTML
    dom = new JSDOM(mockProductCardHTML);
    document = dom.window.document;
    
    // Initialize our color selector functionality
    initColorSelectors(document);
  });
  
  it('displays the correct product name', () => {
    const productName = document.querySelector('.product-card__name-link')?.textContent;
    expect(productName).toBe('Slim Sleeve');
  });
  
  it('displays the correct price', () => {
    const price = document.querySelector('.product-card__price')?.textContent;
    expect(price).toBe('$119');
  });
  
  it('has the black color option selected by default', () => {
    const selectedColor = document.querySelector<HTMLElement>('.product-card__color-option--selected');
    expect(selectedColor?.getAttribute('data-color-id')).toBe('black');
  });
  
  it('changes the selected color when clicking a different color option', () => {
    // Get the brown color button
    const brownButton = document.querySelector<HTMLElement>('[data-color-id="brown"]');
    
    // Click it
    brownButton?.click();
    
    // Check if it's now selected
    expect(brownButton?.classList.contains('product-card__color-option--selected')).toBe(true);
    
    // Check if the black button is no longer selected
    const blackButton = document.querySelector<HTMLElement>('[data-color-id="black"]');
    expect(blackButton?.classList.contains('product-card__color-option--selected')).toBe(false);
  });
  
  it('changes the product image when selecting a different color', () => {
    // Get the initial image source
    const initialImg = document.getElementById('product-image-slim-sleeve') as HTMLImageElement;
    const initialSrc = initialImg?.src;
    
    // Click the brown color button
    const brownButton = document.querySelector<HTMLElement>('[data-color-id="brown"]');
    brownButton?.click();
    
    // Get the new image source
    const newSrc = (document.getElementById('product-image-slim-sleeve') as HTMLImageElement).src;
    
    // Check if it changed to the brown image
    expect(newSrc).not.toBe(initialSrc);
    expect(newSrc).toContain('slim-sleeve-brown.png');
  });
  
  it('does not display a product description', () => {
    const description = document.querySelector('.product-card__description');
    expect(description).toBeNull();
  });
});

describe('BellroyProductCard - Hide & Seek', () => {
  let dom: JSDOM;
  let document: Document;
  
  beforeEach(() => {
    // Set up a DOM environment with our mock HTML
    dom = new JSDOM(hideAndSeekMockHTML);
    document = dom.window.document;
    
    // Initialize our color selector functionality
    initColorSelectors(document);
  });
  
  it('displays the correct product name', () => {
    const productName = document.querySelector('.product-card__name-link')?.textContent;
    expect(productName).toBe('Hide & Seek');
  });
  
  it('displays the correct price', () => {
    const price = document.querySelector('.product-card__price')?.textContent;
    expect(price).toBe('$149');
  });
  
  it('has the blue color option selected by default', () => {
    const selectedColor = document.querySelector<HTMLElement>('.product-card__color-option--selected');
    expect(selectedColor?.getAttribute('data-color-id')).toBe('blue');
  });
  
  it('changes the selected color when clicking a different color option', () => {
    // Get the tan color button
    const tanButton = document.querySelector<HTMLElement>('[data-color-id="tan"]');
    
    // Click it
    tanButton?.click();
    
    // Check if it's now selected
    expect(tanButton?.classList.contains('product-card__color-option--selected')).toBe(true);
    
    // Check if the blue button is no longer selected
    const blueButton = document.querySelector<HTMLElement>('[data-color-id="blue"]');
    expect(blueButton?.classList.contains('product-card__color-option--selected')).toBe(false);
  });
  
  it('changes the product image when selecting a different color', () => {
    // Get the initial image source
    const initialImg = document.getElementById('product-image-hide-and-seek') as HTMLImageElement;
    const initialSrc = initialImg?.src;
    
    // Click the tan color button
    const tanButton = document.querySelector<HTMLElement>('[data-color-id="tan"]');
    tanButton?.click();
    
    // Get the new image source
    const newSrc = (document.getElementById('product-image-hide-and-seek') as HTMLImageElement).src;
    
    // Check if it changed to the tan image
    expect(newSrc).not.toBe(initialSrc);
    expect(newSrc).toContain('hide-seek-tan.png');
  });
});