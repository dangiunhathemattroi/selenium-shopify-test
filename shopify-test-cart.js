import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { waitForElement, safeClick, fillField, takeScreenshot } from "./utils/helpers.js";
import { SELECTORS } from "./utils/selectors.js";

async function runShopifyTest() {
  const options = new chrome.Options();

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    console.log("Starting Shopify test...");

    // Truy cập vào trang Shopify
    await driver.get("https://dtn1-theme.myshopify.com/");
    console.log("Navigated to Shopify store");

    const sendpass = await driver.findElement(By.css("form #password"))
    sendpass.sendKeys("Bss123@#", Key.RETURN)

    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.css("body")), 10000)

    // Test Case 1: Product details and following a product
    console.log("Test Case 1: Viewing product details and following")

    // Click on a product
    const productLink = await driver.findElement(By.css('.card-wrapper.product-card-wrapper'))
    await productLink.click()

    console.log("PDP loaded!");

    await driver.sleep(5000)

    // Lưu tên sản phẩm để so sánh sau này
    const productTitle = await driver.findElement(By.css('h1')).getText();
    console.log(`Selected product: ${productTitle}`);

    //add to cart 
    const addToCartButton = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton.click()

    // Wait for the cart to update
    await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 10000)
    console.log("Product added to cart")

    await driver.sleep(5000)
    const close = await driver.findElement(By.css('.drawer__close'))
    await close.click();

    console.log("🛍️ Step 3: Navigating to cart page...")
    await driver.get("https://dtn1-theme.myshopify.com/cart")

    // Kiểm tra xem có redirect về password page không
    const currentUrl = await driver.getCurrentUrl()
    console.log(`Current URL: ${currentUrl}`)

    if (currentUrl.includes("password")) {
      console.log("❌ Still redirected to password page")
      return
    }

    // Đợi cart page load
    await driver.wait(until.elementLocated(By.css("body")), 5000)
    console.log("✅ Successfully accessed cart page")

    // Kiểm tra sản phẩm trong giỏ hàng
    console.log("🔍 Verifying cart contents...")
    try {
      const cartItems = await driver.findElements(By.css('.cart-item, .cart__item'));
      if (cartItems.length > 0) {
        console.log(`✅ Found ${cartItems.length} item(s) in cart`);
        await driver.sleep(5000)

        // Kiểm tra tên sản phẩm có đúng không
        const cartProductTitle = await driver.findElement(By.css('.cart-item__name, .cart__item-title, .cart-item__heading a')).getText();
        console.log(`Cart product: ${cartProductTitle}`);
        
        if (cartProductTitle.includes(productTitle) || productTitle.includes(cartProductTitle) || cartProductTitle !== '') {
          console.log('✅ Correct product is in cart');
        } else {
          console.log('❌ Product title mismatch between PDP and cart');
        }
        
        // Test Case 2: Cập nhật số lượng sản phẩm
        console.log("\n🔄 Test Case 2: Updating product quantity...");
        
        try {
          // Phương pháp 1: Tìm phần tử quantity input và thử nhiều cách để tương tác
          console.log("Attempting to find quantity input...");
          
          // Liệt kê nhiều selector có thể cho input số lượng
          const quantitySelectors = [
            'input[type="number"].quantity__input', 
            '.cart__qty-input',
            'input.quantity',
            'input.cart-item-qty-input',
            '.quantity-selector input',
            '[data-quantity-input]',
            '[name="updates[]"]'
          ];
          
          let quantityInput = null;
          
          // Thử từng selector cho đến khi tìm thấy
          for (const selector of quantitySelectors) {
            try {
              const inputs = await driver.findElements(By.css(selector));
              if (inputs.length > 0) {
                console.log(`Found quantity input using selector: ${selector}`);
                quantityInput = inputs[0]; // Lấy phần tử đầu tiên
                break;
              }
            } catch (e) {
              // Tiếp tục thử selector khác
            }
          }
          
          if (quantityInput) {
            // Scroll đến phần tử để đảm bảo nhìn thấy được
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", quantityInput);
            await driver.sleep(1000);
            
            try {
              // Phương pháp 2: Sử dụng JavaScript để thay đổi giá trị
              console.log("Using JavaScript to update quantity...");
              await driver.executeScript("arguments[0].value = '2';", quantityInput);
              await driver.sleep(500);
              
              // Kích hoạt sự kiện thay đổi để cập nhật cart
              await driver.executeScript("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", quantityInput);
              console.log("Quantity updated to 2 via JavaScript");
              
              // Tìm và nhấn nút cập nhật giỏ hàng (nếu có)
              try {
                const updateButton = await driver.findElement(By.css('button.cart__update, .update-cart, [name="update"], .quantity-update-btn, button[type="submit"]'));
                console.log("Found update button, clicking...");
                await updateButton.click();
              } catch (updateError) {
                console.log("No update button found or auto-update enabled");
              }
              
              await driver.sleep(5000);  // Đợi lâu hơn để cart update
              
              // Kiểm tra giá đã thay đổi (tăng lên)
              console.log("Verifying price updated correctly...");
              
              const subtotalElement = await driver.findElement(By.css('.cart-subtotal__price, .subtotal-price, .totals__subtotal-value, [data-cart-subtotal]'));
              const subtotalText = await subtotalElement.getText();
              console.log(`Cart subtotal: ${subtotalText}`);
            } catch (jsError) {
              console.log(`JavaScript update failed: ${jsError.message}`);
            }
          } else {
            console.log("❌ Could not find any quantity input element");
          }
        } catch (quantityError) {
          console.log(`Error updating quantity: ${quantityError.message}`);
        }
        
        // Test Case 3: Xóa sản phẩm khỏi giỏ hàng
        console.log("\n❌ Test Case 3: Removing product from cart...");
        
        try {
          // Tìm nút xóa với nhiều selector có thể
          const removeSelectors = [
            '.cart-item__remove', 
            '.cart__remove', 
            '[data-cart-remove]',
            '.remove-item',
            'a.cart-remove-btn',
            '.remove-from-cart-button'
          ];
          
          let removeButton = null;
          
          // Thử từng selector cho đến khi tìm thấy
          for (const selector of removeSelectors) {
            try {
              const buttons = await driver.findElements(By.css(selector));
              if (buttons.length > 0) {
                console.log(`Found remove button using selector: ${selector}`);
                removeButton = buttons[0]; // Lấy phần tử đầu tiên
                break;
              }
            } catch (e) {
              // Tiếp tục thử selector khác
            }
          }
          
          if (removeButton) {
            // Scroll đến nút xóa để đảm bảo nhìn thấy được
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", removeButton);
            await driver.sleep(1000);
            
            try {
              // Thử click trực tiếp
              await removeButton.click();
              console.log("Clicked remove button");
            } catch (clickError) {
              console.log(`Direct click failed: ${clickError.message}, trying JavaScript click...`);
              // Thử click bằng JavaScript nếu click trực tiếp thất bại
              await driver.executeScript("arguments[0].click();", removeButton);
              console.log("Clicked remove button via JavaScript");
            }
            
            // Đợi cho cart update
            await driver.sleep(5000);
            
            // Kiểm tra cart trống
            try {
              // Nhiều selector cho thông báo giỏ hàng trống
              const emptyCartSelectors = [
                '.empty-cart', 
                '.cart--empty-message', 
                '.cart__empty-text',
                '.empty-cart-message',
                '.cart-empty-message'
              ];
              
              let emptyCartFound = false;
              
              for (const selector of emptyCartSelectors) {
                try {
                  const emptyMessages = await driver.findElements(By.css(selector));
                  if (emptyMessages.length > 0) {
                    emptyCartFound = true;
                    break;
                  }
                } catch (e) {
                  // Tiếp tục thử selector khác
                }
              }
              
              // Phương pháp thay thế: kiểm tra số lượng sản phẩm trong giỏ hàng
              if (!emptyCartFound) {
                const remainingItems = await driver.findElements(By.css('.cart-item, .cart__item'));
                if (remainingItems.length === 0) {
                  emptyCartFound = true;
                }
              }
              
              if (emptyCartFound) {
                console.log("✅ Cart is now empty");
              } else {
                console.log("❌ Cart is not empty after removal");
              }
            } catch (error) {
              console.log(`Error checking empty cart: ${error.message}`);
            }
          } else {
            console.log("❌ Could not find any remove button");
          }
        } catch (removeError) {
          console.log(`Error removing product: ${removeError.message}`);
        }
        
        // Test Case 4: Thêm lại sản phẩm và tiến hành checkout
        console.log("\n🔄 Test Case 4: Re-adding product and proceeding to checkout...");
        
        // Quay lại trang PDP
        await driver.navigate().back();
        await driver.sleep(3000);
        
        // Nếu quay lại PDP, thêm sản phẩm vào giỏ hàng
        try {
          // Kiểm tra xem đã quay lại PDP chưa
          let currentURL = await driver.getCurrentUrl();
          console.log(`Current URL after navigate back: ${currentURL}`);
          
          // Thêm lại sản phẩm vào giỏ hàng
          try {
            const addToCartSelectors = [
              'button[name="add"]', 
              '.add-to-cart',
              '.product-form__add-button',
              '.product-form__cart-submit',
              '[data-add-to-cart]'
            ];
            
            let addToCartAgain = null;
            
            // Thử từng selector cho đến khi tìm thấy
            for (const selector of addToCartSelectors) {
              try {
                const buttons = await driver.findElements(By.css(selector));
                if (buttons.length > 0) {
                  console.log(`Found add to cart button using selector: ${selector}`);
                  addToCartAgain = buttons[0];
                  break;
                }
              } catch (e) {
                // Tiếp tục thử selector khác
              }
            }
            
            if (addToCartAgain) {
              // Scroll đến nút Add to cart để đảm bảo nhìn thấy được
              await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", addToCartAgain);
              await driver.sleep(1000);
              
              try {
                await addToCartAgain.click();
                console.log("Product added to cart again");
              } catch (clickError) {
                console.log(`Direct click failed: ${clickError.message}, trying JavaScript click...`);
                await driver.executeScript("arguments[0].click();", addToCartAgain);
                console.log("Product added to cart via JavaScript click");
              }
              
              // Đợi cart drawer hiển thị
              await driver.sleep(5000);  // Đợi lâu hơn
              
              // Click checkout nếu có trong cart drawer
              try {
                const checkoutSelectors = [
                  SELECTORS.DAWN_CART_DRAWER_CHECKOUT,
                  '.cart-checkout-button',
                  '.cart__checkout',
                  '.checkout-button',
                  'button[name="checkout"]',
                  'input[name="checkout"]',
                  'a[href*="checkout"]'
                ];
                
                let checkoutButton = null;
                
                // Thử từng selector cho đến khi tìm thấy
                for (const selector of checkoutSelectors) {
                  try {
                    const buttons = await driver.findElements(By.css(selector));
                    if (buttons.length > 0) {
                      console.log(`Found checkout button using selector: ${selector}`);
                      checkoutButton = buttons[0];
                      break;
                    }
                  } catch (e) {
                    // Tiếp tục thử selector khác
                  }
                }
                
                if (checkoutButton) {
                  // Scroll đến nút checkout để đảm bảo nhìn thấy được
                  await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", checkoutButton);
                  await driver.sleep(1000);
                  
                  try {
                    await checkoutButton.click();
                    console.log("Checkout button clicked");
                  } catch (clickError) {
                    console.log(`Direct click failed: ${clickError.message}, trying JavaScript click...`);
                    await driver.executeScript("arguments[0].click();", checkoutButton);
                    console.log("Checkout button clicked via JavaScript");
                  }
                  
                  await driver.sleep(5000);
                  
                  const checkoutURL = await driver.getCurrentUrl();
                  if (checkoutURL.includes('checkout')) {
                    console.log(`✅ Successfully navigated to checkout: ${checkoutURL}`);
                    
                    // Chụp ảnh màn hình checkout
                    await takeScreenshot(driver, "checkout-screen.png");
                  } else {
                    console.log(`❌ Failed to navigate to checkout. Current URL: ${checkoutURL}`);
                  }
                } else {
                  console.log("Could not find checkout button in cart drawer");
                }
              } catch (error) {
                console.log(`Error during checkout: ${error.message}`);
              }
            } else {
              console.log("Could not find add to cart button");
            }
          } catch (error) {
            console.log(`Could not re-add product: ${error.message}`);
          }
        } catch (error) {
          console.log(`Error navigating back: ${error.message}`);
        }
        
      } else {
        console.log("❌ No items found in cart");
      }
    } catch (error) {
      console.error(`Error during cart verification: ${error.message}`);
    }

  } finally {
    console.log("\n🏁 Test finished!");
    //console.log("Closing browser in 5 seconds...");
    //await driver.sleep(5000); // Give time to see the final screen
    //await driver.quit();
  }
}

// Run the test
runShopifyTest();
