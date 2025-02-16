document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();

  // Add event listener for remove buttons
  document
    .querySelector(".cart-container")
    .addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        const productId = event.target.getAttribute("data-id");
        removeFromCart(productId);
      }
    });
});


// Add event listener for clear all button
document.querySelector(".clear-all-btn").addEventListener("click", () => {
    localStorage.removeItem("carts");
    renderCartItems();
});

const updateCartItemQuantity = (productId, newQuantity) => {
  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  const cartItem = carts.find((item) => item.product_Id === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
    localStorage.setItem("carts", JSON.stringify(carts));
    renderCartItems();
  }
};

const removeFromCart = (productId) => {
  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  carts = carts.filter((item) => item.product_Id !== productId);
  localStorage.setItem("carts", JSON.stringify(carts));
  renderCartItems();
};

const renderCartItems = () => {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = `
    <h2>Shopping Cart</h2>
    <!-- Cart items will be dynamically added here -->
  `;

  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  let subtotal = 0;

  if (carts.length > 0) {
    carts.forEach((cartItem) => {
      const product = products.find(
        (product) => product.id == cartItem.product_Id
      );
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");

      cartItemElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <h5>Price: $${(product.price * cartItem.quantity).toFixed(2)}</h5>
          <span class="remove-item" data-id="${
            cartItem.product_Id
          }">Remove</span>
        </div>
        <div class="cart-item-amount">
          <i class="fa-solid fa-chevron-up" data-id="${
            cartItem.product_Id
          }"></i>
          <p class="item-amount">${cartItem.quantity}</p>
          <i class="fa-solid fa-chevron-down" data-id="${
            cartItem.product_Id
          }"></i>
        </div>
      `;

      // Add event listeners for quantity increase and decrease
      cartItemElement
        .querySelector(".fa-chevron-up")
        .addEventListener("click", () => {
          updateCartItemQuantity(cartItem.product_Id, cartItem.quantity + 1);
        });

      cartItemElement
        .querySelector(".fa-chevron-down")
        .addEventListener("click", () => {
          if (cartItem.quantity > 1) {
            updateCartItemQuantity(cartItem.product_Id, cartItem.quantity - 1);
          }
        });

      cartContainer.insertBefore(
        cartItemElement,
        cartContainer.querySelector(".cart-summary")
      );
      subtotal += product.price * cartItem.quantity;
    });
  } else {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
  }

  document.querySelector(".subtotal-amount").textContent = subtotal.toFixed(2);
};
