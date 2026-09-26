/* =========================
   THEE PETAL AND CO.
   SHOP PAGE
   PART 1/4
========================= */

const PRODUCTS_API_URL =
  "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1JfQYkc0YtSynFsAinYmj_GiSab0SuY/exec";


let products = [];

let selectedCategory = "All Blooms";

const PRODUCTS_CACHE_KEY = "petalProductsCache_v1";

function loadCachedProducts(){

  try{

    const cached =
      localStorage.getItem(
        PRODUCTS_CACHE_KEY
      );

    if(!cached) return false;

    const parsed =
      JSON.parse(cached);

    if(
      !parsed ||
      !Array.isArray(parsed.products)
    ){
      return false;
    }

    products = parsed.products;

    renderProducts();
    applyUrlSearch();

    return true;

  }catch(error){

    console.warn(
      "Could not load cached products:",
      error
    );

    return false;

  }

}

function saveProductsCache(data){

  try{

    localStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        products: data
      })
    );

  }catch(error){

    console.warn(
      "Could not save products cache:",
      error
    );

  }

}


/* =========================
   SHARED CART
========================= */

let cart = [];


try{

  const savedCart =
    localStorage.getItem(
      "petalCart"
    );


  if(savedCart){

    const parsed =
      JSON.parse(savedCart);


    if(Array.isArray(parsed)){

      cart = parsed;

    }

  }

}catch(error){

  console.error(
    "Could not load cart:",
    error
  );

}


function saveCart(){

  try{

    localStorage.setItem(
      "petalCart",
      JSON.stringify(cart)
    );

  }catch(error){

    console.error(
      "Could not save cart:",
      error
    );

  }

}


/* =========================
   DOM
========================= */

const productsContainer =
  document.querySelector(
    "#shop-products"
  );


const emptyState =
  document.querySelector(
    "#shop-empty"
  );


const categoryButtons =
  document.querySelectorAll(
    ".category-button"
  );


const bagButton =
  document.querySelector(
    "#bag-button"
  );


const cartCount =
  document.querySelector(
    "#cart-count"
  );


const cartDrawer =
  document.querySelector(
    "#cart-drawer"
  );


const cartBackdrop =
  document.querySelector(
    "#cart-backdrop"
  );


const cartItems =
  document.querySelector(
    "#cart-items"
  );


const cartEmpty =
  document.querySelector(
    "#cart-empty"
  );


const cartTotal =
  document.querySelector(
    "#cart-total"
  );


const cartClose =
  document.querySelector(
    "#cart-close"
  );


const customiseOrder =
  document.querySelector(
    "#customise-order"
  );


/* =========================
   PRICE
========================= */

function formatPrice(amount){

  return (
    "₹" +
    Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )
  );

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts(){

  loadCachedProducts();

  try{

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          cache:
            "no-store"
        }
      );


    if(!response.ok){

      throw new Error(
        "Products API failed"
      );

    }


    const data =
      await response.json();


    products =
      data
        .map(
          (item,index) => {

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
                String(
                  item.ID ||
                  `P${String(
                    index + 1
                  ).padStart(
                    3,
                    "0"
                  )}`
                ),

              name:
                String(
                  item.NAME ||
                  ""
                ).trim(),

              priceNumber:
                priceNumber,

              price:
                formatPrice(
                  priceNumber
                ),

              category:
                String(
                  item.CATEGORY ||
                  ""
                ).trim(),

              description:
                String(
                  item.DESCRIPTION ||
                  ""
                ).trim(),

              image:
                String(
                  item.IMAGE ||
                  ""
                ).trim(),

              bestSeller:
                String(
                  item.BEST_SELLER ||
                  ""
                )
                  .trim()
                  .toUpperCase() ===
                "YES",

              newArrival:
                String(
                  item.NEW_ARRIVAL ||
                  ""
                )
                  .trim()
                  .toUpperCase() ===
                "YES",

              active:
                String(
                  item.ACTIVE ||
                  ""
                )
                  .trim()
                  .toUpperCase() ===
                "YES"

            };

          }
        )
        .filter(
          product =>
            product.active &&
            product.name &&
            product.priceNumber > 0 &&
            product.image
        );


    saveProductsCache(
      products
    );


    renderProducts();


    /*
     * If URL contains:
     * ?search=Pink
     * apply it after products load.
     */

    applyUrlSearch();


  }catch(error){

    console.error(
      "Could not load products:",
      error
    );


    if(productsContainer){

      productsContainer.innerHTML = `

        <div class="shop-empty">

          <div>♡</div>

          <h2>
            Something went wrong
          </h2>

          <p>
            Please try again in a moment.
          </p>

        </div>

      `;

    }

  }

}


