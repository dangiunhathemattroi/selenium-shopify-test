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

    await driver.wait(until.elementLocated(By.css("body")), 10000)

    // Test Case 1: Product details and following a product
    console.log("Test Case 1: Viewing product details and following")

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

    console.log(" Step 3: Navigating to cart page...")
    await driver.get("https://dtn1-theme.myshopify.com/cart")

    // Đợi cart page load
    await driver.wait(until.elementLocated(By.css("body")), 5000)
    console.log("✅ Successfully accessed cart page")

    // Kiểm tra sản phẩm trong giỏ hàng
    console.log(" Verifying cart contents...")
    try {
      // Sử dụng selector cụ thể hơn để tránh đếm trùng lặp
      const cartItems = await driver.findElements(By.css('.cart-item:not(.hide), .cart__item:not(.hide)'));
      if (cartItems.length > 0) {
        console.log(`Giỏ hàng không trống!`);
        await driver.sleep(5000)

        
        // Test Case 2: Cập nhật số lượng sản phẩm
        console.log(" Test Case 2: Updating product quantity...");
        
        try {
          // Phương pháp 1: Click button +/- để tăng/ giảm số lượng
          console.log("Attempting to find quantity input...");

           // Tìm nút tăng số lượng trong form
           const plusButton = await cartForm.findElement(By.css('button[name="plus"], button.quantity__button[name="plus"], .js-qty__adjust--plus, .quantity__button--plus'));
           console.log("Đã tìm thấy nút tăng số lượng trong form");
           
           // Scroll đến nút plus để đảm bảo nhìn thấy được
           await driver.executeScript("arguments[0].scrollIntoView(true);", plusButton);
           await driver.sleep(5000);
           
           
           console.log("Thử click bằng JavaScript...");
           await driver.executeScript("arguments[0].click();", plusButton);
           console.log("Đã click vào nút tăng số lượng lần 1");
           await driver.sleep(5000);
           
           
           await driver.executeScript("arguments[0].click();", plusButton);
           console.log("Đã tăng số lượng lên 3");
          await driver.sleep(10000);

          // const quantitySelectors = [
          //   'input[type="number"].quantity__input', 
          //   '.cart__qty-input',
          //   'input.quantity',
          //   'input.cart-item-qty-input',
          //   '.quantity-selector input',
          //   '[data-quantity-input]',
          //   '[name="updates[]"]'
          // ];
          
          // let quantityInput = null;
          
          // // Thử từng selector cho đến khi tìm thấy
          // for (const selector of quantitySelectors) {
          //   try {
          //     const inputs = await driver.findElements(By.css(selector));
          //     if (inputs.length > 0) {
          //       console.log(`Found quantity input using selector: ${selector}`);
          //       quantityInput = inputs[0]; // Lấy phần tử đầu tiên
          //       break;
          //     }
          //   } catch (e) {
          //     // Tiếp tục thử selector khác
          //   }
          // }
          
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
        
        // Test Case 4 đã được comment out
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
