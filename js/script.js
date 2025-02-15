document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((products) => {
      const container = document.querySelector(".container");
      container.innerHTML = "";

      products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.setAttribute("data-id", product.id);

        productItem.innerHTML = `
              <div class="product-img">
                <img src="${product.image}" alt="${product.name}" />
              </div>
              <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">Price: $${product.price}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart">Add to cart</button>
              </div>
            `;

        container.appendChild(productItem);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});

addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-to-cart")) {
    let productId =
      positionClick.parentElement.parentElement.getAttribute("data-id");
     addToCart(productId);
  }
});

let carts = [];

const addToCart = (productId) => {
  let cartItem = carts.find((item) => item.product_Id === productId);
  if (carts.length <= 0) {
    carts = [
      {
        product_Id: productId,
        quantity: 1,
      },
    ];
  }else if (cartItem) {
    cartItem.quantity++;
  } else {
    carts.push({
      product_Id: productId,
      quantity: 1,
    });
  }
  console.log(carts);
};
