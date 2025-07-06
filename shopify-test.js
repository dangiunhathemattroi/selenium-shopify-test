// Selenium WebDriver test for Shopify site
import { Builder, By, Key, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import { CartDrawerHandler } from "./cart-drawer-handler.js"
import { safeClick } from "./utils/helpers.js"


async function runShopifyTest() {
  // Set up Chrome options
  const options = new chrome.Options()
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

    console.log("Test Case 3: Proceeding to checkout")

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
    await driver.sleep(10000);

    const payButton1 = await driver.wait(until.elementLocated(By.id('checkout-pay-button')), 10000,)
    await payButton1.click()
    await driver.sleep(4000);

    const firstNameEls = await driver.findElements(By.xpath("//input[@name='firstName']"));
    if (firstNameEls.length) {
      await firstNameEls[0].sendKeys("Test");
    }

    const lastNameEls = await driver.findElements(By.xpath("//input[@name='lastName']"));
    if (lastNameEls.length) {
      await lastNameEls[0].sendKeys("User");
    }

    const addressEls = await driver.findElements(By.xpath("//input[@name='address1']"));
    if (addressEls.length) {
      await addressEls[0].sendKeys("123 Test Street");
    }

    const cityEls = await driver.findElements(By.xpath("//input[@name='city']"));
    if (cityEls.length) {
      await cityEls[0].sendKeys("Test City", Key.RETURN);
    }

    await driver.sleep(5000)

    console.log("process payment...")

    const numberFrame = await driver.wait(until.elementLocated(By.css('iframe[id^="card-fields-number"]')), 10000)
    await driver.switchTo().frame(numberFrame)
    await driver.findElement(By.name('number')).sendKeys('1')
    await driver.sleep(2000);
    await driver.switchTo().defaultContent()

    // Expiry date
    const expiryFrame = await driver.wait(until.elementLocated(By.css('iframe[id^="card-fields-expiry"]')), 10000)
    await driver.switchTo().frame(expiryFrame)
    await driver.findElement(By.name('expiry')).sendKeys('12')
    await driver.sleep(2000);
    await driver.switchTo().defaultContent()

    await driver.sleep(2000);

    await driver.switchTo().frame(expiryFrame)
    await driver.findElement(By.name('expiry')).sendKeys('30')
    await driver.sleep(2000);
    await driver.switchTo().defaultContent()

    // CVV
    const cvvFrame = await driver.wait(
      until.elementLocated(By.css('iframe[id^="card-fields-verification_value"]')),
      10000
    )
    await driver.switchTo().frame(cvvFrame)
    await driver.findElement(By.name('verification_value')).sendKeys('123')
    await driver.sleep(2000);
    await driver.switchTo().defaultContent()

    const payButton = await driver.wait(until.elementLocated(By.id('checkout-pay-button')), 10000,)
    await payButton.click()
    await driver.sleep(10000);



    console.log("Test completed successfully up to payment information")

  }
  catch (error) {
    console.error("Test failed:", error)
  } finally {
    //await driver.quit();
    console.log("Test finished, browser closed!")
  }
}

// Run the test
runShopifyTest()