/* =========================
   FILTER PRODUCTS
========================= */

function getFilteredProducts(){

  if(
    selectedCategory ===
    "All Blooms"
  ){

    return products;

  }


  if(
    selectedCategory ===
    "Best Sellers"
  ){

    return products.filter(
      product =>
        product.bestSeller
    );

  }


  if(
    selectedCategory ===
    "New Arrivals"
  ){

    return products.filter(
      product =>
        product.newArrival
    );

  }


  return products.filter(
    product =>
      product.category
        .toLowerCase() ===
      selectedCategory
        .toLowerCase()
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


  productsContainer.innerHTML =
    "";


  if(emptyState){

    emptyState.hidden =
      filtered.length !== 0;

  }


  if(
    filtered.length === 0
  ){

    return;

  }


  filtered.forEach(
    product => {

      const card =
        document.createElement(
          "article"
        );


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

          ${
            product.description
              ? `
                <p class="product-description">
                  ${product.description}
                </p>
              `
              : ""
          }

          <div class="product-bottom">

            <span class="product-price">
              ${product.price}
            </span>

            <button
              type="button"
              class="add-to-bag"
              aria-label="Add ${product.name} to bag"
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


      if(addButton){

        addButton.addEventListener(
          "click",
          () =>
            addToCart(
              product
            )
        );

      }


      if(heartButton){

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

      }


      productsContainer.appendChild(
        card
      );

    }
  );

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
          button.dataset.category ||
          "All Blooms";


        categoryButtons.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        button.classList.add(
          "active"
        );


        /*
         * Remove search from URL
         * when manually choosing
         * a category.
         */

        const url =
          new URL(
            window.location.href
          );


        url.searchParams.delete(
          "search"
        );


        window.history.replaceState(
          {},
          "",
          url
        );


        renderProducts();

      }
    );

  }
);


/* =========================
   ADD TO CART
========================= */

function addToCart(product){

  const existing =
    cart.find(
      item =>
        item.id ===
        product.id
    );


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({

      id:
        product.id,

      name:
        product.name,

      priceNumber:
        product.priceNumber,

      price:
        product.price,

      category:
        product.category,

      description:
        product.description,

      image:
        product.image,

      quantity:
        1

    });

  }


  saveCart();


  updateCart();


  openCart();

}


/* =========================
   REMOVE
========================= */

function removeFromCart(id){

  cart =
    cart.filter(
      item =>
        item.id !== id
    );


  saveCart();


  updateCart();

}


/* =========================
   QUANTITY
========================= */

function changeQuantity(
  id,
  change
){

  const item =
    cart.find(
      product =>
        product.id === id
    );


  if(!item)
    return;


  item.quantity +=
    change;


  if(
    item.quantity <= 0
  ){

    removeFromCart(
      id
    );


    return;

  }


  saveCart();


  updateCart();

}


/* =========================
   TOTAL
========================= */

function getCartTotal(){

  return cart.reduce(
    (
      total,
      item
    ) =>
      total +
      Number(
        item.priceNumber || 0
      ) *
      Number(
        item.quantity || 0
      ),
    0
  );

}


/* =========================
   CART UPDATE
========================= */

function updateCart(){

  updateCartCount();

  renderCart();

}


/* =========================
   CART COUNT
========================= */

function updateCartCount(){

  const count =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity || 0
        ),
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
   CART RENDER
========================= */

