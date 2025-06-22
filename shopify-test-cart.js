import {
  Builder,
  By,
  Key,
  until
} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

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
    await driver.get("https://dtn1-theme.myshopify.com/vi-vn/cart")

    // Đợi cart page load
    await driver.wait(until.elementLocated(By.css("body")), 2000)
    console.log("✅ Successfully accessed cart page")

    // Kiểm tra sản phẩm trong giỏ hàng
    console.log(" Verifying cart contents...")
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
              const buttonPlus = await driver.findElement(By.css('form.cart__contents .cart__items .cart-items #CartItem-1 .cart-item__quantity button[name="plus"]'));
              await buttonPlus.click();
              await driver.sleep(2000)

              const buttonminus = await driver.findElement(By.css('form.cart__contents .cart__items .cart-items #CartItem-1 .cart-item__quantity button[name="minus"]'));
              await buttonminus.click();

              console.log("\n Test Case 3: Removing product from cart...");
              await driver.sleep(2000)
              //clear item product 
              const removeitem = await driver.findElement(By.css('cart-remove-button#Remove-1 a.button--tertiary'));
              await removeitem.click();
              
              // Đợi xử lý xóa sản phẩm
              await driver.sleep(2000);
              
              
              // Kiểm tra URL hiện tại sau khi xóa
              const currentUrl = await driver.getCurrentUrl();
              console.log(`Current URL after removal: ${currentUrl}`);
              
              // Nếu không ở trang giỏ hàng, quay lại trang giỏ hàng
              if (!currentUrl.includes('/cart')) {
                console.log("Redirecting back to cart page...");
                await driver.get("https://dtn1-theme.myshopify.com/vi-vn/cart");
                await driver.wait(until.elementLocated(By.css("body")), 5000);
                console.log("Back to cart page");
              }
              await driver.sleep(10000)
              

              console.log("No update button found or auto-update enabled", updateError);
            

          } catch (jsError) {
            console.log(`JavaScript update failed: ${jsError.message}`);
          }

        } else {
          console.log("Could not find any quantity input element");
        }
      } catch (quantityError) {
        console.log(`Error updating quantity: ${quantityError.message}`);
      }

      // Kiểm tra xem giỏ hàng có rỗng không
      const emptyCartFound = await driver.findElements(By.css('.cart__item')).then(items => items.length === 0);

      if (emptyCartFound) {
        console.log("Cart is now empty");
      } else {
        console.log("Cart is not empty after removal");
      }
      
  } catch (error) {
    console.error(`Error during cart verification: ${error.message}`);
  } finally {
    console.log("\n🏁 Test finished!");
    
  }
}
// Run the test
runShopifyTest();