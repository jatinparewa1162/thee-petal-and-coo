const products=[
 {name:'The Pink Promise',price:'₹899',tag:'best seller',image:'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85'},
 {name:'Strawberry Fields',price:'₹699',tag:'new in',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85'},
 {name:'Sunshine, Always',price:'₹799',tag:'',image:'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=900&q=85'},
 {name:'A Little Something',price:'₹499',tag:'',image:'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=900&q=85'}
];

const instagramImages=[
 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',
 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=80',
 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=500&q=80',
 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=500&q=80',
 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80',
 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=500&q=80'
];

let cartCount=0;

const productRoot=document.querySelector('#products');

products.forEach((product)=>{
  const card=document.createElement('article');

  card.className='product-card';

  card.innerHTML=`
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${product.tag?`<span class="tag">${product.tag}</span>`:''}
      <button class="add-button" aria-label="Add ${product.name} to bag">♧</button>
    </div>

    <div class="product-info">
      <div>
        <h3>${product.name}</h3>
        <p>${product.price}</p>
      </div>

      <button class="heart" aria-label="Save ${product.name}">♡</button>
    </div>
  `;

  card.querySelector('.add-button').addEventListener('click',()=>{
    cartCount+=1;

    const badge=document.querySelector('#cart-count');

    badge.hidden=false;
    badge.textContent=cartCount;
  });

  productRoot.appendChild(card);
});


const instaRoot=document.querySelector('#instagram-grid');

instagramImages.forEach((src,index)=>{
  const link=document.createElement('a');

  link.href='https://instagram.com/thhepetalandco';
  link.target='_blank';
  link.rel='noreferrer';

  link.innerHTML=`
    <img src="${src}" alt="Instagram post ${index+1}" loading="lazy">
  `;

  instaRoot.appendChild(link);
});


const drawer=document.querySelector('#mobile-drawer');
const backdrop=document.querySelector('#drawer-backdrop');

function toggleMenu(open){
  drawer.classList.toggle('open',open);
  backdrop.classList.toggle('open',open);
  drawer.setAttribute('aria-hidden',String(!open));
}

document.querySelector('#menu-open').addEventListener('click',()=>{
  toggleMenu(true);
});

document.querySelector('#menu-close').addEventListener('click',()=>{
  toggleMenu(false);
});

backdrop.addEventListener('click',()=>{
  toggleMenu(false);
});

drawer.querySelectorAll('a').forEach((link)=>{
  link.addEventListener('click',()=>{
    toggleMenu(false);
  });
});


/* CUSTOM ORDER FORM */

document.querySelector('#custom-form').addEventListener('submit',(event)=>{
  document.querySelector('#form-success').hidden=false;
});