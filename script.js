const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbwOkwuQQDuGm8Ndx08pKKkklXkJCr4agUtUJ1JfQYkc0YtSynFsAinYmj_GiSab0SuY/exec";


/* =========================
   FALLBACK PRODUCTS
========================= */

let products = [
  {
    id: 'P001',
    name: 'The Pink Promise',
    price: '₹899',
    priceNumber: 899,
    tag: 'best seller',
    category: 'Bouquets',
    description: 'Handmade pink flower bouquet',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'P002',
    name: 'Strawberry Fields',
    price: '₹699',
    priceNumber: 699,
    tag: 'new in',
    category: 'Bouquets',
    description: 'Beautiful handmade floral arrangement',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'P003',
    name: 'Sunshine, Always',
    price: '₹799',
    priceNumber: 799,
    tag: '',
    category: 'Bouquets',
    description: 'A cheerful handmade flower bouquet',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'P004',
    name: 'A Little Something',
    price: '₹499',
    priceNumber: 499,
    tag: '',
    category: 'Gifts',
    description: 'A sweet handmade little gift',
    image: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85'
  }
];


/* =========================
   INSTAGRAM
========================= */

const instagramImages = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=500&q=80'
];


/* =========================
   BASIC HELPERS
========================= */

let cart = [];

try {

  const savedCart =
    localStorage.getItem('petalCart');

  if(savedCart){

    const parsedCart =
      JSON.parse(savedCart);

    if(Array.isArray(parsedCart)){
      cart = parsedCart;
    }

  }

}catch(error){

  console.error(
    'Could not load saved cart:',
    error
  );

}


function saveCart(){

  try{

    localStorage.setItem(
      'petalCart',
      JSON.stringify(cart)
    );

  }catch(error){

    console.error(
      'Could not save cart:',
      error
    );

  }

}


function formatPrice(amount){

  return '₹' +
    Number(amount || 0)
      .toLocaleString('en-IN');

}


/* =========================
   DOM ELEMENTS
========================= */

const bagButton =
  document.querySelector('#bag-button');

const cartCount =
  document.querySelector('#cart-count');

const cartDrawer =
  document.querySelector('#cart-drawer');

const cartBackdrop =
  document.querySelector('#cart-backdrop');

const cartItems =
  document.querySelector('#cart-items');

const cartEmpty =
  document.querySelector('#cart-empty');

const cartTotal =
  document.querySelector('#cart-total');

const cartClose =
  document.querySelector('#cart-close');

const customiseOrder =
  document.querySelector(
    '#customise-order,#customize-order,#checkout-button,.customise-order'
  );


/* =========================
   CART COUNT
========================= */

function updateCartCount(){

  if(!cartCount) return;

  const count =
    cart.reduce(
      (total,item) =>
        total + Number(item.quantity || 0),
      0
    );

  cartCount.textContent =
    count;

  cartCount.hidden =
    count === 0;

}


/* =========================
   ADD TO CART
========================= */

function addToCart(product){

  const existing =
    cart.find(
      item =>
        item.id === product.id ||
        item.name === product.name
    );


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      ...product,
      quantity: 1
    });

  }


  saveCart();

  updateCartCount();
  renderCart();
  openCart();

}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(name){

  cart =
    cart.filter(
      item =>
        item.name !== name
    );


  saveCart();

  updateCartCount();
  renderCart();

}


/* =========================
   QUANTITY
========================= */

function changeQuantity(
  name,
  change
){

  const item =
    cart.find(
      product =>
        product.name === name
    );


  if(!item) return;


  item.quantity += change;


  if(item.quantity <= 0){

    removeFromCart(name);
    return;

  }


  saveCart();

  updateCartCount();
  renderCart();

}


/* =========================
   CART TOTAL
========================= */

function getCartTotal(){

  return cart.reduce(
    (total,item) =>
      total +
      Number(item.priceNumber || 0) *
      Number(item.quantity || 0),
    0
  );

}

/* =========================
   RENDER CART
========================= */

