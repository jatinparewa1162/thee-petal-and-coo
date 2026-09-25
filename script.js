/* =========================================================
   THEE PETAL AND CO.
   COMPLETE WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    name: 'The Pink Promise',
    price: '₹899',
    priceNumber: 899,
    tag: 'best seller',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85'
  },

  {
    name: 'Strawberry Fields',
    price: '₹699',
    priceNumber: 699,
    tag: 'new in',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85'
  },

  {
    name: 'Sunshine, Always',
    price: '₹799',
    priceNumber: 799,
    tag: '',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=900&q=85'
  },

  {
    name: 'A Little Something',
    price: '₹499',
    priceNumber: 499,
    tag: '',
    image: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85'
  }
];


/* =========================================================
   INSTAGRAM
========================================================= */

const instagramImages = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',

  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=80',

  'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=500&q=80',

  'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=500&q=80',

  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80',

  'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=500&q=80'
];


/* =========================================================
   CART
========================================================= */

let cart = [];


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(amount) {

  return '₹' + Number(amount).toLocaleString('en-IN');

}


/* =========================================================
   CART ELEMENTS
========================================================= */

const bagButton =
  document.querySelector('#bag-button');

const cartCountElement =
  document.querySelector('#cart-count');


const cartDrawer =
  document.querySelector('#cart-drawer') ||
  document.querySelector('.cart-drawer');


const cartBackdrop =
  document.querySelector('#cart-backdrop') ||
  document.querySelector('.cart-backdrop');


const cartItems =
  document.querySelector('#cart-items') ||
  document.querySelector('.cart-items');


const cartEmpty =
  document.querySelector('#cart-empty') ||
  document.querySelector('.cart-empty');


const cartTotal =
  document.querySelector('#cart-total') ||
  document.querySelector('.cart-total');


const cartClose =
  document.querySelector('#cart-close') ||
  document.querySelector('.cart-close');


const customiseButton =
  document.querySelector('#customise-order') ||
  document.querySelector('#customize-order') ||
  document.querySelector('#checkout-button') ||
  document.querySelector('.customise-order');


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

  const totalItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );


  if (cartCountElement) {

    cartCountElement.textContent =
      totalItems;

    cartCountElement.hidden =
      totalItems === 0;

  }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(product) {

  const existing =
    cart.find(
      item => item.name === product.name
    );


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  updateCartCount();

  renderCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productName) {

  cart =
    cart.filter(
      item => item.name !== productName
    );


  updateCartCount();

  renderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
  productName,
  change
) {

  const item =
    cart.find(
      product =>
        product.name === productName
    );


  if (!item) return;


  item.quantity += change;


  if (item.quantity <= 0) {

    removeFromCart(productName);

    return;

  }


  updateCartCount();

  renderCart();

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total +
      (
        item.priceNumber *
        item.quantity
      ),
    0
  );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  if (!cartItems) return;


  cartItems.innerHTML = '';


  /*
    EMPTY CART
  */

  if (cart.length === 0) {

    if (cartEmpty) {

      cartEmpty.hidden = false;

    }


    if (cartTotal) {

      cartTotal.textContent =
        '₹0';

    }


    return;

  }


  /*
    HIDE EMPTY MESSAGE
  */

  if (cartEmpty) {

    cartEmpty.hidden = true;

  }


  /*
    SHOW CART PRODUCTS
  */

  cart.forEach(item => {

    const cartItem =
      document.createElement('div');


    cartItem.className =
      'cart-item';


    cartItem.innerHTML = `

      <div class="cart-item-image">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

      </div>


      <div class="cart-item-info">

        <h4>
          ${item.name}
        </h4>


        <p>
          ${formatPrice(item.priceNumber)}
        </p>


        <div class="cart-quantity">

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
          class="remove-cart-item"
        >
          Remove
        </button>

      </div>

    `;


    /*
      MINUS
    */

    const minusButton =
      cartItem.querySelector(
        '.qty-minus'
      );


    if (minusButton) {

      minusButton.addEventListener(
        'click',
        () => {

          changeQuantity(
            item.name,
            -1
          );

        }
      );

    }


    /*
      PLUS
    */

    const plusButton =
      cartItem.querySelector(
        '.qty-plus'
      );


    if (plusButton) {

      plusButton.addEventListener(
        'click',
        () => {

          changeQuantity(
            item.name,
            1
          );

        }
      );

    }


    /*
      REMOVE
    */

    const removeButton =
      cartItem.querySelector(
        '.remove-cart-item'
      );


    if (removeButton) {

      removeButton.addEventListener(
        'click',
        () => {

          removeFromCart(
            item.name
          );

        }
      );

    }


    cartItems.appendChild(
      cartItem
    );

  });


  /*
    TOTAL
  */

  if (cartTotal) {

    cartTotal.textContent =
      formatPrice(
        getCartTotal()
      );

  }

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

  if (cartDrawer) {

    cartDrawer.classList.add(
      'open'
    );

  }


  if (cartBackdrop) {

    cartBackdrop.classList.add(
      'open'
    );

  }

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

  if (cartDrawer) {

    cartDrawer.classList.remove(
      'open'
    );

  }


  if (cartBackdrop) {

    cartBackdrop.classList.remove(
      'open'
    );

  }

}