function renderCart(){

  if(!cartItems)
    return;


  cartItems.innerHTML =
    "";


  if(cart.length === 0){

    if(cartEmpty){

      cartItems.appendChild(
        cartEmpty
      );

    }


    if(cartTotal){

      cartTotal.textContent =
        "₹0";

    }


    return;

  }


  cart.forEach(
    item => {

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
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                type="button"
                class="qty-plus"
                aria-label="Increase quantity"
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


      const minus =
        row.querySelector(
          ".qty-minus"
        );


      const plus =
        row.querySelector(
          ".qty-plus"
        );


      const remove =
        row.querySelector(
          ".cart-remove"
        );


      if(minus){

        minus.addEventListener(
          "click",
          () =>
            changeQuantity(
              item.id,
              -1
            )
        );

      }


      if(plus){

        plus.addEventListener(
          "click",
          () =>
            changeQuantity(
              item.id,
              1
            )
        );

      }


      if(remove){

        remove.addEventListener(
          "click",
          () =>
            removeFromCart(
              item.id
            )
        );

      }


      cartItems.appendChild(
        row
      );

    }
  );


  if(cartTotal){

    cartTotal.textContent =
      formatPrice(
        getCartTotal()
      );

  }

}


/* =========================
   OPEN CART
========================= */

function openCart(){

  if(cartDrawer){

    cartDrawer.classList.add(
      "open"
    );

  }


  if(cartBackdrop){

    cartBackdrop.classList.add(
      "open"
    );

  }


  document.body.classList.add(
    "cart-open"
  );

}


/* =========================
   CLOSE CART
========================= */

function closeCart(){

  if(cartDrawer){

    cartDrawer.classList.remove(
      "open"
    );

  }


  if(cartBackdrop){

    cartBackdrop.classList.remove(
      "open"
    );

  }


  document.body.classList.remove(
    "cart-open"
  );

}


/* =========================
   BAG BUTTON
========================= */

