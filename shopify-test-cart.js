import {
  Builder,
  By,
  Key,
  until
} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import {
  waitForElement,
  safeClick,
  fillField,
  takeScreenshot
} from "./utils/helpers.js";
import {
  SELECTORS
} from "./utils/selectors.js";

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

    await driver.wait(until.elementLocated(By.css("body")), 5000)

    // Test Case 1: Product details and following a product
    console.log("Test Case 1: Viewing product details and following")

    const productLink = await driver.findElement(By.css('.card-wrapper.product-card-wrapper'))
    await productLink.click()

    console.log("PDP loaded!");

    await driver.sleep(1000)

    // Lưu tên sản phẩm để so sánh sau này
    const productTitle = await driver.findElement(By.css('h1')).getText();
    console.log(`Selected product: ${productTitle}`);

    //add to cart 
    const addToCartButton = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton.click()

    // Wait for the cart to update
    await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 10000)
    console.log("Product added to cart")

    await driver.sleep(2000)
    const close = await driver.findElement(By.css('.drawer__close'))
    await close.click();

    console.log(" Step 3: Navigating to cart page...")
    await driver.get("https://dtn1-theme.myshopify.com/cart")

    // Đợi cart page load
    await driver.wait(until.elementLocated(By.css("body")), 2000)
    console.log("✅ Successfully accessed cart page")

    // Kiểm tra sản phẩm trong giỏ hàng
    console.log(" Verifying cart contents...")
    const cartItems = await driver.findElements(By.css('.cart-item:not(.hide), .cart__item:not(.hide)'));
    if (cartItems.length > 0) {
      await driver.sleep(2000)
      
      // Test Case 2: Cập nhật số lượng sản phẩm
      console.log(" Test Case 2: Updating product quantity...");
      try {
        // Phương pháp 1: Nhap input 

        const quantityInput = await driver.findElement(By.css("form.cart__contents .cart__items .cart-items #CartItem-1 .cart-item__quantity input.quantity__input"))

        if (quantityInput) {
          // Scroll đến phần tử để đảm bảo nhìn thấy được
          await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", quantityInput);
          await driver.sleep(1000);

          try {
            // Phương pháp 2: Sử dụng JavaScript để thay đổi giá trị
            console.log("Using JavaScript to update quantity...");
            await driver.executeScript("arguments[0].value = '10';", quantityInput);
            await driver.sleep(500);
            console.log('Cập nhật số lượng thành công!')

            // Tìm và nhấn nút cập nhật giỏ hàng 
            try {
              const buttonPlus = await driver.findElement(By.css('form.cart__contents .cart__items .cart-items #CartItem-1 .cart-item__quantity button[name="plus"]'));
              await buttonPlus.click();
              driver.sleep(1000)
              await buttonPlus.click();
              driver.sleep(1000)
              await buttonPlus.click();
              driver.sleep(1000)
              await buttonPlus.click();
              driver.sleep(1000)
              await buttonPlus.click();

              const buttonminus = await driver.findElement(By.css('form.cart__contents .cart__items .cart-items #CartItem-1 .cart-item__quantity button[name="minus"]'));
              await buttonminus.click();
              driver.sleep(2000)
              await buttonminus.click();
              driver.sleep(2000)

              console.log("\n Test Case 3: Removing product from cart...");
              //clear item product 
              const removeitem = await driver.wait(until.elementLocated(By.css('#Remove-1 a')), 5000);
              await removeitem.click();


            } catch (updateError) {
              console.log("No update button found or auto-update enabled");
            }

          } catch (jsError) {
            console.log(`JavaScript update failed: ${jsError.message}`);
          }

        } else {
          console.log("❌ Could not find any quantity input element");
        }
      } catch (quantityError) {
        console.log(`Error updating quantity: ${quantityError.message}`);
      }

      // Kiểm tra xem giỏ hàng có rỗng không
      const emptyCartFound = await driver.findElements(By.css('.cart__item')).then(items => items.length === 0);

      if (emptyCartFound) {
        console.log("✅ Cart is now empty");
      } else {
        console.log("❌ Cart is not empty after removal");
      }
      // Test Case 4 đã được comment out  
    } else {
      console.log("❌ No items found in cart");
    }


  } catch (error) {
    console.error(`Error during cart verification: ${error.message}`);
  } finally {
    console.log("\n🏁 Test finished!");
    //console.log("Closing browser in 5 seconds...");
    //await driver.sleep(5000); // Give time to see the final screen
    //await driver.quit();
  }
}

// Run the test
runShopifyTest();