/* =====================================================
   THEE PETAL AND CO.
   FINAL SCRIPT — PART 1/4
===================================================== */

const PRODUCTS_API_URL =
  "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1JfQYkc0YtSynFsAinYmj_GiSab0SuY/exec";

const PRODUCTS_CACHE_KEY =
  "petalProductsCache";

const PRODUCTS_CACHE_TIME =
  "petalProductsCacheTime";

const PRODUCTS_CACHE_MAX_AGE =
  24 * 60 * 60 * 1000;

let products = [];

let cart = JSON.parse(
  localStorage.getItem("petalCart") || "[]"
);


/* =====================================================
   BASIC HELPERS
===================================================== */

function formatPrice(price){

  const number = Number(price) || 0;

  return "₹" +
    number.toLocaleString("en-IN");

}


/* =====================================================
   PRODUCT CACHE
===================================================== */

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

    console.warn(
      "Product cache save failed:",
      error
    );

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

    const data =
      JSON.parse(cached);

    return Array.isArray(data)
      ? data
      : null;

  }catch(error){

    console.warn(
      "Product cache read failed:",
      error
    );

    return null;

  }

}


/* =====================================================
   DOM ELEMENTS
===================================================== */

const productsContainer =
  document.querySelector("#products");

const cartCountElement =
  document.querySelector("#cart-count");

const bagButton =
  document.querySelector("#bag-button");

const cartDrawer =
  document.querySelector("#cart-drawer");

const cartBackdrop =
  document.querySelector("#cart-backdrop");

const cartClose =
  document.querySelector("#cart-close");

const cartItems =
  document.querySelector("#cart-items");

const cartEmpty =
  document.querySelector("#cart-empty");

const cartTotal =
  document.querySelector("#cart-total");

const customiseOrder =
  document.querySelector("#customise-order");


/* =====================================================
   CART
===================================================== */

function saveCart(){

  localStorage.setItem(
    "petalCart",
    JSON.stringify(cart)
  );

}


function updateCartCount(){

  if(!cartCountElement){
    return;
  }

  const total =
    cart.reduce(
      function(sum,item){
        return sum + item.quantity;
      },
      0
    );

  cartCountElement.textContent =
    total;

  cartCountElement.hidden =
    total === 0;

}


function addToCart(product){

  const existing =
    cart.find(
      function(item){
        return item.id === product.id;
      }
    );

  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      id: product.id,
      name: product.name,
      priceNumber: product.priceNumber,
      price: product.price,
      image: product.image,
      quantity: 1
    });

  }

  saveCart();
  updateCartCount();
  renderCart();

  openCart();

}


function removeFromCart(productId){

  cart =
    cart.filter(
      function(item){
        return item.id !== productId;
      }
    );

  saveCart();
  updateCartCount();
  renderCart();

}


function changeCartQuantity(
  productId,
  change
){

  const item =
    cart.find(
      function(product){
        return product.id === productId;
      }
    );

  if(!item){
    return;
  }

  item.quantity += change;

  if(item.quantity <= 0){

    removeFromCart(productId);
    return;

  }

  saveCart();
  updateCartCount();
  renderCart();

}


function getCartTotal(){

  return cart.reduce(
    function(total,item){

      return total +
        (
          item.priceNumber *
          item.quantity
        );

    },
    0
  );

}


/* =====================================================
   CART DRAWER
===================================================== */

function openCart(){

  if(!cartDrawer || !cartBackdrop){
    return;
  }

  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");

}


function closeCart(){

  if(!cartDrawer || !cartBackdrop){
    return;
  }

  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");

}


