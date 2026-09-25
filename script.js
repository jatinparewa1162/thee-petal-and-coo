const products = [
  {
    name: 'The Pink Promise',
    price: '₹899',
    tag: 'best seller',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Strawberry Fields',
    price: '₹699',
    tag: 'new in',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Sunshine, Always',
    price: '₹799',
    tag: '',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'A Little Something',
    price: '₹499',
    tag: '',
    image: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85'
  }
];

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

function updateCartCount() {

  const badge = document.querySelector('#cart-count');

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  badge.textContent = totalItems;
  badge.hidden = totalItems === 0;

}


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


function changeQuantity(index, change) {

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {

    cart.splice(index, 1);

  }

  updateCartCount();
  renderCart();

}


function removeFromCart(index) {

  cart.splice(index, 1);

  updateCartCount();
  renderCart();

}


function getPrice(price) {

  return Number(
    price.replace(/[₹,]/g, '')
  );

}


function renderCart() {

  const existingCart = document.querySelector('#cart-panel');

  if (!existingCart) return;

  const cartItems = document.querySelector('#cart-items');
  const cartTotal = document.querySelector('#cart-total');

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your bag is empty ♡</p>
        <button
          class="button primary"
          id="continue-shopping"
        >
          Continue shopping
        </button>
      </div>
    `;

    cartTotal.textContent = '₹0';

    document
      .querySelector('#continue-shopping')
      .addEventListener('click', closeCart);

    return;

  }


  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {

    const itemPrice = getPrice(item.price);
    const itemTotal = itemPrice * item.quantity;

    total += itemTotal;

    return `
      <div class="cart-item">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div class="cart-item-info">

          <h3>${item.name}</h3>

          <p>${item.price}</p>

          <div class="quantity-controls">

            <button
              class="quantity-minus"
              data-index="${index}"
            >
              −
            </button>

            <span>${item.quantity}</span>

            <button
              class="quantity-plus"
              data-index="${index}"
            >
              +
            </button>

          </div>

        </div>

        <button
          class="remove-cart"
          data-index="${index}"
          aria-label="Remove ${item.name}"
        >
          ×
        </button>

      </div>
    `;

  }).join('');


  cartTotal.textContent =
    `₹${total.toLocaleString('en-IN')}`;


  document
    .querySelectorAll('.quantity-minus')
    .forEach(button => {

      button.addEventListener('click', () => {

        changeQuantity(
          Number(button.dataset.index),
          -1
        );

      });

    });


  document
    .querySelectorAll('.quantity-plus')
    .forEach(button => {

      button.addEventListener('click', () => {

        changeQuantity(
          Number(button.dataset.index),
          1
        );

      });

    });


  document
    .querySelectorAll('.remove-cart')
    .forEach(button => {

      button.addEventListener('click', () => {

        removeFromCart(
          Number(button.dataset.index)
        );

      });

    });

}


/* =========================
   CART UI
========================= */

const cartPanel = document.createElement('aside');

cartPanel.id = 'cart-panel';

cartPanel.innerHTML = `
  <div class="cart-header">

    <h2>Your Bag</h2>

    <button
      id="cart-close"
      aria-label="Close cart"
    >
      ×
    </button>

  </div>

  <div id="cart-items"></div>

  <div class="cart-footer">

    <div class="cart-total-row">

      <span>Total</span>

      <strong id="cart-total">
        ₹0
      </strong>

    </div>

    <a
      href="#custom"
      class="button primary cart-custom-button"
      id="cart-custom-button"
    >
      Customise / Order
      <span>→</span>
    </a>

  </div>
`;

document.body.appendChild(cartPanel);


const cartBackdrop = document.createElement('div');

cartBackdrop.id = 'cart-backdrop';

document.body.appendChild(cartBackdrop);


function openCart() {

  cartPanel.classList.add('open');
  cartBackdrop.classList.add('open');

  renderCart();

}


function closeCart() {

  cartPanel.classList.remove('open');
  cartBackdrop.classList.remove('open');

}


document
  .querySelector('#bag-button')
  .addEventListener('click', openCart);


document
  .querySelector('#cart-close')
  .addEventListener('click', closeCart);


cartBackdrop.addEventListener(
  'click',
  closeCart
);


document
  .querySelector('#cart-custom-button')
  .addEventListener('click', closeCart);


/* =========================
   PRODUCTS
========================= */

const productRoot =
  document.querySelector('#products');


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
      >
        ♡
      </button>

    </div>

  `;


  card
    .querySelector('.add-button')
    .addEventListener(
      'click',
      () => {

        addToCart(product);

        openCart();

      }
    );


  productRoot.appendChild(card);

});


/* =========================
   INSTAGRAM
========================= */

const instaRoot =
  document.querySelector('#instagram-grid');


instagramImages.forEach(
  (src, index) => {

    const link =
      document.createElement('a');

    link.href =
      'https://instagram.com/thhepetalandco';

    link.target = '_blank';

    link.rel = 'noreferrer';


    link.innerHTML = `

      <img
        src="${src}"
        alt="Instagram post ${index + 1}"
        loading="lazy"
      >

    `;


    instaRoot.appendChild(link);

  }
);


/* =========================
   MOBILE MENU
========================= */

const drawer =
  document.querySelector('#mobile-drawer');

const backdrop =
  document.querySelector('#drawer-backdrop');


function toggleMenu(open) {

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


document
  .querySelector('#menu-open')
  .addEventListener(
    'click',
    () => {
      toggleMenu(true);
    }
  );


document
  .querySelector('#menu-close')
  .addEventListener(
    'click',
    () => {
      toggleMenu(false);
    }
  );


backdrop.addEventListener(
  'click',
  () => {
    toggleMenu(false);
  }
);


drawer
  .querySelectorAll('a')
  .forEach((link) => {

    link.addEventListener(
      'click',
      () => {
        toggleMenu(false);
      }
    );

  });


/* =========================
   CUSTOM ORDER + PHOTO
   EXISTING WORKING SYSTEM
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


customForm.addEventListener(
  'submit',
  function (event) {

    event.preventDefault();

    const file =
      photoInput.files[0];


    if (!file) {

      customForm.submit();

      setTimeout(() => {

        successMessage.hidden = false;

        customForm.reset();

      }, 1500);

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      function () {

        const img =
          new Image();


        img.onload =
          function () {

            const canvas =
              document.createElement(
                'canvas'
              );


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


            photoData.value =
              compressedData;


            photoName.value =
              file.name.replace(
                /\.[^/.]+$/,
                ''
              ) + '.jpg';


            photoMimeType.value =
              'image/jpeg';


            customForm.submit();


            setTimeout(() => {

              successMessage.hidden =
                false;

              customForm.reset();

            }, 1500);

          };


        img.src = reader.result;

      };


    reader.readAsDataURL(file);

  }
);