if(bagButton){

  bagButton.addEventListener(
    "click",
    () => {

      /*
       * Reload cart from localStorage
       * in case Home changed it.
       */

      try{

        const saved =
          localStorage.getItem(
            "petalCart"
          );


        if(saved){

          const parsed =
            JSON.parse(
              saved
            );


          if(Array.isArray(parsed)){

            cart =
              parsed;

          }

        }

      }catch(error){

        console.error(
          "Could not refresh cart:",
          error
        );

      }


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


/* =========================
   CUSTOMISE / ORDER
========================= */

if(customiseOrder){

  customiseOrder.addEventListener(
    "click",
    () => {

      if(cart.length === 0){

        closeCart();


        alert(
          "Please add something to your bag first ♡"
        );


        return;

      }


      const orderData = {

        products:
          cart.map(
            item => ({

              id:
                item.id,

              name:
                item.name,

              category:
                item.category,

              quantity:
                item.quantity,

              price:
                item.priceNumber,

              priceNumber:
                item.priceNumber

            })
          ),

        total:
          getCartTotal()

      };


      try{

        sessionStorage.setItem(
          "petalCartOrder",
          JSON.stringify(
            orderData
          )
        );

      }catch(error){

        console.error(
          "Could not save order:",
          error
        );

      }


      closeCart();


      /*
       * Shop page has no custom
       * form, so go to Home.
       */

      window.location.href =
        "index.html#custom";

    }
  );

}


/* =========================
   SEARCH URL
========================= */

function applyUrlSearch(){

  const params =
    new URLSearchParams(
      window.location.search
    );


  const search =
    (
      params.get(
        "search"
      ) || ""
    ).trim();


  if(!search)
    return;


  const searchTerm =
    search.toLowerCase();


  const filtered =
    products.filter(
      product => {

        const name =
          product.name
            .toLowerCase();


        const category =
          product.category
            .toLowerCase();


        const description =
          product.description
            .toLowerCase();


        return (
          name.includes(
            searchTerm
          ) ||
          category.includes(
            searchTerm
          ) ||
          description.includes(
            searchTerm
          )
        );

      }
    );


  renderSearchResults(
    filtered,
    search
  );

}


/* =========================
   SEARCH RESULTS
========================= */

function renderSearchResults(
  filtered,
  search
){

  if(!productsContainer)
    return;


  productsContainer.innerHTML =
    "";


  if(emptyState){

    emptyState.hidden =
      filtered.length !== 0;

  }


  if(filtered.length === 0){

    if(emptyState){

      emptyState.hidden =
        false;


      const title =
        emptyState.querySelector(
          "h2"
        );


      const text =
        emptyState.querySelector(
          "p"
        );


      if(title){

        title.textContent =
          `No results for "${search}"`;

      }


      if(text){

        text.textContent =
          "Try another bouquet or gift.";

      }

    }


    return;

  }


  filtered.forEach(
    product => {

      const card =
        document.createElement(
          "article"
        );


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

          ${
            product.description
              ? `
                <p class="product-description">
                  ${product.description}
                </p>
              `
              : ""
          }

          <div class="product-bottom">

            <span class="product-price">
              ${product.price}
            </span>

            <button
              type="button"
              class="add-to-bag"
              aria-label="Add ${product.name} to bag"
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


      if(addButton){

        addButton.addEventListener(
          "click",
          () =>
            addToCart(
              product
            )
        );

      }


      if(heartButton){

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

      }


      productsContainer.appendChild(
        card
      );

    }
  );

}


/* =========================
   INITIAL CART
========================= */

updateCartCount();

renderCart();

/* =========================
   SEARCH OVERLAY
========================= */

const searchOverlay =
  document.querySelector(
    "#search-overlay"
  );


const searchButton =
  document.querySelector(
    ".search-button"
  );


const searchClose =
  document.querySelector(
    "#search-close"
  );


const productSearch =
  document.querySelector(
    "#product-search"
  );


const searchClear =
  document.querySelector(
    "#search-clear"
  );


const searchResults =
  document.querySelector(
    "#search-results"
  );


const searchHint =
  document.querySelector(
    "#search-hint"
  );


function openSearch(){

  if(!searchOverlay)
    return;


  searchOverlay.classList.add(
    "open"
  );


  searchOverlay.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "search-open"
  );


  if(productSearch){

    setTimeout(
      () =>
        productSearch.focus(),
      50
    );

  }

}


function closeSearch(){

  if(!searchOverlay)
    return;


  searchOverlay.classList.remove(
    "open"
  );


  searchOverlay.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "search-open"
  );

}


if(searchButton){

  searchButton.addEventListener(
    "click",
    openSearch
  );

}


if(searchClose){

  searchClose.addEventListener(
    "click",
    closeSearch
  );

}


/* =========================
   LIVE SEARCH
========================= */

function searchProducts(
  query
){

  const value =
    query.trim().toLowerCase();


  if(!searchResults)
    return;


  if(searchClear){

    searchClear.hidden =
      !value;

  }


  if(!value){

    searchResults.innerHTML =
      "";


    if(searchHint){

      searchHint.textContent =
        "Search our blooms";

    }


    return;

  }


  const matches =
    products.filter(
      product => {

        const name =
          product.name
            .toLowerCase();


        const category =
          product.category
            .toLowerCase();


        const description =
          product.description
            .toLowerCase();


        return (
          name.includes(value) ||
          category.includes(value) ||
          description.includes(value)
        );

      }
    );


  if(searchHint){

    searchHint.textContent =
      `${matches.length} ${
        matches.length === 1
          ? "result"
          : "results"
      }`;

  }


  searchResults.innerHTML =
    "";


  if(matches.length === 0){

    searchResults.innerHTML = `

      <div class="search-no-results">

        <div>♡</div>

        <p>
          No blooms found for
          "${query}"
        </p>

      </div>

    `;


    return;

  }


  matches
    .slice(0,8)
    .forEach(
      product => {

        const item =
          document.createElement(
            "button"
          );


        item.type =
          "button";


        item.className =
          "search-result";


        item.innerHTML = `

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <span>

            <strong>
              ${product.name}
            </strong>

            <small>
              ${product.category}
            </small>

          </span>

          <b>
            ${product.price}
          </b>

        `;


        item.addEventListener(
          "click",
          () => {

            const url =
              new URL(
                window.location.href
              );


            url.searchParams.set(
              "search",
              product.name
            );


            window.location.href =
              url.toString();

          }
        );


        searchResults.appendChild(
          item
        );

      }
    );

}


if(productSearch){

  productSearch.addEventListener(
    "input",
    () =>
      searchProducts(
        productSearch.value
      )
  );


  productSearch.addEventListener(
    "keydown",
    event => {

      if(
        event.key ===
        "Enter"
      ){

        event.preventDefault();


        const value =
          productSearch.value.trim();


        if(!value)
          return;


        const url =
          new URL(
            window.location.href
          );


        url.searchParams.set(
          "search",
          value
        );


        window.location.href =
          url.toString();

      }


      if(
        event.key ===
        "Escape"
      ){

        closeSearch();

      }

    }
  );

}


if(searchClear){

  searchClear.addEventListener(
    "click",
    () => {

      if(productSearch){

        productSearch.value =
          "";

        productSearch.focus();

      }


      searchClear.hidden =
        true;


      if(searchResults){

        searchResults.innerHTML =
          "";

      }


      if(searchHint){

        searchHint.textContent =
          "Search our blooms";

      }

    }
  );

}


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "Escape"
    ){

      closeSearch();

    }

  }
);