/* =========================================================
   BAG BUTTON
========================================================= */

if (bagButton) {

  bagButton.addEventListener(
    'click',
    () => {

      renderCart();

      openCart();

    }
  );

}


/* =========================================================
   CART CLOSE BUTTON
========================================================= */

if (cartClose) {

  cartClose.addEventListener(
    'click',
    closeCart
  );

}


/* =========================================================
   CART BACKDROP
========================================================= */

if (cartBackdrop) {

  cartBackdrop.addEventListener(
    'click',
    closeCart
  );

}


/* =========================================================
   CUSTOMISE / ORDER
========================================================= */

if (customiseButton) {

  customiseButton.addEventListener(
    'click',
    () => {

      /*
        EMPTY CART
      */

      if (cart.length === 0) {

        closeCart();


        const customSection =
          document.querySelector(
            '#custom'
          );


        if (customSection) {

          customSection.scrollIntoView({
            behavior: 'smooth'
          });

        }


        return;

      }


      /*
        SELECTED PRODUCTS
      */

      const selectedProducts =
        cart
          .map(
            item =>
              `${item.name} × ${item.quantity}`
          )
          .join(', ');


      /*
        TOTAL
      */

      const total =
        getCartTotal();


      const totalText =
        formatPrice(total);


      /* =====================================================
         PRODUCT FIELD
      ===================================================== */

      const productField =
        document.querySelector(
          '#product'
        );


      if (productField) {

        /*
          SELECT DROPDOWN
        */

        if (
          productField.tagName ===
          'SELECT'
        ) {

          /*
            Remove previous automatic option
          */

          const oldOption =
            productField.querySelector(
              'option[data-cart-order="true"]'
            );


          if (oldOption) {

            oldOption.remove();

          }


          /*
            Create new option
          */

          const newOption =
            document.createElement(
              'option'
            );


          newOption.value =
            selectedProducts;


          newOption.textContent =
            selectedProducts;


          newOption.dataset.cartOrder =
            'true';


          newOption.selected =
            true;


          /*
            Put at top
          */

          productField.insertBefore(
            newOption,
            productField.firstChild
          );


          /*
            Force value
          */

          productField.value =
            selectedProducts;


          /*
            Trigger change
          */

          productField.dispatchEvent(
            new Event(
              'change',
              {
                bubbles: true
              }
            )
          );

        }


        /*
          INPUT / TEXT FIELD
        */

        else {

          productField.value =
            selectedProducts;


          productField.dispatchEvent(
            new Event(
              'input',
              {
                bubbles: true
              }
            )
          );

        }

      }


      /* =====================================================
         BUDGET FIELD
      ===================================================== */

      const budgetField =
        document.querySelector(
          '#budget'
        );


      if (budgetField) {

        /*
          SELECT DROPDOWN
        */

        if (
          budgetField.tagName ===
          'SELECT'
        ) {

          /*
            Remove old automatic budget
          */

          const oldBudget =
            budgetField.querySelector(
              'option[data-cart-budget="true"]'
            );


          if (oldBudget) {

            oldBudget.remove();

          }


          /*
            Create automatic budget option
          */

          const budgetOption =
            document.createElement(
              'option'
            );


          budgetOption.value =
            totalText;


          budgetOption.textContent =
            `Selected Products Total: ${totalText}`;


          budgetOption.dataset.cartBudget =
            'true';


          budgetOption.selected =
            true;


          budgetField.insertBefore(
            budgetOption,
            budgetField.firstChild
          );


          /*
            Force value
          */

          budgetField.value =
            totalText;


          /*
            Trigger change
          */

          budgetField.dispatchEvent(
            new Event(
              'change',
              {
                bubbles: true
              }
            )
          );

        }


        /*
          INPUT / TEXT FIELD
        */

        else {

          budgetField.value =
            totalText;


          budgetField.dispatchEvent(
            new Event(
              'input',
              {
                bubbles: true
              }
            )
          );

        }

      }


      /* =====================================================
         MESSAGE FIELD
      ===================================================== */

      const messageField =
        document.querySelector(
          '#message'
        );


      if (messageField) {

        const cartDetails =
          `Selected Products: ${selectedProducts}
Estimated Total: ${totalText}`;


        /*
          Only add once
        */

        if (
          !messageField.value.includes(
            'Selected Products:'
          )
        ) {

          messageField.value =
            cartDetails +
            '\n\n' +
            messageField.value;

        }


        messageField.dispatchEvent(
          new Event(
            'input',
            {
              bubbles: true
            }
          )
        );

      }


      /* =====================================================
         CLOSE CART
      ===================================================== */

      closeCart();


      /* =====================================================
         OPEN CUSTOM ORDER SECTION
      ===================================================== */

      const customSection =
        document.querySelector(
          '#custom'
        );


      if (customSection) {

        setTimeout(
          () => {

            customSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });


            /*
              Focus product field
            */

            if (productField) {

              setTimeout(
                () => {

                  productField.focus();

                },
                500
              );

            }

          },
          200
        );

      }

    }
  );

}


