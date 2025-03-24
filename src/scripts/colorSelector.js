// src/scripts/colorSelector.js
// This will be imported into the Layout.astro file to add color selection functionality

// Initialize color selection functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initColorSelectors);

function initColorSelectors() {
  // Get all color option buttons
  const colorButtons = document.querySelectorAll('.product-card__color-option:not([disabled])');
  
  // Add click event to each color option
  colorButtons.forEach(btn => {
    btn.addEventListener('click', handleColorSelection);
  });
}

function handleColorSelection(event) {
  // Get the clicked button
  const btn = event.currentTarget;
  
  // Get the product ID from the data attribute
  const productId = btn.getAttribute('data-product-id');
  if (!productId) return;
  
  // Find the container for this product
  const container = document.getElementById(`product-card-${productId}`);
  if (!container) return;
  
  // Update selected state - remove selected class from all buttons in this container
  container.querySelectorAll('.product-card__color-option--selected')
    .forEach(el => el.classList.remove('product-card__color-option--selected'));
  
  // Add selected class to clicked button
  btn.classList.add('product-card__color-option--selected');
  
  // Find the product image
  const productImage = document.getElementById(`product-image-${productId}`);
  if (!productImage) return;
  
  // Update product image with SVG for the selected color
  const svgUrl = btn.getAttribute('data-svg-url');
  if (svgUrl) {
    productImage.src = svgUrl;
  }
}

// Export the initialization function so it can be called from other files
export { initColorSelectors };