/* =========================
   MOBILE MENU
========================= */

const menuOpen =
  document.querySelector(
    "#menu-open"
  );


const menuClose =
  document.querySelector(
    "#menu-close"
  );


const mobileDrawer =
  document.querySelector(
    "#mobile-drawer"
  );


const drawerBackdrop =
  document.querySelector(
    "#drawer-backdrop"
  );


function toggleMobileMenu(
  open
){

  if(mobileDrawer){

    mobileDrawer.classList.toggle(
      "open",
      open
    );


    mobileDrawer.setAttribute(
      "aria-hidden",
      String(!open)
    );

  }


  if(drawerBackdrop){

    drawerBackdrop.classList.toggle(
      "open",
      open
    );

  }


  document.body.classList.toggle(
    "menu-open",
    open
  );

}


if(menuOpen){

  menuOpen.addEventListener(
    "click",
    () =>
      toggleMobileMenu(
        true
      )
  );

}


if(menuClose){

  menuClose.addEventListener(
    "click",
    () =>
      toggleMobileMenu(
        false
      )
  );

}


if(drawerBackdrop){

  drawerBackdrop.addEventListener(
    "click",
    () =>
      toggleMobileMenu(
        false
      )
  );

}


if(mobileDrawer){

  mobileDrawer
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () =>
            toggleMobileMenu(
              false
            )
        );

      }
    );

}


/* =========================
   CLICK OUTSIDE SEARCH
========================= */

if(searchOverlay){

  searchOverlay.addEventListener(
    "click",
    event => {

      if(
        event.target ===
        searchOverlay
      ){

        closeSearch();

      }

    }
  );

}


/* =========================
   START
========================= */

/* =========================
   FINAL SHOP PAGE SETUP
========================= */


/*
 * Keep category state correct
 * when returning to the Shop page.
 */

function setActiveCategory(
  category
){

  categoryButtons.forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.category ===
        category
      );

    }
  );

}


/* =========================
   SEARCH PARAMETER
========================= */

function initialiseSearchState(){

  const params =
    new URLSearchParams(
      window.location.search
    );


  const search =
    (
      params.get(
        "search"
      ) || ""
    ).trim();


  if(!search)
    return;


  if(productSearch){

    productSearch.value =
      search;

  }


  if(searchClear){

    searchClear.hidden =
      false;

  }


  searchProducts(
    search
  );

}


/* =========================
   CART SYNC
========================= */

window.addEventListener(
  "storage",
  event => {

    if(
      event.key ===
      "petalCart"
    ){

      try{

        const updated =
          JSON.parse(
            event.newValue ||
            "[]"
          );


        if(
          Array.isArray(
            updated
          )
        ){

          cart =
            updated;

        }


      }catch(error){

        cart = [];

      }


      updateCartCount();

      renderCart();

    }

  }
);


/*
 * If another script changes
 * localStorage while this page
 * is open, refresh when the
 * page becomes visible again.
 */

document.addEventListener(
  "visibilitychange",
  () => {

    if(
      document.visibilityState !==
      "visible"
    ){

      return;

    }


    try{

      const saved =
        localStorage.getItem(
          "petalCart"
        );


      if(saved){

        const updated =
          JSON.parse(
            saved
          );


        if(
          Array.isArray(
            updated
          )
        ){

          cart =
            updated;

        }

      }

    }catch(error){

      console.error(
        "Cart sync failed:",
        error
      );

    }


    updateCartCount();

    renderCart();

  }
);


/* =========================
   KEYBOARD ACCESS
========================= */

document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "Escape"
    ){

      closeCart();

      toggleMobileMenu(
        false
      );

      closeSearch();

    }

  }
);


/* =========================
   INITIAL STATE
========================= */

setActiveCategory(
  selectedCategory
);


initialiseSearchState();


updateCartCount();


renderCart();


/*
 * Products API must load last,
 * because filters/search depend
 * on the loaded products.
 */

loadProducts();