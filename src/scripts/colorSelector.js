// Initialize color selection functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initColorSelectors();
  initShowInsideButtons();
});

function initColorSelectors() {
  // Get all color option buttons
  const colorButtons = document.querySelectorAll('.product-card__color-option:not([disabled])');
  
  // Add click event to each color option
  colorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleColorSelection(btn);
    });
  });
}

function handleColorSelection(btn) {
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
  
  // Update product image with image for the selected color
  const svgUrl = btn.getAttribute('data-svg-url');
  if (svgUrl) {
    // Fade out, change src, fade in
    productImage.style.opacity = '0';
    
    setTimeout(() => {
      productImage.src = svgUrl;
      productImage.style.opacity = '1';
    }, 200);
  }
}

function initShowInsideButtons() {
  // Get all "Show Inside" buttons
  const showInsideButtons = document.querySelectorAll('.product-card__show-inside-btn');
  
  // Add click event to each button
  showInsideButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle the button text and icon
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        btn.innerHTML = 'SHOW INSIDE <span class="plus-icon">+</span>';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        btn.innerHTML = 'HIDE INSIDE <span class="plus-icon">-</span>';
        btn.setAttribute('aria-expanded', 'true');
      }
      
      // In a real implementation, this would toggle showing the inside of the wallet
      // For demo purposes, we're just changing the button
      console.log('Toggle showing inside of wallet');
    });
  });
}

// Export the functions for testing
export { initColorSelectors, handleColorSelection, initShowInsideButtons };