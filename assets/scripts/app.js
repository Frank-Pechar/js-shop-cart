// product object blueprint definition
class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

// creates object of attribute names and values
class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

// base class creates and inserts DOM elements
class Component {
  constructor(renderHookId, shouldRender = true) {
    // assigns DOM hook for inserting html
    this.hookId = renderHookId;
  }

  // generalized code to create section, ul, and li elements
  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

// Object code for shopping cart section
class ShoppingCart extends Component {
  // array for product items in the shopping cart
  items = [];

  // output total amount to cart section DOM
  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  // sum total amounts from items (ShoppingCart) array
  get totalAmount() {
    const sum = this.items.reduce(
      (prevValue, curItem) => prevValue + curItem.price,
      0
    );
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      alert('Processing Order...');
      // console.log(this.items);
    };
    // this executes the code to render the shopping cart header section
    this.render();
  }

  // add product to cart array
  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    // insert cart section element into DOM
    const cartEl = this.createRootElement('section', 'cart');
    // insert this html inside of cart section
    cartEl.innerHTML = `
      <h1>Shopping Cart</h1>
      <h2>Total: \$${0}</h2>
      <button>Order Now!</button>
    `;
    const orderButton = cartEl.querySelector('button');
    // orderButton.addEventListener('click', () => this.orderProducts());
    orderButton.addEventListener('click', this.orderProducts);
    this.totalOutput = cartEl.querySelector('h2');
  }
}

// Object code the handles logic for inserting product li element into DOM
class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  // this handler function is called when add to cart button is clicked
  addToCart() {
    // call static function in App class
    App.addProductToCart(this.product);
  }

  render() {
    // create li element in insert into DOM
    const prodEl = this.createRootElement('li', 'product-item');
    // insert into li element in the DOM
    prodEl.innerHTML = `
        <div>
          <img src="${this.product.imageUrl}" alt="${this.product.title}" >
          <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>\$${this.product.price}</h3>
            <p>${this.product.description}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      `;
    // add handler for adding product to cart
    const addCartButton = prodEl.querySelector('button');
    addCartButton.addEventListener('click', this.addToCart.bind(this));
  }
}

// Object that controls the creation of DOM product list
class ProductList extends Component {
  #products = [];

  constructor(renderHookId) {
    super(renderHookId, false);
    // render ul element
    this.render();
    // load mock product data into #products array
    this.fetchProducts();
  }

  // create product objects
  fetchProducts() {
    this.#products = [
      new Product(
        'A Pillow',
        'https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg',
        'A soft pillow!',
        19.99
      ),
      new Product(
        'A Carpet',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg',
        'A carpet which you might like - or not.',
        89.99
      ),
    ];
    // render list of products
    this.renderProducts();
  }

  // render each product as a li to the DOM
  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  // render ul element
  // ElementAttribute returns a attr name and value object
  render() {
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list'),
    ]);
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

// object controls main logic for rendering DOM
class Shop {
  constructor() {
    this.render();
  }

  render() {
    // create cart object
    this.cart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  // init cart object
  static cart;

  static init() {
    // create DOM shopping cart section
    const shop = new Shop();
    // store pointer to shoppingCart object so addProductToCart can be called when add to cart button is clicked
    this.cart = shop.cart;
  }

  // this static method acts as a bridge between ProductItem and ShoppingCart
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

// start processing
App.init();
