/* =========================
   THEE PETAL AND CO.
   HOME SCRIPT
   PART 1/4
========================= */


/* =========================
   PRODUCTS API
========================= */

const PRODUCTS_API_URL =
  "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1JfQYkc0YtSynFsAinYmj_GiSab0SuY/exec";


let products = [];


/* =========================
   INSTAGRAM IMAGES
========================= */

const instagramImages = [
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85"
];


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
      JSON.parse(
        savedCart
      );


    if(Array.isArray(parsed)){

      cart =
        parsed;

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
      JSON.stringify(
        cart
      )
    );

  }catch(error){

    console.error(
      "Could not save cart:",
      error
    );

  }

}


/* =========================
   DOM ELEMENTS
========================= */

const productsContainer =
  document.querySelector(
    "#products"
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
   PRICE FORMAT
========================= */

function formatPrice(
  amount
){

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
   ADD PRODUCT TO CART
========================= */

function addToCart(
  product
){

  const existing =
    cart.find(
      item =>
        item.id ===
        product.id
    );


  if(existing){

    existing.quantity +=
      1;

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
   REMOVE FROM CART
========================= */

function removeFromCart(
  id
){

  cart =
    cart.filter(
      item =>
        item.id !== id
    );


  saveCart();

  updateCart();

}


/* =========================
   CHANGE QUANTITY
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
   CART TOTAL
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
   UPDATE CART
========================= */

function updateCart(){

  updateCartCount();

  renderCart();

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


      row
        .querySelector(
          ".qty-minus"
        )
        .addEventListener(
          "click",
          () =>
            changeQuantity(
              item.id,
              -1
            )
        );


      row
        .querySelector(
          ".qty-plus"
        )
        .addEventListener(
          "click",
          () =>
            changeQuantity(
              item.id,
              1
            )
        );


      row
        .querySelector(
          ".cart-remove"
        )
        .addEventListener(
          "click",
          () =>
            removeFromCart(
              item.id
            )
        );


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
   CART ORDER DATA
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


      sessionStorage.setItem(
        "petalCartOrder",
        JSON.stringify(
          orderData
        )
      );


      closeCart();


      const customSection =
        document.querySelector(
          "#custom"
        );


      if(customSection){

        customSection.scrollIntoView({
          behavior:
            "smooth"
        });

      }else{

        window.location.href =
          "index.html#custom";

      }

    }
  );

}

/* =========================
   LOAD PRODUCTS FROM SHEET
========================= */

async function loadProductsFromSheet(){

  if(!productsContainer)
    return;


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


    if(!Array.isArray(data)){

      throw new Error(
        "Invalid products data"
      );

    }


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


    renderHomeProducts();


  }catch(error){

    console.error(
      "Could not load products from Google Sheet:",
      error
    );


    productsContainer.innerHTML = `

      <div class="shop-empty">

        <div>♡</div>

        <h2>
          Our blooms are resting
        </h2>

        <p>
          Please check back in a little while.
        </p>

      </div>

    `;

  }

}


/* =========================
   RENDER HOME PRODUCTS
========================= */

function renderHomeProducts(){

  if(!productsContainer)
    return;


  productsContainer.innerHTML =
    "";


  /*
   * Show only active products
   * received from Google Sheet.
   */

  const homeProducts =
    products
      .filter(
        product =>
          product.active
      )
      .slice(
        0,
        8
      );


  if(homeProducts.length === 0){

    productsContainer.innerHTML = `

      <div class="shop-empty">

        <div>♡</div>

        <h2>
          Something lovely is coming
        </h2>

        <p>
          We're still making something lovely.
        </p>

      </div>

    `;


    return;

  }


  homeProducts.forEach(
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
            loading="lazy"
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
   HOME SEARCH
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
   SEARCH PRODUCTS
========================= */

function searchHomeProducts(
  query
){

  const value =
    query
      .trim()
      .toLowerCase();


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
    .slice(
      0,
      8
    )
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


        item.dataset.productName =
          product.name;


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

            /*
             * Open the Shop page
             * with this exact product
             * as the search query.
             */

            window.location.href =
              "shop.html?search=" +
              encodeURIComponent(
                product.name
              );

          }
        );


        searchResults.appendChild(
          item
        );

      }
    );

}


/* =========================
   SEARCH INPUT
========================= */

