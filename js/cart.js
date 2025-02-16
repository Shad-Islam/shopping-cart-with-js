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

  // Add event listener for clear all button
  document.querySelector(".clear-all-btn").addEventListener("click", () => {
    clearAllCartItems();
  });

  // Add event listener for apply promo button
  document.querySelector(".apply-promo-btn").addEventListener("click", () => {
    applyPromoCode();
  });
});

const updateCartItemQuantity = (productId, newQuantity) => {
  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  const cartItem = carts.find((item) => item.product_Id === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
    localStorage.setItem("carts", JSON.stringify(carts));
    renderCartItems();
    updateCartItemNum();
  }
};

const removeFromCart = (productId) => {
  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  carts = carts.filter((item) => item.product_Id !== productId);
  localStorage.setItem("carts", JSON.stringify(carts));
  renderCartItems();
  updateCartItemNum();
};

const clearAllCartItems = () => {
  localStorage.removeItem("carts");
  renderCartItems();
  updateCartItemNum();
  resetTotals();
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
  updateCartItemNum();
  updateTotalAmount(subtotal);
};

const updateCartItemNum = () => {
  const cartItemNum = document.querySelector(".cart-item-num");
  if (cartItemNum) {
    const carts = JSON.parse(localStorage.getItem("carts")) || [];
    const totalQuantity = carts.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartItemNum.textContent = totalQuantity;

    if (totalQuantity > 0) {
      cartItemNum.classList.remove("hidden");
    } else {
      cartItemNum.classList.add("hidden");
    }
  }
};

const applyPromoCode = () => {
  const promoCode = document.getElementById("promo-code").value.trim();
  const subtotal = parseFloat(
    document.querySelector(".subtotal-amount").textContent
  );
  let discount = 0;

  const promoErrorMessage = document.querySelector(".promo-error-message");
  const promoSuccessMessage = document.querySelector(".promo-success-message");

  if (promoCode === "ostad10") {
    discount = subtotal * 0.1;
  } else if (promoCode === "ostad5") {
    discount = subtotal * 0.05;
  } else {
    if (promoErrorMessage) {
      promoErrorMessage.style.display = "block";
    }
    if (promoSuccessMessage) {
      promoSuccessMessage.style.display = "none";
    }
    return;
  }

  if (promoErrorMessage) {
    promoErrorMessage.style.display = "none";
  }
  if (promoSuccessMessage) {
    promoSuccessMessage.style.display = "block";
  }
  document.querySelector(".discount-amount").textContent = discount.toFixed(2);
  updateTotalAmount(subtotal, discount);
};

const updateTotalAmount = (subtotal, discount = 0) => {
  const totalAmount = subtotal - discount;
  document.querySelector(".total-amount").textContent = totalAmount.toFixed(2);
};

const resetTotals = () => {
  document.querySelector(".subtotal-amount").textContent = "0.00";
  document.querySelector(".discount-amount").textContent = "0.00";
  document.querySelector(".total-amount").textContent = "0.00";
  document.getElementById("promo-code").value = "";
};
