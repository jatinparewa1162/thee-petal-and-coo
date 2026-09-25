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

function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

const bagButton = document.querySelector('#bag-button');
const cartCount = document.querySelector('#cart-count');
const cartDrawer = document.querySelector('#cart-drawer');
const cartBackdrop = document.querySelector('#cart-backdrop');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartTotal = document.querySelector('#cart-total');
const cartClose = document.querySelector('#cart-close');
const customiseOrder = document.querySelector(
  '#customise-order, #customize-order, #checkout-button, .customise-order'
);


function updateCartCount() {
  if (!cartCount) return;

  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cartCount.textContent = count;
  cartCount.hidden = count === 0;
}


function addToCart(product) {

  const existingItem = cart.find(
    item => item.name === product.name
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartCount();
  renderCart();
  openCart();
}


function removeFromCart(productName) {

  cart = cart.filter(
    item => item.name !== productName
  );

  updateCartCount();
  renderCart();
}


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


function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total + item.priceNumber * item.quantity,
    0
  );
}


function renderCart() {

  if (!cartItems) return;

  cartItems.innerHTML = '';

  if (cart.length === 0) {

    if (cartEmpty) {
      cartItems.appendChild(cartEmpty);
    }

    if (cartTotal) {
      cartTotal.textContent = '₹0';
    }

    return;
  }


  cart.forEach(item => {

    const cartItem = document.createElement('div');

    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.name}"
        class="cart-item-image"
      >

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>${formatPrice(item.priceNumber)}</p>

        <div class="cart-item-bottom">

          <div class="quantity-controls">

            <button
              type="button"
              class="qty-minus"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              class="qty-plus"
              aria-label="Increase quantity"
            >+</button>

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


    const minusButton =
      cartItem.querySelector('.qty-minus');

    const plusButton =
      cartItem.querySelector('.qty-plus');

    const removeButton =
      cartItem.querySelector('.cart-remove');


    minusButton.addEventListener(
      'click',
      () => changeQuantity(item.name, -1)
    );

    plusButton.addEventListener(
      'click',
      () => changeQuantity(item.name, 1)
    );

    removeButton.addEventListener(
      'click',
      () => removeFromCart(item.name)
    );


    cartItems.appendChild(cartItem);
  });


  if (cartTotal) {
    cartTotal.textContent =
      formatPrice(getCartTotal());
  }
}


function openCart() {

  if (cartDrawer) {
    cartDrawer.classList.add('open');
  }

  if (cartBackdrop) {
    cartBackdrop.classList.add('open');
  }

  document.body.classList.add('cart-open');
}


function closeCart() {

  if (cartDrawer) {
    cartDrawer.classList.remove('open');
  }

  if (cartBackdrop) {
    cartBackdrop.classList.remove('open');
  }

  document.body.classList.remove('cart-open');
}


if (bagButton) {
  bagButton.addEventListener(
    'click',
    () => {
      renderCart();
      openCart();
    }
  );
}