function renderCart(){

  if(!cartItems) return;

  cartItems.innerHTML = '';


  if(cart.length === 0){

    if(cartEmpty)
      cartItems.appendChild(cartEmpty);

    if(cartTotal)
      cartTotal.textContent = '₹0';

    return;
  }


  cart.forEach(item => {

    const el =
      document.createElement('div');

    el.className =
      'cart-item';


    el.innerHTML = `

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
          ${formatPrice(item.priceNumber)}
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


    el.querySelector(
      '.qty-minus'
    ).addEventListener(
      'click',
      () =>
        changeQuantity(
          item.name,
          -1
        )
    );


    el.querySelector(
      '.qty-plus'
    ).addEventListener(
      'click',
      () =>
        changeQuantity(
          item.name,
          1
        )
    );


    el.querySelector(
      '.cart-remove'
    ).addEventListener(
      'click',
      () =>
        removeFromCart(
          item.name
        )
    );


    cartItems.appendChild(el);

  });


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

  if(cartDrawer)
    cartDrawer.classList.add(
      'open'
    );


  if(cartBackdrop)
    cartBackdrop.classList.add(
      'open'
    );


  document.body.classList.add(
    'cart-open'
  );

}


/* =========================
   CLOSE CART
========================= */

function closeCart(){

  if(cartDrawer)
    cartDrawer.classList.remove(
      'open'
    );


  if(cartBackdrop)
    cartBackdrop.classList.remove(
      'open'
    );


  document.body.classList.remove(
    'cart-open'
  );

}


/* =========================
   CART BUTTON
========================= */

if(bagButton){

  bagButton.addEventListener(
    'click',
    () => {

      renderCart();

      openCart();

    }
  );

}


if(cartClose){

  cartClose.addEventListener(
    'click',
    closeCart
  );

}


if(cartBackdrop){

  cartBackdrop.addEventListener(
    'click',
    closeCart
  );

}


/* =========================
   CUSTOM ORDER HELPERS
========================= */

function getCartProductText(){

  return cart
    .map(
      item =>
        `${item.name} × ${item.quantity}`
    )
    .join(', ');

}


function getCartCategoryText(){

  const categories =
    cart
      .map(
        item =>
          String(
            item.category || ''
          ).trim()
      )
      .filter(Boolean);


  const uniqueCategories =
    [...new Set(categories)];


  return uniqueCategories.join(
    ' + '
  );

}


function getCartDetailsText(){

  return cart
    .map(item => {

      const category =
        item.category
          ? ` — ${item.category}`
          : '';

      const price =
        formatPrice(
          item.priceNumber
        );

      return (
        `${item.name}${category} × ${item.quantity} ` +
        `(${price} each)`
      );

    })
    .join('\n');

}


/* =========================
   CUSTOMISE / ORDER
========================= */

if(customiseOrder){

  customiseOrder.addEventListener(
    'click',
    () => {

      if(cart.length === 0){

        closeCart();

        const section =
          document.querySelector(
            '#custom'
          );


        if(section){

          section.scrollIntoView({
            behavior:'smooth'
          });

        }

        return;

      }


      const selectedProducts =
        getCartProductText();


      const categoryText =
        getCartCategoryText();


      const total =
        getCartTotal();


      const totalText =
        formatPrice(total);


      const details =
        getCartDetailsText();


      /* =====================
         PRODUCT FIELD
      ===================== */

      const productField =
        document.querySelector(
          '#product'
        );


      if(productField){

        if(
          productField.tagName ===
          'SELECT'
        ){

          /*
           * Remove previous
           * cart-created option.
           */

          const old =
            productField.querySelector(
              'option[data-cart-order="true"]'
            );


          if(old)
            old.remove();


          /*
           * If there is one
           * category, select the
           * real category option.
           */

          const matchingOption =
            [...productField.options]
              .find(
                option =>
                  option.value
                    .toLowerCase() ===
                  categoryText
                    .toLowerCase()
              );


          if(
            matchingOption &&
            !categoryText.includes('+')
          ){

            productField.value =
              matchingOption.value;

          }else{

            /*
             * Multiple categories:
             * create temporary option.
             */

            const option =
              document.createElement(
                'option'
              );


            option.value =
              categoryText ||
              selectedProducts;


            option.textContent =
              categoryText
                ? `Cart: ${categoryText}`
                : selectedProducts;


            option.selected =
              true;


            option.dataset.cartOrder =
              'true';


            productField.insertBefore(
              option,
              productField.firstChild
            );

          }


          productField.dispatchEvent(
            new Event(
              'change',
              {
                bubbles:true
              }
            )
          );

        }else{

          productField.value =
            categoryText ||
            selectedProducts;

        }

      }


      /* =====================
         BUDGET FIELD
      ===================== */

      const budgetField =
        document.querySelector(
          '#budget'
        );


      if(budgetField){

        if(
          budgetField.tagName ===
          'SELECT'
        ){

          const old =
            budgetField.querySelector(
              'option[data-cart-budget="true"]'
            );


          if(old)
            old.remove();


          const option =
            document.createElement(
              'option'
            );


          option.value =
            totalText;


          option.textContent =
            `Cart Total: ${totalText}`;


          option.selected =
            true;


          option.dataset.cartBudget =
            'true';


          budgetField.insertBefore(
            option,
            budgetField.firstChild
          );


          budgetField.dispatchEvent(
            new Event(
              'change',
              {
                bubbles:true
              }
            )
          );

        }else{

          budgetField.value =
            totalText;

        }

      }


      /* =====================
         MESSAGE FIELD
      ===================== */

      const messageField =
        document.querySelector(
          '#message'
        );


      if(messageField){

        const orderText =
`Selected Cart Items:
${details}

Categories:
${categoryText || 'Custom'}

Total:
${totalText}`;


        const existing =
          messageField.value.trim();


        /*
         * Remove old automatically
         * generated cart details.
         */

        const marker =
          'Selected Cart Items:';


        let cleanExisting =
          existing;


        const oldIndex =
          cleanExisting.indexOf(
            marker
          );


        if(oldIndex !== -1){

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
       * Save order data too.
       * This is useful if the page
       * reloads before submitting.
       */

      try{

        sessionStorage.setItem(
          'petalCartOrder',
          JSON.stringify({
            products: cart,
            categories: categoryText,
            total: total
          })
        );

      }catch(error){

        console.error(
          'Could not save order data:',
          error
        );

      }


      closeCart();


      const section =
        document.querySelector(
          '#custom'
        );


      if(section){

        section.scrollIntoView({
          behavior:'smooth'
        });

      }


      setTimeout(
        () => {

          if(productField)
            productField.focus();

        },
        700
      );

    }
  );

}

/* =========================
   PRODUCT CARDS
========================= */

const productsContainer =
  document.querySelector(
    '#products'
  );


function createProductCard(product){

  const card =
    document.createElement(
      'article'
    );

  card.className =
    'product-card';


  card.innerHTML = `

    <div class="product-image-wrap">

      <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image"
      >

      ${
        product.tag
        ? `<span class="product-tag">
             ${product.tag}
           </span>`
        : ''
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
      '.add-to-bag'
    );


  const heartButton =
    card.querySelector(
      '.product-heart'
    );


  if(addButton){

    addButton.addEventListener(
      'click',
      () =>
        addToCart(product)
    );

  }


  if(heartButton){

    heartButton.addEventListener(
      'click',
      () => {

        heartButton.classList.toggle(
          'saved'
        );


        heartButton.textContent =
          heartButton.classList.contains(
            'saved'
          )
          ? '♥'
          : '♡';

      }
    );

  }


  return card;

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(list){

  if(!productsContainer)
    return;


  productsContainer.innerHTML =
    '';


  list.forEach(
    product => {

      productsContainer.appendChild(
        createProductCard(
          product
        )
      );

    }
  );

}


/* =========================
   LOAD PRODUCTS
   FROM GOOGLE SHEET
========================= */

async function loadProductsFromSheet(){

  try{

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          method:'GET',
          cache:'no-store'
        }
      );


    if(!response.ok){

      throw new Error(
        'Products API error'
      );

    }


    const data =
      await response.json();


    if(!Array.isArray(data)){

      throw new Error(
        'Invalid products data'
      );

    }


    if(data.length === 0){

      console.log(
        'PRODUCTS sheet is empty. Using fallback products.'
      );


      renderProducts(
        products
      );


      return;

    }


    const sheetProducts =
      data
        .map(
          (item,index) => {

            const priceNumber =
              Number(
                String(
                  item.PRICE || ''
                ).replace(
                  /[^0-9.]/g,
                  ''
                )
              );


            return {

              id:
                item.ID ||
                `P${String(
                  index + 1
                ).padStart(
                  3,
                  '0'
                )}`,

              name:
                String(
                  item.NAME || ''
                ).trim(),

              priceNumber:
                priceNumber || 0,

              price:
                formatPrice(
                  priceNumber || 0
                ),

              tag:
                String(
                  item.BEST_SELLER || ''
                )
                .trim()
                .toUpperCase() ===
                'YES'
                ? 'best seller'
                : '',

              category:
                String(
                  item.CATEGORY || ''
                ).trim(),

              description:
                String(
                  item.DESCRIPTION || ''
                ).trim(),

              image:
                String(
                  item.IMAGE || ''
                ).trim()

            };

          }
        )
        .filter(
          product => {

            return (
              product.name &&
              product.priceNumber > 0 &&
              product.image
            );

          }
        );


    if(
      sheetProducts.length === 0
    ){

      console.log(
        'No valid products found. Using fallback products.'
      );


      renderProducts(
        products
      );


      return;

    }


    products =
      sheetProducts;


    console.log(
      'Products loaded from Google Sheet:',
      products
    );


    renderProducts(
      products
    );


  }catch(error){

    console.error(
      'Could not load products from Google Sheet:',
      error
    );


    renderProducts(
      products
    );

  }

}


/* =========================
   INITIAL PRODUCTS
========================= */

renderProducts(
  products
);


loadProductsFromSheet();


/* =========================
   PREMIUM SEARCH
========================= */

const searchButton =
  document.querySelector(
    '.search-button'
  );


const searchOverlay =
  document.querySelector(
    '#search-overlay'
  );


const searchClose =
  document.querySelector(
    '#search-close'
  );


const productSearch =
  document.querySelector(
    '#product-search'
  );


const searchClear =
  document.querySelector(
    '#search-clear'
  );


const searchResults =
  document.querySelector(
    '#search-results'
  );


const searchHint =
  document.querySelector(
    '#search-hint'
  );


function openSearch(){

  if(!searchOverlay)
    return;


  searchOverlay.classList.add(
    'open'
  );


  searchOverlay.setAttribute(
    'aria-hidden',
    'false'
  );


  document.body.classList.add(
    'search-open'
  );


  setTimeout(
    () => {

      if(productSearch)
        productSearch.focus();

    },
    150
  );

}


function closeSearch(){

  if(!searchOverlay)
    return;


  searchOverlay.classList.remove(
    'open'
  );


  searchOverlay.setAttribute(
    'aria-hidden',
    'true'
  );


  document.body.classList.remove(
    'search-open'
  );


  if(productSearch)
    productSearch.value =
      '';


  if(searchClear)
    searchClear.hidden =
      true;


  if(searchResults)
    searchResults.innerHTML =
      '';


  if(searchHint){

    searchHint.textContent =
      'Try “pink”, “bouquet” or “gift”';

  }

}


function performSearch(){

  if(!productSearch)
    return;


  const query =
    productSearch.value
      .toLowerCase()
      .trim();


  if(searchClear){

    searchClear.hidden =
      !query;

  }


  if(!searchResults)
    return;


  if(!query){

    searchResults.innerHTML =
      '';


    if(searchHint){

      searchHint.textContent =
        'Try “pink”, “bouquet” or “gift”';

    }


    return;

  }


  const matches =
    products.filter(
      product => {

        const text = `

          ${product.name}

          ${product.tag}

          ${product.price}

          ${product.category}

          ${product.description}

        `.toLowerCase();


        return text.includes(
          query
        );

      }
    );


  if(searchHint){

    searchHint.textContent =
      matches.length
      ? `${matches.length} ${
          matches.length === 1
          ? 'bloom'
          : 'blooms'
        } found`
      : 'No blooms found ♡';

  }


  searchResults.innerHTML =
    '';


  if(matches.length === 0){

    searchResults.innerHTML = `

      <div class="search-no-results">

        <div class="search-no-icon">
          ♡
        </div>

        <h3>
          Nothing found
        </h3>

        <p>
          Try another flower, colour or gift.
        </p>

      </div>

    `;


    return;

  }


  matches.forEach(
    product => {

      const result =
        document.createElement(
          'article'
        );


      result.className =
        'search-result-card';


      result.innerHTML = `

        <img
          src="${product.image}"
          alt="${product.name}"
        >


        <div class="search-result-info">

          ${
            product.tag
            ? `<span>${product.tag}</span>`
            : ''
          }


          <h3>
            ${product.name}
          </h3>


          <p>
            ${product.price}
          </p>

        </div>


        <button
          type="button"
          class="search-add-button"
        >
          +
        </button>

      `;


      const addButton =
        result.querySelector(
          '.search-add-button'
        );


      if(addButton){

        addButton.addEventListener(
          'click',
          event => {

            event.stopPropagation();

            addToCart(
              product
            );

            closeSearch();

          }
        );

      }


      result.addEventListener(
        'click',
        event => {

          if(
            event.target.closest(
              '.search-add-button'
            )
          ){

            return;

          }


          /*
           * Send search to Shop page.
           */

          const queryText =
            product.name;


          window.location.href =
            `shop.html?search=${
              encodeURIComponent(
                queryText
              )
            }`;

        }
      );


      searchResults.appendChild(
        result
      );

    }
  );

}


if(searchButton){

  searchButton.addEventListener(
    'click',
    openSearch
  );

}


if(searchClose){

  searchClose.addEventListener(
    'click',
    closeSearch
  );

}


if(productSearch){

  productSearch.addEventListener(
    'input',
    performSearch
  );


  productSearch.addEventListener(
    'keydown',
    event => {

      if(event.key === 'Enter'){

        const query =
          productSearch.value.trim();


        if(query){

          window.location.href =
            `shop.html?search=${
              encodeURIComponent(
                query
              )
            }`;

        }

      }


      if(event.key === 'Escape'){

        closeSearch();

      }

    }
  );

}


if(searchClear){

  searchClear.addEventListener(
    'click',
    () => {

      if(productSearch){

        productSearch.value =
          '';

        productSearch.focus();

      }


      performSearch();

    }
  );

}


if(searchOverlay){

  searchOverlay.addEventListener(
    'click',
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


document.addEventListener(
  'keydown',
  event => {

    if(
      event.key === 'Escape' &&
      searchOverlay &&
      searchOverlay.classList.contains(
        'open'
      )
    ){

      closeSearch();

    }

  }
);

/* =========================
   INSTAGRAM GRID
========================= */

const instagramGrid =
  document.querySelector(
    '#instagram-grid'
  );


if(instagramGrid){

  instagramGrid.innerHTML =
    '';


  instagramImages.forEach(
    image => {

      const link =
        document.createElement(
          'a'
        );


      link.href =
        'https://instagram.com/thhepetalandco';


      link.target =
        '_blank';


      link.rel =
        'noopener noreferrer';


      const img =
        document.createElement(
          'img'
        );


      img.src =
        image;


      img.alt =
        'THEE PETAL AND CO Instagram';


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
   MOBILE MENU
========================= */

const drawer =
  document.querySelector(
    '#mobile-drawer'
  );


const backdrop =
  document.querySelector(
    '#drawer-backdrop'
  );


const menuOpen =
  document.querySelector(
    '#menu-open'
  );


const menuClose =
  document.querySelector(
    '#menu-close'
  );


function toggleMenu(open){

  if(drawer){

    drawer.classList.toggle(
      'open',
      open
    );


    drawer.setAttribute(
      'aria-hidden',
      String(!open)
    );

  }


  if(backdrop){

    backdrop.classList.toggle(
      'open',
      open
    );

  }


  document.body.classList.toggle(
    'menu-open',
    open
  );

}


if(menuOpen){

  menuOpen.addEventListener(
    'click',
    () =>
      toggleMenu(true)
  );

}


if(menuClose){

  menuClose.addEventListener(
    'click',
    () =>
      toggleMenu(false)
  );

}


if(backdrop){

  backdrop.addEventListener(
    'click',
    () =>
      toggleMenu(false)
  );

}


if(drawer){

  drawer
    .querySelectorAll('a')
    .forEach(
      link => {

        link.addEventListener(
          'click',
          () =>
            toggleMenu(false)
        );

      }
    );

}


/* =========================
   CUSTOM ORDER + PHOTO
========================= */

const customForm =
  document.querySelector(
    '#custom-form'
  );


const successMessage =
  document.querySelector(
    '#form-success'
  );


const photoInput =
  document.querySelector(
    '#photo'
  );


const photoData =
  document.querySelector(
    '#photoData'
  );


const photoName =
  document.querySelector(
    '#photoName'
  );


const photoMimeType =
  document.querySelector(
    '#photoMimeType'
  );


if(customForm){

  customForm.addEventListener(
    'submit',
    function(event){

      event.preventDefault();


      const file =
        photoInput &&
        photoInput.files
          ? photoInput.files[0]
          : null;


      /*
       * NO PHOTO
       */

      if(!file){

        customForm.submit();


        setTimeout(
          () => {

            if(successMessage){

              successMessage.hidden =
                false;

            }


            /*
             * Don't clear the
             * cart automatically.
             */

          },
          1500
        );


        return;

      }


      /*
       * PHOTO UPLOAD
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
                  'canvas'
                );


              const maxWidth =
                1200;


              const maxHeight =
                1200;


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
                  '2d'
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


              const compressedData =
                canvas.toDataURL(
                  'image/jpeg',
                  0.75
                );


              if(photoData){

                photoData.value =
                  compressedData;

              }


              if(photoName){

                photoName.value =
                  file.name.replace(
                    /\.[^/.]+$/,
                    ''
                  ) + '.jpg';

              }


              if(photoMimeType){

                photoMimeType.value =
                  'image/jpeg';

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
   LOAD CART ORDER
   AFTER PAGE LOAD
========================= */

function restoreCartOrder(){

  try{

    const savedOrder =
      sessionStorage.getItem(
        'petalCartOrder'
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
        '#product'
      );


    const budgetField =
      document.querySelector(
        '#budget'
      );


    const messageField =
      document.querySelector(
        '#message'
      );


    const categories =
      order.products
        .map(
          item =>
            String(
              item.category || ''
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
        ' + '
      );


    const productDetails =
      order.products
        .map(
          item => {

            const category =
              item.category
                ? ` — ${item.category}`
                : '';


            const price =
              formatPrice(
                item.priceNumber
              );


            return (
              `${item.name}${category} × ` +
              `${item.quantity} (${price} each)`
            );

          }
        )
        .join('\n');


    const total =
      Number(
        order.total || 0
      );


    const totalText =
      formatPrice(
        total
      );


    /* =====================
       PRODUCT FIELD
    ===================== */

    if(productField){

      if(
        productField.tagName ===
        'SELECT'
      ){

        const old =
          productField.querySelector(
            'option[data-cart-order="true"]'
          );


        if(old)
          old.remove();


        const matchingOption =
          [...productField.options]
            .find(
              option =>
                option.value
                  .toLowerCase() ===
                categoryText
                  .toLowerCase()
            );


        if(
          matchingOption &&
          !categoryText.includes('+')
        ){

          productField.value =
            matchingOption.value;

        }else{

          const option =
            document.createElement(
              'option'
            );


          option.value =
            categoryText ||
            'Custom Gifts';


          option.textContent =
            categoryText
              ? `Cart: ${categoryText}`
              : 'Cart Order';


          option.selected =
            true;


          option.dataset.cartOrder =
            'true';


          productField.insertBefore(
            option,
            productField.firstChild
          );

        }

      }else{

        productField.value =
          categoryText ||
          'Custom Gifts';

      }

    }


    /* =====================
       BUDGET FIELD
    ===================== */

    if(budgetField){

      const old =
        budgetField.querySelector(
          'option[data-cart-budget="true"]'
        );


      if(old)
        old.remove();


      if(
        budgetField.tagName ===
        'SELECT'
      ){

        const option =
          document.createElement(
            'option'
          );


        option.value =
          totalText;


        option.textContent =
          `Cart Total: ${totalText}`;


        option.selected =
          true;


        option.dataset.cartBudget =
          'true';


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
       MESSAGE FIELD
    ===================== */

    if(messageField){

      const orderText =
`Selected Cart Items:
${productDetails}

Categories:
${categoryText || 'Custom Gifts'}

Total:
${totalText}`;


      const existing =
        messageField.value.trim();


      const marker =
        'Selected Cart Items:';


      let cleanExisting =
        existing;


      const oldIndex =
        cleanExisting.indexOf(
          marker
        );


      if(oldIndex !== -1){

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
     * Remove only the temporary
     * navigation data.
     */

    sessionStorage.removeItem(
      'petalCartOrder'
    );


  }catch(error){

    console.error(
      'Could not restore cart order:',
      error
    );

  }

}


/* =========================
   RESTORE ORDER
========================= */

restoreCartOrder();


/* =========================
   FINAL INITIALIZATION
========================= */

updateCartCount();

renderCart();