/* =========================================================
   PRODUCT CARDS
========================================================= */

const productRoot =
  document.querySelector(
    '#products'
  );


if (productRoot) {

  productRoot.innerHTML = '';


  products.forEach(
    product => {

      const card =
        document.createElement(
          'article'
        );


      card.className =
        'product-card';


      card.innerHTML = `

        <div class="product-image">

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >


          ${
            product.tag
              ? `
                <span class="tag">
                  ${product.tag}
                </span>
              `
              : ''
          }


          <button
            class="add-button"
            type="button"
            aria-label="Add ${product.name} to bag"
          >
            ♧
          </button>

        </div>


        <div class="product-info">

          <div>

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.price}
            </p>

          </div>


          <button
            class="heart"
            type="button"
            aria-label="Save ${product.name}"
          >
            ♡
          </button>

        </div>

      `;


      /*
        ADD TO BAG
      */

      const addButton =
        card.querySelector(
          '.add-button'
        );


      if (addButton) {

        addButton.addEventListener(
          'click',
          () => {

            addToCart(
              product
            );

          }
        );

      }


      /*
        HEART
      */

      const heartButton =
        card.querySelector(
          '.heart'
        );


      if (heartButton) {

        heartButton.addEventListener(
          'click',
          function () {

            this.classList.toggle(
              'saved'
            );


            this.textContent =
              this.classList.contains(
                'saved'
              )
                ? '♥'
                : '♡';

          }
        );

      }


      productRoot.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   INSTAGRAM GRID
========================================================= */

const instaRoot =
  document.querySelector(
    '#instagram-grid'
  );


if (instaRoot) {

  instaRoot.innerHTML = '';


  instagramImages.forEach(
    (src, index) => {

      const link =
        document.createElement(
          'a'
        );


      link.href =
        'https://instagram.com/thhepetalandco';


      link.target =
        '_blank';


      link.rel =
        'noreferrer';


      link.innerHTML = `

        <img
          src="${src}"
          alt="Instagram post ${index + 1}"
          loading="lazy"
        >

      `;


      instaRoot.appendChild(
        link
      );

    }
  );

}


/* =========================================================
   MOBILE MENU
========================================================= */

const drawer =
  document.querySelector(
    '#mobile-drawer'
  );


const backdrop =
  document.querySelector(
    '#drawer-backdrop'
  );


function toggleMenu(open) {

  if (!drawer || !backdrop) {

    return;

  }


  drawer.classList.toggle(
    'open',
    open
  );


  backdrop.classList.toggle(
    'open',
    open
  );


  drawer.setAttribute(
    'aria-hidden',
    String(!open)
  );

}


/*
  OPEN
*/

const menuOpen =
  document.querySelector(
    '#menu-open'
  );


if (menuOpen) {

  menuOpen.addEventListener(
    'click',
    () => {

      toggleMenu(true);

    }
  );

}


/*
  CLOSE
*/

const menuClose =
  document.querySelector(
    '#menu-close'
  );


if (menuClose) {

  menuClose.addEventListener(
    'click',
    () => {

      toggleMenu(false);

    }
  );

}


/*
  BACKDROP
*/

if (backdrop) {

  backdrop.addEventListener(
    'click',
    () => {

      toggleMen