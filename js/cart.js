document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container");

  // Assuming `carts` is stored in localStorage
  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  console.log("Carts:", carts);
  console.log("Products:", products);

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
          <h5>Price: $${product.price}</h5>
          <span class="remove-item" data-id="${cartItem.product_Id}">Remove</span>
        </div>
        <div class="cart-item-amount">
          <i class="fa-solid fa-chevron-up" data-id="${cartItem.product_Id}"></i>
          <p class="item-amount">${cartItem.quantity}</p>
          <i class="fa-solid fa-chevron-down" data-id="${cartItem.product_Id}"></i>
        </div>
      `;

      cartContainer.appendChild(cartItemElement);
    });
  } else {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
  }
});