if (cartClose) {
  cartClose.addEventListener(
    'click',
    closeCart
  );
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

if (customiseOrder) {

  customiseOrder.addEventListener(
    'click',
    () => {

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


      const selectedProducts = cart
        .map(
          item =>
            `${item.name} × ${item.quantity}`
        )
        .join(', ');


      const total = getCartTotal();
      const totalText = formatPrice(total);


      const productField =
        document.querySelector('#product');

      const budgetField =
        document.querySelector('#budget');

      const messageField =
        document.querySelector('#message');


      /* PRODUCT FIELD */

      if (productField) {

        if (
          productField.tagName === 'SELECT'
        ) {

          const oldOption =
            productField.querySelector(
              'option[data-cart-order="true"]'
            );

          if (oldOption) {
            oldOption.remove();
          }


          const option =
            document.createElement('option');

          option.value = selectedProducts;

          option.textContent =
            selectedProducts;

          option.selected = true;

          option.dataset.cartOrder = 'true';

          productField.insertBefore(
            option,
            productField.firstChild
          );

          productField.dispatchEvent(
            new Event('change', {
              bubbles: true
            })
          );

        } else {

          productField.value =
            selectedProducts;
        }
      }


      /* BUDGET FIELD */

      if (budgetField) {

        if (
          budgetField.tagName === 'SELECT'
        ) {

          const oldBudget =
            budgetField.querySelector(
              'option[data-cart-budget="true"]'
            );

          if (oldBudget) {
            oldBudget.remove();
          }


          const budgetOption =
            document.createElement('option');

          budgetOption.value = totalText;

          budgetOption.textContent =
            `Selected Products Total: ${totalText}`;

          budgetOption.selected = true;

          budgetOption.dataset.cartBudget = 'true';

          budgetField.insertBefore(
            budgetOption,
            budgetField.firstChild
          );

          budgetField.dispatchEvent(
            new Event('change', {
              bubbles: true
            })
          );

        } else {

          budgetField.value =
            totalText;
        }
      }


      /* MESSAGE FIELD */

      if (messageField) {

        const orderText =
          `Selected Products: ${selectedProducts}\nEstimated Total: ${totalText}`;

        const existingMessage =
          messageField.value.trim();


        if (
          !existingMessage.includes(
            'Selected Products:'
          )
        ) {

          messageField.value =
            existingMessage
              ? `${existingMessage}\n\n${orderText}`
              : orderText;
        }
      }


      closeCart();


      const customSection =
        document.querySelector('#custom');

      if (customSection) {

        customSection.scrollIntoView({
          behavior: 'smooth'
        });
      }


      setTimeout(() => {

        if (productField) {
          productField.focus();
        }

      }, 700);

    }
  );
}


/* =========================
   PRODUCT CARDS
========================= */

const productsContainer =
  document.querySelector('#products');


if (productsContainer) {

  productsContainer.innerHTML = '';


  products.forEach(product => {

    const card =
      document.createElement('article');

    card.className = 'product-card';


    card.innerHTML = `

      <div class="product-image-wrap">

        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
        >

        ${
          product.tag
            ? `<span class="product-tag">${product.tag}</span>`
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

        <h3>${product.name}</h3>

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
      card.querySelector('.add-to-bag');

    const heartButton =
      card.querySelector('.product-heart');


    if (addButton) {

      addButton.addEventListener(
        'click',
        () => addToCart(product)
      );
    }


    if (heartButton) {

      heartButton.addEventListener(
        'click',
        () => {

          heartButton.classList.toggle(
            'saved'
          );

          heartButton.textContent =
            heartButton.classList.contains('saved')
              ? '♥'
              : '♡';
        }
      );
    }


    productsContainer.appendChild(card);
  });
}


/* =========================
   INSTAGRAM GRID
========================= */

const instagramGrid =
  document.querySelector('#instagram-grid');


if (instagramGrid) {

  instagramGrid.innerHTML = '';


  instagramImages.forEach(image => {

    const link =
      document.createElement('a');

    link.href =
      'https://instagram.com/thhepetalandco';

    link.target = '_blank';

    link.rel = 'noopener noreferrer';


    const img =
      document.createElement('img');

    img.src = image;

    img.alt =
      'THEE PETAL AND CO Instagram';


    link.appendChild(img);

    instagramGrid.appendChild(link);
  });
}


/* =========================
   MOBILE MENU
========================= */

const drawer =
  document.querySelector('#mobile-drawer');

const backdrop =
  document.querySelector('#drawer-backdrop');

const menuOpen =
  document.querySelector('#menu-open');

const menuClose =
  document.querySelector('#menu-close');


function toggleMenu(open) {

  if (drawer) {
    drawer.classList.toggle(
      'open',
      open
    );

    drawer.setAttribute(
      'aria-hidden',
      String(!open)
    );
  }


  if (backdrop) {
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


/* Close mobile menu when a menu link is clicked */

if (drawer) {

  const drawerLinks =
    drawer.querySelectorAll('a');

  drawerLinks.forEach(link => {

    link.addEventListener(
      'click',
      () => toggleMenu(false)
    );
  });
}


/* =========================
   CUSTOM ORDER + PHOTO
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
        photoInput.files
          ? photoInput.files[0]
          : null;


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

        }, 1500);


        return;
      }


      /*
        PHOTO SELECTED
      */

      const reader =
        new FileReader();


      reader.onload = function () {

        const img =
          new Image();


        img.onload = function () {

          const canvas =
            document.createElement('canvas');


          const maxWidth = 1200;
          const maxHeight = 1200;


          let width = img.width;
          let height = img.height;


          if (width > maxWidth) {

            height =
              height *
              (maxWidth / width);

            width = maxWidth;
          }


          if (height > maxHeight) {

            width =
              width *
              (maxHeight / height);

            height = maxHeight;
          }


          canvas.width = width;
          canvas.height = height;


          const ctx =
            canvas.getContext('2d');


          if (!ctx) {
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


          if (photoData) {
            photoData.value =
              compressedData;
          }


          if (photoName) {

            photoName.value =
              file.name.replace(
                /\.[^/.]+$/,
                ''
              ) + '.jpg';
          }


          if (photoMimeType) {
            photoMimeType.value =
              'image/jpeg';
          }


          /*
            Native form submit.
            This keeps Google Apps Script +
            hidden iframe working.
          */

          customForm.submit();


          setTimeout(() => {

            if (successMessage) {
              successMessage.hidden = false;
            }

            customForm.reset();

          }, 1500);

        };


        img.src = reader.result;
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