const PRODUCTS_API_URL =
  "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1J1FQYkc0YtSynFsAinYmj_GiSab0SuY/exec";

const PRODUCTS_CACHE_KEY =
  "petalProductsCache";

const PRODUCTS_CACHE_TIME =
  "petalProductsCacheTime";

const PRODUCTS_CACHE_MAX_AGE =
  24 * 60 * 60 * 1000;

let products = [];


/* =========================
   PRODUCT CACHE
========================= */

function saveProductsCache(data){
  try{
    localStorage.setItem(
      PRODUCTS_CACHE_KEY,
      JSON.stringify(data)
    );

    localStorage.setItem(
      PRODUCTS_CACHE_TIME,
      String(Date.now())
    );
  }catch(error){
    console.warn("Product cache could not be saved:", error);
  }
}


function getProductsCache(){
  try{
    const cached =
      localStorage.getItem(
        PRODUCTS_CACHE_KEY
      );

    if(!cached){
      return null;
    }

    return JSON.parse(cached);

  }catch(error){
    console.warn("Product cache could not be read:", error);
    return null;
  }
}


function isProductsCacheFresh(){
  try{
    const savedTime =
      Number(
        localStorage.getItem(
          PRODUCTS_CACHE_TIME
        )
      );

    if(!savedTime){
      return false;
    }

    return (
      Date.now() - savedTime
      < PRODUCTS_CACHE_MAX_AGE
    );

  }catch(error){
    return false;
  }
}

async function loadProductsFromSheet(){

  if(!productsContainer){
    return;
  }

  /*
   * STEP 1
   * Pehle cached products dikhao
   */
  const cachedProducts =
    getProductsCache();

  if(
    Array.isArray(cachedProducts) &&
    cachedProducts.length > 0
  ){

    products =
      cachedProducts;

    renderHomeProducts();
  }


  /*
   * STEP 2
   * Google Sheet se latest products
   * background mein load karo
   */
  try{

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          cache:"no-store"
        }
      );

    if(!response.ok){
      throw new Error(
        "Products API failed"
      );
    }

    const data =
      await response.json();

    if(!Array.isArray(data)){
      throw new Error(
        "Invalid products data"
      );
    }


    /*
     * Sheet data ko website format mein convert
     */
    const freshProducts =
      data
      .map(function(item,index){

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
              ).padStart(3,"0")}`
            ),

          name:
            String(
              item.NAME || ""
            ).trim(),

          priceNumber:
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
            .toUpperCase()
            === "YES",

          newArrival:
            String(
              item.NEW_ARRIVAL || ""
            )
            .trim()
            .toUpperCase()
            === "YES",

          active:
            String(
              item.ACTIVE || ""
            )
            .trim()
            .toUpperCase()
            === "YES"
        };

      })
      .filter(function(product){

        return (
          product.active &&
          product.name &&
          product.priceNumber > 0 &&
          product.image
        );

      });


    /*
     * Latest Sheet data save
     * aur screen update
     */
    products =
      freshProducts;

    saveProductsCache(
      freshProducts
    );

    renderHomeProducts();


  }catch(error){

    console.error(
      "Could not load products from Google Sheet:",
      error
    );


    /*
     * Agar cache bhi nahi hai
     * tabhi error message dikhao
     */
    if(
      !Array.isArray(cachedProducts) ||
      cachedProducts.length === 0
    ){

      productsContainer.innerHTML = `
        <div class="shop-empty">
          <div>♡</div>
          <h2>Our blooms are resting</h2>
          <p>Please check back in a little while.</p>
        </div>
      `;

    }

  }
}

function renderHomeProducts(){

  if(!productsContainer){
    return;
  }

  productsContainer.innerHTML = "";

  const homeProducts =
    products
      .filter(function(product){
        return product.active;
      })
      .slice(0,8);


  if(homeProducts.length === 0){

    productsContainer.innerHTML = `
      <div class="shop-empty">
        <div>♡</div>
        <h2>Something lovely is coming</h2>
        <p>We're still making something lovely.</p>
      </div>
    `;

    return;
  }


  homeProducts.forEach(function(product){

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
          fetchpriority="high"
        >

        ${
          product.bestSeller
            ? `<span class="product-tag">best seller</span>`
            : ""
        }

        <button
          type="button"
          class="product-heart"
          aria-label="Save ${product.name} to bag"
        >
          ♡
        </button>

      </div>


      <div class="product-info">

        <h3>${product.name}</h3>

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
        function(){

          addToCart(product);

        }
      );

    }


    if(heartButton){

      heartButton.addEventListener(
        "click",
        function(){

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

  });

}

function startProductLoading(){

  /*
   * Cache available hai to products
   * turant show honge.
   *
   * Sheet background mein update hoti rahegi.
   */
  loadProductsFromSheet();

}


/* =========================
   SEARCH
========================= */

function searchProducts(query){

  const searchText =
    String(query || "")
      .trim()
      .toLowerCase();

  if(!searchText){
    return [];
  }

  return products.filter(function(product){

    return (
      product.name
        .toLowerCase()
        .includes(searchText) ||

      product.category
        .toLowerCase()
        .includes(searchText) ||

      product.description
        .toLowerCase()
        .includes(searchText)
    );

  });

}


/* =========================
   START
========================= */

if(
  document.readyState === "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    startProductLoading
  );

}else{

  startProductLoading();

}