function renderCart(){

  if(!cartItems){
    return;
  }

  const oldItems =
    cartItems.querySelectorAll(
      ".cart-item"
    );

  oldItems.forEach(
    function(item){
      item.remove();
    }
  );


  if(cart.length === 0){

    if(cartEmpty){
      cartEmpty.hidden = false;
    }

    if(cartTotal){
      cartTotal.textContent = "₹0";
    }

    return;

  }


  if(cartEmpty){
    cartEmpty.hidden = true;
  }


  cart.forEach(
    function(item){

      const row =
        document.createElement("div");

      row.className =
        "cart-item";


      row.innerHTML = `

        <img
            src="${item.image}"
            alt="${item.name}"
          class="cart-item-image"
        >

        <div class="cart-item-info">

          <strong>
            ${item.name}
          </strong>

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
          </div>

        </div>

        <button
          type="button"
          class="cart-remove"
          aria-label="Remove ${item.name}"
        >
          ×
        </button>

      `;


      row
        .querySelector(".qty-minus")
        .addEventListener(
          "click",
          function(){

            changeCartQuantity(
              item.id,
              -1
            );

          }
        );


      row
        .querySelector(".qty-plus")
        .addEventListener(
          "click",
          function(){

            changeCartQuantity(
              item.id,
              1
            );

          }
        );


      row
        .querySelector(".cart-remove")
        .addEventListener(
          "click",
          function(){

            removeFromCart(
              item.id
            );

          }
        );


      cartItems.appendChild(row);

    }
  );


  if(cartTotal){

    cartTotal.textContent =
      formatPrice(
        getCartTotal()
      );

  }

}


/* =====================================================
   CART EVENTS
===================================================== */

