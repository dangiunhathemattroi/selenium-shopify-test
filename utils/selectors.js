export const SELECTORS = {
    // Existing selectors...
    COLLECTION_LINKS: '.collection-link, a[href*="collections"]',
    PRODUCT_GRID: ".product-grid, .collection-grid",
    PRODUCT_ITEMS: ".product-item a, .product-card a",
    PRODUCT_DETAILS: ".product-single, .product-details",
    WISHLIST_BUTTON: '.follow-button, button[aria-label*="follow"], button[aria-label*="wishlist"]',
    VARIANT_SELECTORS: "select.single-option-selector, .variant-input-wrap input",
    ADD_TO_CART_BUTTON: 'button[name="add"], .add-to-cart, .btn-product-add',
  
    // Cart drawer specific selectors
    CART_DRAWER: ".cart-drawer, .drawer--right, .cart-sidebar, #CartDrawer",
    CART_DRAWER_OVERLAY: ".cart-drawer__overlay, .drawer-overlay, .overlay",
    CART_DRAWER_CHECKOUT: ".cart-drawer__checkout, .cart__checkout-button, .drawer__checkout",
    CART_DRAWER_CLOSE: ".cart-drawer__close, .drawer__close, .cart-close",
    CART_NOTIFICATION: ".cart-notification, .cart-drawer, .cart-popup, .added-to-cart",
  
    // Alternative cart selectors
    CART_ICON: ".cart-icon, .header__cart, .site-nav__cart",
    CART_COUNT: ".cart-count, .cart-item-count",
  
    // Checkout selectors
    CHECKOUT_BUTTON: '.cart__checkout, a[href*="checkout"], button[name="checkout"], .checkout-button',
    CHECKOUT_EMAIL: "#checkout_email, #email",
  
    // Form fields
    FIRST_NAME: "#checkout_shipping_address_first_name",
    LAST_NAME: "#checkout_shipping_address_last_name",
    ADDRESS: "#checkout_shipping_address_address1",
    CITY: "#checkout_shipping_address_city",
    ZIP: "#checkout_shipping_address_zip",
    PHONE: "#checkout_shipping_address_phone",
    COUNTRY: "#checkout_shipping_address_country",
    PROVINCE: "#checkout_shipping_address_province",
    CONTINUE_BUTTON: 'button[type="submit"][id*="continue"], .step__footer__continue-btn',
  
    // Dawn theme cart drawer checkout button
    DAWN_CART_DRAWER_CHECKOUT: "#CartDrawer-Checkout",

    DAWN_LOGIN_SUBMIT: '#customer_login input[type="submit"], .customer-login__submit',
  }
  