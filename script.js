/* =========================================================
   THEE PETAL AND CO.
   FULL WEBSITE JAVASCRIPT
========================================================= */


/* =========================
   PRODUCTS
========================= */

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
   CART
========================= */

let cart = [];


/* =========================
   HELPER
========================= */

function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}


/* =========================
   CART ELEMENTS
========================= */

const bagButton = document.querySelector('#bag-button');
const cartCountElement = document.querySelector('#cart-count');

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


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (cartCountElement) {

    cartCountElement.textContent = totalItems;

    cartCountElement.hidden = totalItems === 0;

  }

}


/* =========================
   ADD TO CART
========================= */

function addToCart(product) {

  const existing = cart.find(
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


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(productName) {

  cart = cart.filter(
    item => item.name !== productName
  );

  updateCartCount();
  renderCart();

}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(productName, change) {

  const item = cart.find(
    product => product.name === productName
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


/* =========================
   CART TOTAL
========================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total + (item.priceNumber * item.quantity),
    0
  );

}


/* =========================
   RENDER CART
========================= */

function renderCart() {

  if (!cartItems) return;

  cartItems.innerHTML = '';

  if (cart.length === 0) {

    if (cartEmpty) {
      cartEmpty.hidden = false;
    }

    if (cartTotal) {
      cartTotal.textContent = '₹0';
    }

    return;

  }


  if (cartEmpty) {
    cartEmpty.hidden = true;
  }


  cart.forEach(item => {

    const cartItem = document.createElement('div');

    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img
          src="${item.image}"
          alt="${item.name}"
        >
      </div>

      <div class="cart-item-info">

        <h4>${item.name}</h4>

        <p>${formatPrice(item.priceNumber)}</p>

        <div class="cart-quantity">

          <button
            type="button"
            class="qty-minus"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span>${item.quantity}</span>

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


    cartItem
      .querySelector('.qty-minus')
      .addEventListener('click', () => {

        changeQuantity(item.name, -1);

      });


    cartItem
      .querySelector('.qty-plus')
      .addEventListener('click', () => {

        changeQuantity(item.name, 1);

      });


    cartItem
      .querySelector('.remove-cart-item')
      .addEventListener('click', () => {

        removeFromCart(item.name);

      });


    cartItems.appendChild(cartItem);

  });


  if (cartTotal) {

    cartTotal.textContent =
      formatPrice(getCartTotal());

  }

}


/* =========================
   OPEN CART
========================= */

function openCart() {

  if (cartDrawer) {

    cartDrawer.classList.add('open');

  }

  if (cartBackdrop) {

    cartBackdrop.classList.add('open');

  }

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

  if (cartDrawer) {

    cartDrawer.classList.remove('open');

  }

  if (cartBackdrop) {

    cartBackdrop.classList.remove('open');

  }

}


/* =========================
   BAG BUTTON
========================= */

if (bagButton) {

  bagButton.addEventListener('click', () => {

    renderCart();
    openCart();

  });

}


/* =========================
   CLOSE BUTTON
========================= */

if (cartClose) {

  cartClose.addEventListener('click', closeCart);

}


if (cartBackdrop) {

  cartBackdrop.addEventListener(
    'click',
    closeCart
  );

}


/* =========================
   CUSTOMISE / ORDER
========================= */

if (customiseButton) {

  customiseButton.addEventListener('click', () => {

    /*
      If cart is empty,
      simply go to custom order section.
    */

    if (cart.length === 0) {

      closeCart();

      const customSection =
        document.querySelector('#custom');

      if (customSection) {

        customSection.scrollIntoView({
          behavior: 'smooth'
        });

      }

      return;

    }


    /*
      Create selected product text.
    */

    const selectedProducts = cart
      .map(item =>
        `${item.name} × ${item.quantity}`
      )
      .join(', ');


    const total = getCartTotal();


    /*
      Product dropdown.
    */

    const productField =
      document.querySelector('#product');


    /*
      Message field.
    */

    const messageField =
      document.querySelector('#message');


    /*
      Try to select product automatically
      if dropdown has matching option.
    */

    if (productField) {

      const matchingOption =
        [...productField.options].find(
          option =>
            option.textContent
              .trim()
              .toLowerCase() ===
            cart[0].name
              .trim()
              .toLowerCase()
        );


      if (matchingOption) {

        productField.value =
          matchingOption.value;

      } else {

        /*
          If multiple/custom products,
          select Custom if available.
        */

        const customOption =
          [...productField.options].find(
            option =>
              option.textContent
                .toLowerCase()
                .includes('custom')
          );


        if (customOption) {

          productField.value =
            customOption.value;

        }

      }

    }


    /*
      Add cart details into message.
    */

    if (messageField) {

      const cartMessage =
        `Selected items: ${selectedProducts}\n` +
        `Estimated total: ${formatPrice(total)}\n\n`;

      /*
        Don't destroy anything already typed.
      */

      if (
        !messageField.value
          .includes('Selected items:')
      ) {

        messageField.value =
          cartMessage + messageField.value;

      }

    }


    /*
      Close cart.
    */

    closeCart();


    /*
      Go to custom order form.
    */

    const customSection =
      document.querySelector('#custom');

    if (customSection) {

      setTimeout(() => {

        customSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }, 200);

    }

  });

}


/* =========================
   PRODUCTS
========================= */

const productRoot =
  document.querySelector('#products');


if (productRoot) {

  productRoot.innerHTML = '';


  products.forEach((product) => {

    const card =
      document.createElement('article');


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
            ? `<span class="tag">${product.tag}</span>`
            : ''
        }

        <button
          class="add-button"
          aria-label="Add ${product.name} to bag"
          type="button"
        >
          ♧
        </button>

      </div>


      <div class="product-info">

        <div>

          <h3>${product.name}</h3>

          <p>${product.price}</p>

        </div>


        <button
          class="heart"
          aria-label="Save ${product.name}"
          type="button"
        >
          ♡
        </button>

      </div>
    `;


    /*
      Add to Bag.
    */

    card
      .querySelector('.add-button')
      .addEventListener('click', () => {

        addToCart(product);

      });


    /*
      Wishlist heart.
    */

    card
      .querySelector('.heart')
      .addEventListener('click', function () {

        this.classList.toggle('saved');

        this.textContent =
          this.classList.contains('saved')
            ? '♥'
            : '♡';

      });


    productRoot.appendChild(card);

  });

}


/* =========================
   INSTAGRAM
========================= */

const instaRoot =
  document.querySelector('#instagram-grid');


if (instaRoot) {

  instaRoot.innerHTML = '';


  instagramImages.forEach((src, index) => {

    const link =
      document.createElement('a');


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


    instaRoot.appendChild(link);

  });

}


/* =========================
   MOBILE MENU
========================= */

const drawer =
  document.querySelector('#mobile-drawer');

const backdrop =
  document.querySelector('#drawer-backdrop');


function toggleMenu(open) {

  if (!drawer || !backdrop) return;


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


const menuOpen =
  document.querySelector('#menu-open');


const menuClose =
  document.querySelector('#menu-close');


if (menuOpen) {

  menuOpen.addEventListener(
    'click',
    () => toggleMenu(true)
  );

}


if (menuClose) {

  menuClose.addEventListener(
    'click',
    () => toggleMenu(false)
  );

}


if (backdrop) {

  backdrop.addEventListener(
    'click',
    () => toggleMenu(false)
  );

}


if (drawer) {

  drawer
    .querySelectorAll('a')
    .forEach(link => {

      link.addEventListener(
        'click',
        () => toggleMenu(false)
      );

    });

}


/* =========================
   CUSTOM ORDER FORM
   GOOGLE SHEET + DRIVE
========================= */

const customForm =
  document.querySelector('#custom-form');

const successMessage =
  document.querySelector('#form-success');

const photoInput =
  document.querySelector('#photo');

const photoData =
  document.querySelector('#photoData');

const photoName =
  document.querySelector('#photoName');

const photoMimeType =
  document.querySelector('#photoMimeType');


if (customForm) {

  customForm.addEventListener(
    'submit',
    function (event) {

      event.preventDefault();


      const file =
        photoInput &&
        photoInput.files[0];


      /*
        NO PHOTO
      */

      if (!file) {

        customForm.submit();


        setTimeout(() => {

          if (successMessage) {
            successMessage.hidden = false;
          }

          customForm.reset();

          /*
            Cart clear after order request.
          */

          cart = [];

          updateCartCount();
          renderCart();

        }, 1500);


        return;

      }


      /*
        PHOTO COMPRESSION
      */

      const reader =
        new FileReader();


      reader.onload =
        function () {

          const img =
            new Image();


          img.onload =
            function () {

              const canvas =
                document.createElement('canvas');


              const maxWidth = 1200;
              const maxHeight = 1200;


              let width =
                img.width;

              let height =
                img.height;


              if (width > maxWidth) {

                height =
                  height *
                  (maxWidth / width);

                width =
                  maxWidth;

              }


              if (height > maxHeight) {

                width =
                  width *
                  (maxHeight / height);

                height =
                  maxHeight;

              }


              canvas.width =
                width;

              canvas.height =
                height;


              const ctx =
                canvas.getContext('2d');


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


              if (photoData) {

                photoData.value =
                  compressedData;

              }


              if (photoName) {

                photoName.value =
                  file.name
                    .replace(/\.[^/.]+$/, '') +
                  '.jpg';

              }


              if (photoMimeType) {

                photoMimeType.value =
                  'image/jpeg';

              }


              /*
                IMPORTANT:
                Native submit keeps the existing
                Google Apps Script + hidden iframe
                system working.
              */

              customForm.submit();


              setTimeout(() => {

                if (successMessage) {

                  successMessage.hidden =
                    false;

                }


                customForm.reset();


                /*
                  Clear cart after order request.
                */

                cart = [];

                updateCartCount();
                renderCart();

              }, 1500);

            };


          img.src =
            reader.result;

        };


      reader.readAsDataURL(file);

    }

  );

}


/* =========================
   INITIAL STATE
========================= */

updateCartCount();
renderCart();