if(productSearch){

  productSearch.addEventListener(
    "input",
    () =>
      searchHomeProducts(
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


        window.location.href =
          "shop.html?search=" +
          encodeURIComponent(
            value
          );

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
   SEARCH OUTSIDE CLICK
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
   CUSTOM ORDER FORM
========================= */

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
        photoInput.files
          ? photoInput.files[0]
          : null;


      /*
       * No photo selected.
       */

      if(!file){

        customForm.submit();


        setTimeout(
          () => {

            if(successMessage){

              successMessage.hidden =
                false;

            }

          },
          1500
        );


        return;

      }


      /*
       * Compress the image
       * before sending it to
       * Google Apps Script.
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


              const maxWidth =
                1200;


              const maxHeight =
                1200;


              let width =
                img.width;


              let height =
                img.height;


              if(
                width >
                maxWidth
              ){

                height =
                  height *
                  (
                    maxWidth /
                    width
                  );


                width =
                  maxWidth;

              }


              if(
                height >
                maxHeight
              ){

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


              if(!ctx){

                customForm.submit();

                return;

              }


              ctx.drawImage(
                img,
                0,
                0,
                width,
                height
              );


              const compressed =
                canvas.toDataURL(
                  "image/jpeg",
                  0.75
                );


              if(photoData){

                photoData.value =
                  compressed;

              }


              if(photoName){

                photoName.value =
                  file.name.replace(
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
                () => {

                  if(successMessage){

                    successMessage.hidden =
                      false;

                  }

                },
                1500
              );

            };


          img.src =
            reader.result;

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}


/* =========================
   RESTORE CART ORDER
========================= */

function restoreCartOrder(){

  try{

    const savedOrder =
      sessionStorage.getItem(
        "petalCartOrder"
      );


    if(!savedOrder)
      return;


    const order =
      JSON.parse(
        savedOrder
      );


    if(
      !order ||
      !Array.isArray(
        order.products
      ) ||
      order.products.length === 0
    ){

      return;

    }


    const productField =
      document.querySelector(
        "#product"
      );


    const budgetField =
      document.querySelector(
        "#budget"
      );


    const messageField =
      document.querySelector(
        "#message"
      );


    const categories =
      order.products
        .map(
          item =>
            String(
              item.category ||
              ""
            ).trim()
        )
        .filter(Boolean);


    const uniqueCategories =
      [
        ...new Set(
          categories
        )
      ];


    const categoryText =
      uniqueCategories.join(
        " + "
      );


    const productDetails =
      order.products
        .map(
          item => {

            const price =
              formatPrice(
                item.priceNumber ||
                item.price
              );


            return (
              `${item.name} × ` +
              `${item.quantity} ` +
              `(${price} each)`
            );

          }
        )
        .join("\n");


    const total =
      Number(
        order.total ||
        0
      );


    const totalText =
      formatPrice(
        total
      );


    /* =====================
       PRODUCT TYPE
    ===================== */

    if(productField){

      if(
        productField.tagName ===
        "SELECT"
      ){

        const matchingOption =
          [
            ...productField.options
          ].find(
            option =>
              option.value
                .toLowerCase() ===
              categoryText
                .toLowerCase()
          );


        if(
          matchingOption &&
          !categoryText.includes(
            "+"
          )
        ){

          productField.value =
            matchingOption.value;

        }else{

          const old =
            productField.querySelector(
              'option[data-cart-order="true"]'
            );


          if(old){

            old.remove();

          }


          const option =
            document.createElement(
              "option"
            );


          option.value =
            categoryText ||
            "Custom Gifts";


          option.textContent =
            categoryText
              ? `Cart: ${categoryText}`
              : "Cart Order";


          option.selected =
            true;


          option.dataset.cartOrder =
            "true";


          productField.insertBefore(
            option,
            productField.firstChild
          );

        }

      }else{

        productField.value =
          categoryText ||
          "Custom Gifts";

      }

    }


    /* =====================
       BUDGET
    ===================== */

    if(budgetField){

      if(
        budgetField.tagName ===
        "SELECT"
      ){

        const old =
          budgetField.querySelector(
            'option[data-cart-budget="true"]'
          );


        if(old){

          old.remove();

        }


        const option =
          document.createElement(
            "option"
          );


        option.value =
          totalText;


        option.textContent =
          `Cart Total: ${totalText}`;


        option.selected =
          true;


        option.dataset.cartBudget =
          "true";


        budgetField.insertBefore(
          option,
          budgetField.firstChild
        );

      }else{

        budgetField.value =
          totalText;

      }

    }


    /* =====================
       MESSAGE
    ===================== */

    if(messageField){

      const orderText =
`Selected Cart Items:
${productDetails}

Categories:
${categoryText || "Custom Gifts"}

Total:
${totalText}`;


      const existing =
        messageField.value.trim();


      const marker =
        "Selected Cart Items:";


      let cleanExisting =
        existing;


      const oldIndex =
        cleanExisting.indexOf(
          marker
        );


      if(
        oldIndex !==
        -1
      ){

        cleanExisting =
          cleanExisting
            .substring(
              0,
              oldIndex
            )
            .trim();

      }


      messageField.value =
        cleanExisting
          ? `${cleanExisting}\n\n${orderText}`
          : orderText;

    }


    /*
     * Temporary navigation
     * data is no longer needed.
     */

    sessionStorage.removeItem(
      "petalCartOrder"
    );


  }catch(error){

    console.error(
      "Could not restore cart order:",
      error
    );

  }

}

/* =========================
   INSTAGRAM GRID
========================= */

const instagramGrid =
  document.querySelector(
    "#instagram-grid"
  );


if(instagramGrid){

  instagramGrid.innerHTML =
    "";


  instagramImages.forEach(
    image => {

      const link =
        document.createElement(
          "a"
        );


      link.href =
        "https://instagram.com/thhepetalandco";


      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";


      const img =
        document.createElement(
          "img"
        );


      img.src =
        image;


      img.alt =
        "THEE PETAL AND CO Instagram";


      img.loading =
        "lazy";


      link.appendChild(
        img
      );


      instagramGrid.appendChild(
        link
      );

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

      closeCart();

      toggleMobileMenu(
        false
      );

    }

  }
);


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


/* =========================
   REFRESH CART WHEN
   PAGE BECOMES VISIBLE
========================= */

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
        "Could not sync cart:",
        error
      );

    }


    updateCartCount();

    renderCart();

  }
);


/* =========================
   INITIAL CART
========================= */

updateCartCount();

renderCart();


/* =========================
   LOAD PRODUCTS
   FROM GOOGLE SHEET
========================= */

loadProductsFromSheet();


/* =========================
   RESTORE CART ORDER
========================= */

restoreCartOrder();