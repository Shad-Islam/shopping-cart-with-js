let products = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      products = data; // Store the products data in the global variable
      localStorage.setItem("products", JSON.stringify(products)); // Store products in localStorage
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

let carts = JSON.parse(localStorage.getItem("carts")) || [];

const addToCart = (productId) => {
  let cartItem = carts.find((item) => item.product_Id === productId);
  if (carts.length <= 0) {
    carts = [
      {
        product_Id: productId,
        quantity: 1,
      },
    ];
  } else if (cartItem) {
    cartItem.quantity++;
  } else {
    carts.push({
      product_Id: productId,
      quantity: 1,
    });
  }

  localStorage.setItem("carts", JSON.stringify(carts)); // Store carts in localStorage
  console.log(carts);
  addToCartHtml();
};

let addToCartHtml = () => {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";

  if (carts.length > 0) {
    carts.forEach((cartItem) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      const product = products.find(
        (product) => product.id == cartItem.product_Id
      );
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
  }
};