if(bagButton){

  bagButton.addEventListener(
    "click",
    function(){

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


if(customiseOrder){

  customiseOrder.addEventListener(
    "click",
    function(){

      closeCart();

      const customSection =
        document.querySelector(
          "#custom"
        );

      if(customSection){

        customSection.scrollIntoView({
          behavior: "smooth"
        });

      }else{

        window.location.href =
          "index.html#custom";

      }

    }
  );

}


/* =====================================================
   INITIAL CART
===================================================== */

updateCartCount();
renderCart();

/* =====================================================
   SEARCH
===================================================== */

const searchOverlay =
  document.querySelector("#search-overlay");

const searchClose =
  document.querySelector("#search-close");

const searchInput =
  document.querySelector("#product-search");

const searchClear =
  document.querySelector("#search-clear");

const searchResults =
  document.querySelector("#search-results");

const searchHint =
  document.querySelector("#search-hint");


function openSearch(){

  if(!searchOverlay){
    return;
  }

  searchOverlay.classList.add("open");
  searchOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  if(searchInput){

    setTimeout(
      function(){
        searchInput.focus();
      },
      100
    );

  }

}


function closeSearch(){

  if(!searchOverlay){
    return;
  }

  searchOverlay.classList.remove("open");
  searchOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

}


function searchProducts(query){

  const text =
    String(query || "")
      .trim()
      .toLowerCase();

  if(!text){
    return [];
  }

  return products.filter(
    function(product){

      const searchable = [
        product.name,
        product.category,
        product.description
      ]
      .join(" ")
      .toLowerCase();

      return searchable.includes(text);

    }
  );

}


function renderSearchResults(query){

  if(!searchResults){
    return;
  }

  searchResults.innerHTML = "";

  const text =
    String(query || "").trim();


  if(!text){

    if(searchHint){
      searchHint.textContent =
        "Search our blooms";
    }

    if(searchClear){
      searchClear.hidden = true;
    }

    return;

  }


  if(searchClear){
    searchClear.hidden = false;
  }


  const results =
    searchProducts(text);


  if(searchHint){

    searchHint.textContent =
      results.length
        ? `${results.length} bloom${results.length > 1 ? "s" : ""} found`
        : "No blooms found";

  }


  results.forEach(
    function(product){

      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "search-result";


      button.innerHTML = `

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
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


      button.addEventListener(
        "click",
        function(){

          closeSearch();

          const shopUrl =
            "shop.html?search=" +
            encodeURIComponent(
              product.name
            );

          window.location.href =
            shopUrl;

        }
      );


      searchResults.appendChild(
        button
      );

    }
  );

}


/* Search button(s) */

document
  .querySelectorAll(".search-button")
  .forEach(
    function(button){

      button.addEventListener(
        "click",
        openSearch
      );

    }
  );


if(searchClose){

  searchClose.addEventListener(
    "click",
    closeSearch
  );

}


if(searchInput){

  searchInput.addEventListener(
    "input",
    function(){

      renderSearchResults(
        searchInput.value
      );

    }
  );

}


if(searchClear){

  searchClear.addEventListener(
    "click",
    function(){

      if(searchInput){

        searchInput.value = "";
        searchInput.focus();

      }

      renderSearchResults("");

    }
  );

}


if(searchOverlay){

  searchOverlay.addEventListener(
    "click",
    function(event){

      if(
        event.target ===
        searchOverlay
      ){

        closeSearch();

      }

    }
  );

}


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(
  "keydown",
  function(event){

    if(
      event.key === "Escape"
    ){

      closeSearch();
      closeCart();

    }

  }
);

/* =====================================================
   HOME PRODUCTS — FIXED / INSTANT LOAD
===================================================== */

/*
  HOME_PRODUCTS sirf Home page ke liye hain.
  Shop page apne Google Sheet se products load karta hai.

  Jab actual products ready hon, isi array mein
  NAME / PRICE / DESCRIPTION / IMAGE edit karna hai.
*/

const HOME_PRODUCTS = [

  {
    id: "P001",
    name: "The Pink Promise",
    priceNumber: 899,
    price: "₹899",
    category: "Bouquets",
    description: "A soft handmade pink flower bouquet, tied with love.",
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
    bestSeller: true,
    newArrival: false,
    active: true
  },

  {
    id: "P002",
    name: "Strawberry Fields",
    priceNumber: 699,
    price: "₹699",
    category: "Handmade Flowers",
    description: "A sweet handmade bloom arrangement for a little surprise.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    bestSeller: false,
    newArrival: true,
    active: true
  },

  {
    id: "P003",
    name: "Sunshine, Always",
    priceNumber: 799,
    price: "₹799",
    category: "Bouquets",
    description: "A cheerful handmade bouquet made to brighten their day.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=900&q=85",
    bestSeller: false,
    newArrival: false,
    active: true
  },

  {
    id: "P004",
    name: "A Little Something",
    priceNumber: 499,
    price: "₹499",
    category: "Just Because",
    description: "A simple handmade gift for no reason other than love.",
    image: "https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85",
    bestSeller: false,
    newArrival: true,
    active: true
  }

];

products = HOME_PRODUCTS.slice();


function renderHomeProducts(){

  if(!productsContainer){
    return;
  }

  productsContainer.innerHTML = "";

  HOME_PRODUCTS
    .filter(function(product){
      return product.active;
    })
    .slice(0, 8)
    .forEach(function(product, index){

      const card =
        document.createElement("article");

      card.className = "product-card";

      const tag =
        product.bestSeller
          ? "Best Seller"
          : product.newArrival
            ? "New In"
            : "";

      card.innerHTML = `

        <div class="product-image-wrap">

          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
            ${index < 4
              ? 'loading="eager" fetchpriority="high"'
              : 'loading="lazy"'}
          >

          ${tag
            ? `<span class="product-tag">${tag}</span>`
            : ""}

        </div>

        <div class="product-info">

          <h3>${product.name}</h3>

          <p class="product-description">
            ${product.description}
          </p>

          <div class="product-bottom">

            <span class="product-price">
              ${product.price}
            </span>

            <button
              type="button"
              class="add-to-bag"
              aria-label="Add ${product.name} to bag"
            >
              +
            </button>

          </div>

        </div>

      `;

      const addButton =
        card.querySelector(".add-to-bag");

      if(addButton){
        addButton.addEventListener(
          "click",
          function(event){
            event.preventDefault();
            event.stopPropagation();
            addToCart(product);
          }
        );
      }

      productsContainer.appendChild(card);

    });

}


/* Home should never wait for Google Sheet. */
renderHomeProducts();


/* =====================================================
   INSTAGRAM
===================================================== */

const instagramImages = [
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=500&q=80"
];

const instagramRoot =
  document.querySelector(
    "#instagram-grid"
  );


if(instagramRoot){

  instagramImages.forEach(
    function(src, index){

      const link =
        document.createElement("a");

      link.href =
        "https://instagram.com/thhepetalandco";

      link.target = "_blank";
      link.rel = "noreferrer";


      link.innerHTML = `

        <img
          src="${src}"
          alt="Instagram post ${index + 1}"
          loading="lazy"
        >

      `;


      instagramRoot.appendChild(
        link
      );

    }
  );

}


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileMenu =
  document.querySelector(
    "#mobile-drawer"
  );

const menuBackdrop =
  document.querySelector(
    "#drawer-backdrop"
  );

const menuOpen =
  document.querySelector(
    "#menu-open"
  );

const menuClose =
  document.querySelector(
    "#menu-close"
  );


function toggleMenu(open){

  if(!mobileMenu){
    return;
  }


  mobileMenu.classList.toggle(
    "open",
    open
  );


  if(menuBackdrop){

    menuBackdrop.classList.toggle(
      "open",
      open
    );

  }


  mobileMenu.setAttribute(
    "aria-hidden",
    String(!open)
  );

}


if(menuOpen){

  menuOpen.addEventListener(
    "click",
    function(){
      toggleMenu(true);
    }
  );

}


if(menuClose){

  menuClose.addEventListener(
    "click",
    function(){
      toggleMenu(false);
    }
  );

}


if(menuBackdrop){

  menuBackdrop.addEventListener(
    "click",
    function(){
      toggleMenu(false);
    }
  );

}


if(mobileMenu){

  mobileMenu
    .querySelectorAll("a")
    .forEach(
      function(link){

        link.addEventListener(
          "click",
          function(){
            toggleMenu(false);
          }
        );

      }
    );

}


/* =====================================================
   CUSTOM ORDER FORM + PHOTO UPLOAD
===================================================== */

const customForm =
  document.querySelector(
    "#custom-form"
  );

const successMessage =
  document.querySelector(
    "#form-success"
  );

const photoInput =
  document.querySelector(
    "#photo"
  );

const photoData =
  document.querySelector(
    "#photoData"
  );

const photoName =
  document.querySelector(
    "#photoName"
  );

const photoMimeType =
  document.querySelector(
    "#photoMimeType"
  );


if(customForm){

  customForm.addEventListener(
    "submit",
    function(event){

      event.preventDefault();


      const file =
        photoInput &&
        photoInput.files &&
        photoInput.files[0];


      /*
        No photo:
        existing Apps Script form
        ko normally submit karo.
      */

      if(!file){

        customForm.submit();

        setTimeout(
          function(){

            if(successMessage){

              successMessage.hidden =
                false;

            }

            customForm.reset();

          },
          1500
        );

        return;

      }


      /*
        Photo ko compress karke
        Apps Script ko bhejna.
      */

      const reader =
        new FileReader();


      reader.onload =
        function(){

          const img =
            new Image();


          img.onload =
            function(){

              const canvas =
                document.createElement(
                  "canvas"
                );


              const maxWidth = 1200;
              const maxHeight = 1200;


              let width =
                img.width;

              let height =
                img.height;


              if(width > maxWidth){

                height =
                  height *
                  (
                    maxWidth /
                    width
                  );

                width =
                  maxWidth;

              }


              if(height > maxHeight){

                width =
                  width *
                  (
                    maxHeight /
                    height
                  );

                height =
                  maxHeight;

              }


              canvas.width =
                width;

              canvas.height =
                height;


              const ctx =
                canvas.getContext(
                  "2d"
                );


              ctx.drawImage(
                img,
                0,
                0,
                width,
                height
              );


              const compressedData =
                canvas.toDataURL(
                  "image/jpeg",
                  0.75
                );


              if(photoData){

                photoData.value =
                  compressedData;

              }


              if(photoName){

                photoName.value =
                  file.name
                    .replace(
                      /\.[^/.]+$/,
                      ""
                    ) +
                  ".jpg";

              }


              if(photoMimeType){

                photoMimeType.value =
                  "image/jpeg";

              }


              customForm.submit();


              setTimeout(
                function(){

                  if(successMessage){

                    successMessage.hidden =
                      false;

                  }

                  customForm.reset();

                },
                1500
              );

            };


          img.src =
            reader.result;

        };


      reader.readAsDataURL(file);

    }
  );

}


/* =====================================================
   FINAL INITIALIZATION
===================================================== */

updateCartCount();
renderCart();

console.log(
  "THEE PETAL AND CO. loaded successfully."
);