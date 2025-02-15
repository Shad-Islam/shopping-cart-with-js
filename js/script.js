document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/product.json")
    .then((response) => response.json())
    .then((products) => {
      const container = document.querySelector(".container");
      container.innerHTML = "";

      products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        productItem.innerHTML = `
            <div class="product-img">
              <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-content">
              <h3 class="product-title">${product.name}</h3>
              <p class="product-price">Price: $${product.price}</p>
              <button class="add-to-cart">Add to cart</button>
            </div>
          `;

        container.appendChild(productItem);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});
