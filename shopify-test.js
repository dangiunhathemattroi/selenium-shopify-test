// Selenium WebDriver test for Shopify site
import { Builder, By, Key, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import { CartDrawerHandler } from "./cart-drawer-handler.js"
import { waitForElement, safeClick, fillField, takeScreenshot } from "./utils/helpers.js"


async function runShopifyTest() {
  // Set up Chrome options
  const options = new chrome.Options()
  // Uncomment the line below to run in headless mode

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()
  const cartHandler = new CartDrawerHandler(driver)

  try {
    console.log("Starting Shopify test...")

    // Navigate to the Shopify store
    await driver.get("https://dtn1-theme.myshopify.com/")
    console.log("Navigated to Shopify store")


    const sendpass = await driver.findElement(By.css("form #password"))
    sendpass.sendKeys("Bss123@#", Key.RETURN)

    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.css("body")), 10000)

    // Test Case 1: Product details and following a product
    console.log("Test Case 1:  Viewing product details and following")

    // Click on a product
    const productLink = driver.findElement(By.css('.card-wrapper.product-card-wrapper'))
    await productLink.click()

    // Wait for product page to load
    await driver.wait(until.elementLocated(By.css(".content-for-layout, product-info")), 10000)
    console.log("Product page loaded")

    // Follow the product (if the store has this feature)
    try {
      const followButton = await driver.findElement(
        By.css('.follow-button, button[aria-label*="follow"], button[aria-label*="wishlist"]'),
      )
      await followButton.click()
      console.log("Product followed/added to wishlist")
    } catch (error) {
      console.log("Follow/wishlist feature not available or not found")
    }

    // Test Case 2: Add to cart
    console.log("Test Case 2: Adding product to cart")

    // Select product variant if available (size, color, etc.)
    try {
      const variantSelectors = await driver.findElements(
        By.css("variant-selects label"))

      for (let i = 0; i < variantSelectors.length; i++) {
        if (i === 2) {
          const variant = variantSelectors[i];

          // Scroll to the button
          await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", variant);
          await driver.sleep(300);

          // Try normal click
          try {
            await variant.click();
          } catch (err) {
            // Fallback if intercepted
            console.warn("Click intercepted, fallback to JS click");
            await driver.executeScript("arguments[0].click();", variant);
          }

          break;
        }
      }
      console.log("Selected product variant")
    } catch (error) {
      console.log("No product variants available or not found")
    }

    // Add to cart
    const addToCartButton = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton.click()

    // Wait for the cart to update
    await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 10000)
    console.log("Product added to cart")

    // Handle cart drawer
    const checkoutSuccess = await cartHandler.clickCheckoutInDrawer()

    if (!checkoutSuccess) {
      console.log("Cart drawer method failed, trying alternative...")

      // Try clicking cart icon to open drawer/cart
      await safeClick(driver, ".cart-icon, .header__cart")
      await driver.sleep(2000)

      // Try again with cart drawer
      const secondAttempt = await cartHandler.clickCheckoutInDrawer()

      if (!secondAttempt) {
        // Fallback to traditional checkout
        await safeClick(driver, '.cart__checkout, a[href*="checkout"]')
      }
    }

    // Wait for checkout page
    //await waitForElement(driver, "#checkout_email, #checkout_shipping_address_first_name", 15000)
    //console.log("Checkout page loaded successfully")

    //close popup 

    //const closeButton = await driver.wait(until.elementLocated(By.css('.drawer_close')), 10000);
    //await closeButton.click();
    // Test Case 3: Checkout process
    console.log("Test Case 3: Proceeding to checkout")

    //checkout  tu cart drawer
    //const checkoutcart = await driver.findElement(By.css('button[name="checkout"]'))
    //await checkoutcart.click()

    //login từ cart drawer
    await driver.wait(until.elementLocated(By.css(".content-for-layout, .login")), 10000)
    console.log("login page loaded")

    const sendemail = await driver.findElement(By.css("form input[name='customer[email]']"));
    sendemail.sendKeys("ngakn64@gmail.com")

    const sendpw = await driver.findElement(By.css("form input[name='customer[password]']"));
    sendpw.sendKeys("Bss123@#", Key.RETURN)

    console.log("Login successfully");

    //checkout 
    //wait checkoutpage to load
    await driver.wait(until.elementLocated(By.css(".content-for-layout, .djSdi")), 10000)
    console.log("checkout page loaded")

    // Wait for redirect
    //await driver.sleep(3000)
    //console.log("login page loaded")

    // Go to cart page or checkout directly
    const checkoutButton = await driver.findElement(By.id('checkout-pay-button'), 4000);
    await checkoutButton.click()
    await driver.sleep(2000)

    //Go to cart page
    const gotocart = await driver.findElement(By.id('cart-link'), 4000);
    await gotocart.click()

    //Cart page 
    const product2 = driver.findElement(By.id('Slide-template--24678434472230__featured-collection-2'))
    await product2.click()

    // Wait for product page to load
    await driver.wait(until.elementLocated(By.css(".content-for-layout, product-info")), 10000)
    console.log("Product page loaded")

    //change variant + qty
    //const blackVariant = await driver.findElement(By.css('label[for="template--24678434832768__main-1-1"]'));
    //await blackVariant.click();

    //const quantityInput = await driver.findElement(By.name('quantity'));
    //await quantityInput.clear();  // Xóa giá trị hiện tại
    // await quantityInput.sendKeys('3');  // Nhập số lượng mới

    const addToCartButton1 = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton1.click()

    await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 10000)
    console.log("Product added to cart")

    await driver.sleep(2000)

    const close = await driver.findElement(By.css('.drawer__close'))
    await close.click()
    await driver.sleep(2000)

    //Go to cart drawer // sau nay sua thanh cart page
    const gocart = await driver.findElement(By.id('cart-icon-bubble'))
    await gocart.click();
    await driver.sleep(2000)

    // go checkout page
    const checkout = await driver.findElement(By.id('CartDrawer-Checkout'));
    await checkout.click();

    // đang bắt login mới được checkout
    await driver.sleep(1000)
    // Fill in shipping information if on the first step
    try {
      const firstNameField = await driver.findElement(By.id('TextField0'))
      await firstNameField.sendKeys("Test")

      const lastNameField = await driver.findElement(By.id('TextField1'))
      await lastNameField.sendKeys("User")

      const addressField = await driver.findElement(By.id("TextField2"))
      await addressField.sendKeys("123 Test Street")

      const cityField = await driver.findElement(By.id("TextField4"))
      await cityField.sendKeys("Test City")

      await driver.sleep(5000)


      // Payment= "COD" //devsite k dùng đc COD
      // const codRadioButton = await driver.findElement(By.id('basic-paymentOnDelivery'));
      // await codRadioButton.click();
      // await driver.sleep(5000)

      // const checkoutSuccess = await driver.findElement(By.id('checkout-pay-button'));
      // await checkoutSuccess.click();

      //Payment = credit Card 
      // // shopify không cho phép dùng tool để fill data vào iframe của bên t3 -> Đang check solution để làm nốt đoạn này
      // const card_number = await driver.findElement(By.id('number'));
      // await card_number.sendKeys("1");

      // const date = await driver.findElement(By.id('expiry'));
      // await date.sendKeys('12/27');

      // const verification = await driver.findElement(By.id('verification_value'))
      // await verification.sendKeys('123');
        // await driver.switchTo().frame(await driver.findElement(By.xpath("//iframe[contains(@class, 'card-fields-iframe')]")));

        // await driver.findElement(By.xpath('//*[@id="number"]')).sendKeys('1');
        
        // await driver.sleep(5000)
        // await driver.switchTo().defaultContent();

        // // Điền thông tin vào trường "Ngày hết hạn" (MM/YY)
        // console.log(1);
        // await driver.switchTo().frame(await driver.findElement(By.xpath("//iframe[contains(@class, 'card-fields-iframe')]")));
        // await driver.findElement(By.xpath('//*[@id="expiry"]')).sendKeys('1227');
        // await driver.switchTo().defaultContent();
        // await driver.sleep(5000)
        try {
          // Truy cập vào trang có iframe

          // Đảm bảo phần tử input đã sẵn sàng để tương tác
          await driver.switchTo().frame(await driver.findElement(By.xpath("//iframe[contains(@class, 'card-fields-iframe')]")));
          const expiryField = await driver.findElement(By.xpath('//input[contains(@id, "verification")]'));
          expiryField.sendKeys('123');
            console.log("Date expired entered successfully");
        } catch (error) {
            console.error("Test faileddddđ:", error);
        } finally {
            // Đóng trình duyệt sau khi hoàn tất
          await driver.switchTo().defaultContent();
        }

        await driver.switchTo().frame(await driver.findElement(By.xpath("//iframe[contains(@class, 'card-fields-iframe')]")));

        // Điền thông tin vào trường "Mã bảo mật (CVV)"
        await driver.findElement(By.xpath('//*[@id="verification_value"]')).sendKeys('123');
                await driver.switchTo().defaultContent();

        await driver.sleep(5000)

        console.log(3);

        await driver.switchTo().defaultContent();
        // checkout
        const checkoutSuccess = await driver.findElement(By.id('checkout-pay-button'));
        await checkoutSuccess.click();

        console.log('Thông tin thẻ tín dụng đã được điền thành công!');
      //Payment = "Ngân phiếu" / devsite đang không cho dùng phương thức nào khác ngoài thẻ 
      // const manualPayRadio = await driver.findElement(By.css('input[type="radio"][name="basic"][value="manualPayment"]'));
      // await manualPayRadio.click();

      // await driver.sleep(500) // Cho UI cập nhật

      // if (await manualPayRadio.isSelected()) {
      //   console.log("✅ Đã chọn đúng phương thức thanh toán Ngân phiếu")
      // } else {
      //   console.log("⚠️ Lỗi: Radio không được chọn như mong muốn")
      // }


      console.log("Test completed successfully up to payment information")
    }
    catch (error) {
      console.error("Test failed:", error)
    } finally {
      // Close the browser
      // await driver.quit()
      //console.log("Test finished, browser closed")
    }
  }
  catch{

  }
}

// Run the test
runShopifyTest()