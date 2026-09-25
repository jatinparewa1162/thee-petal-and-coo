const PRODUCTS_API_URL =
  "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1JfQYkc0YtSynFsAinYmj_GiSab0SuY/exec";


/* =========================
   SHOP STATE
========================= */

let products = [];
let cart = [];

let selectedCategory = "All Blooms";


/* =========================
   DOM
========================= */

const productsContainer =
  document.querySelector("#shop-products");

const emptyState =
  document.querySelector("#shop-empty");

const categoryButtons =
  document.querySelectorAll(
    ".category-button"
  );

const bagButton =
  document.querySelector("#bag-button");

const cartCount =
  document.querySelector("#cart-count");

const cartDrawer =
  document.querySelector("#cart-drawer");

const cartBackdrop =
  document.querySelector("#cart-backdrop");

const cartItems =
  document.querySelector("#cart-items");

const cartEmpty =
  document.querySelector("#cart-empty");

const cartTotal =
  document.querySelector("#cart-total");

const cartClose =
  document.querySelector("#cart-close");

const customiseOrder =
  document.querySelector("#customise-order");


/* =========================
   PRICE
========================= */

function formatPrice(amount){

  return "₹" +
    Number(amount || 0)
      .toLocaleString("en-IN");

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts(){

  try{

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          cache:"no-store"
        }
      );


    if(!response.ok)
      throw new Error(
        "Products API failed"
      );


    const data =
      await response.json();


    products =
      data
        .map((item,index) => {

          const priceNumber =
            Number(
              String(
                item.PRICE || ""
              ).replace(
                /[^0-9.]/g,
                ""
              )
            );


          return {

            id:
              item.ID ||
              `P${String(index + 1).padStart(3,"0")}`,

            name:
              String(
                item.NAME || ""
              ).trim(),

            priceNumber,

            price:
              formatPrice(
                priceNumber
              ),

            category:
              String(
                item.CATEGORY || ""
              ).trim(),

            description:
              String(
                item.DESCRIPTION || ""
              ).trim(),

            image:
              String(
                item.IMAGE || ""
              ).trim(),

            bestSeller:
              String(
                item.BEST_SELLER || ""
              )
              .trim()
              .toUpperCase() === "YES",

            active:
              String(
                item.ACTIVE || ""
              )
              .trim()
              .toUpperCase() === "YES"

          };

        })
        .filter(product =>
          product.active &&
          product.name &&
          product.priceNumber > 0 &&
          product.image
        );


    renderProducts();


  }catch(error){

    console.error(
      "Could not load products:",
      error
    );


    productsContainer.innerHTML = `
      <div class="shop-empty">
        <div>♡</div>
        <h2>Something went wrong</h2>
        <p>Please try again in a moment.</p>
      </div>
    `;

  }

}


/* =========================
   FILTER PRODUCTS
========================= */

function getFilteredProducts(){

  if(selectedCategory === "All Blooms"){

    return products;

  }


  if(selectedCategory === "Best Sellers"){

    return products.filter(
      product => product.bestSeller
    );

  }


  if(selectedCategory === "New Arrivals"){

    return products.filter(
      product =>
        product.category
          .toLowerCase()
          .includes("new")
    );

  }


  return products.filter(
    product =>
      product.category.toLowerCase() ===
      selectedCategory.toLowerCase()
  );

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(){

  if(!productsContainer)
    return;


  const filtered =
    getFilteredProducts();


  productsContainer.innerHTML = "";


  if(emptyState){

    emptyState.hidden =
      filtered.length !== 0;

  }


  if(filtered.length === 0)
    return;


  filtered.forEach(product => {

    const card =
      document.createElement("article");


    card.className =
      "product-card";


    card.innerHTML = `

      <div class="product-image-wrap">

        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
        >


        ${
          product.bestSeller
          ? `
            <span class="product-tag">
              best seller
            </span>
          `
          : ""
        }


        <button
          type="button"
          class="product-heart"
          aria-label="Save ${product.name}"
        >
          ♡
        </button>

      </div>


      <div class="product-info">

        <h3>
          ${product.name}
        </h3>


        <div class="product-bottom">

          <span class="product-price">
            ${product.price}
          </span>


          <button
            type="button"
            class="add-to-bag"
          >
            ♧
          </button>

        </div>

      </div>

    `;


    const addButton =
      card.querySelector(
        ".add-to-bag"
      );


    const heartButton =
      card.querySelector(
        ".product-heart"
      );


    addButton.addEventListener(
      "click",
      () => addToCart(product)
    );


    heartButton.addEventListener(
      "click",
      () => {

        heartButton.classList.toggle(
          "saved"
        );


        heartButton.textContent =
          heartButton.classList.contains(
            "saved"
          )
          ? "♥"
          : "♡";

      }
    );


    productsContainer.appendChild(
      card
    );

  });

}


/* =========================
   CATEGORY BUTTONS
========================= */

categoryButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        selectedCategory =
          button.dataset.category;


        categoryButtons.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );


        renderProducts();

      }
    );

  }
);


/* =========================
   CART
========================= */

function addToCart(product){

  const existing =
    cart.find(
      item => item.id === product.id
    );


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      ...product,
      quantity:1
    });

  }


  updateCart();

  openCart();

}


function removeFromCart(id){

  cart =
    cart.filter(
      item => item.id !== id
    );


  updateCart();

}


function changeQuantity(
  id,
  change
){

  const item =
    cart.find(
      product => product.id === id
    );


  if(!item)
    return;


  item.quantity += change;


  if(item.quantity <= 0){

    removeFromCart(id);

    return;

  }


  updateCart();

}


/* =========================
   CART TOTAL
========================= */

function getCartTotal(){

  return cart.reduce(
    (total,item) =>
      total +
      item.priceNumber *
      item.quantity,
    0
  );

}


function updateCart(){

  updateCartCount();

  renderCart();

}


function updateCartCount(){

  const count =
    cart.reduce(
      (total,item) =>
        total + item.quantity,
      0
    );


  if(cartCount){

    cartCount.textContent =
      count;

    cartCount.hidden =
      count === 0;

  }

}


/* =========================
   RENDER CART
========================= */

function renderCart(){

  if(!cartItems)
    return;


  cartItems.innerHTML = "";


  if(cart.length === 0){

    if(cartEmpty)
      cartItems.appendChild(
        cartEmpty
      );


    if(cartTotal)
      cartTotal.textContent =
        "₹0";


    return;

  }


  cart.forEach(item => {

    const row =
      document.createElement(
        "div"
      );


    row.className =
      "cart-item";


    row.innerHTML = `

      <img
        src="${item.image}"
        alt="${item.name}"
        class="cart-item-image"
      >


      <div class="cart-item-info">

        <h3>
          ${item.name}
        </h3>

        <p>
          ${item.price}
        </p>


        <div class="cart-item-bottom">

          <div class="quantity-controls">

            <button
              type="button"
              class="qty-minus"
            >
              −
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              type="button"
              class="qty-plus"
            >
              +
            </button>

          </div>


          <button
            type="button"
            class="cart-remove"
          >
            Remove
          </button>

        </div>

      </div>

    `;


    row.querySelector(
      ".qty-minus"
    ).addEventListener(
      "click",
      () =>
        changeQuantity(
          item.id,
          -1
        )
    );


    row.querySelector(
      ".qty-plus"
    ).addEventListener(
      "click",
      () =>
        changeQuantity(
          item.id,
          1
        )
    );


    row.querySelector(
      ".cart-remove"
    ).addEventListener(
      "click",
      () =>
        removeFromCart(
          item.id
        )
    );


    cartItems.appendChild(row);

  });


  if(cartTotal){

    cartTotal.textContent =
      formatPrice(
        getCartTotal()
      );

  }

}


/* =========================
   OPEN / CLOSE CART
========================= */

function openCart(){

  cartDrawer.classList.add(
    "open"
  );

  cartBackdrop.classList.add(
    "open"
  );

  document.body.classList.add(
    "cart-open"
  );

}


function closeCart(){

  cartDrawer.classList.remove(
    "open"
  );

  cartBackdrop.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "cart-open"
  );

}


if(bagButton){

  bagButton.addEventListener(
    "click",
    () => {

      renderCart();

      openCart();

    }
  );

}


if(cartClose){

  cartClose.addEventListener(
    "click",
    closeCart
  );

}


if(cartBackdrop){

  cartBackdrop.addEventListener(
    "click",
    closeCart
  );

}


loadProducts();