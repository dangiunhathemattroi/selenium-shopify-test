// Selenium WebDriver test for Shopify site
import { Builder, By, Key, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"

async function runShopifyTest() {
  // Set up Chrome options
  const options = new chrome.Options()
  // Uncomment the line below to run in headless mode
  // options.addArguments('--headless');

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()

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

    // Test Case 4: Checkout process
    console.log("Test Case 4: Proceeding to checkout")

    // Go to cart page or checkout directly
    const checkoutButton = await driver.findElement(
      By.css('.cart__checkout, a[href*="checkout"], button[name="checkout"]'),
    )
    await checkoutButton.click()

    // Wait for checkout page to load
    await driver.wait(until.elementLocated(By.css("#checkout_email, #checkout_shipping_address_first_name")), 15000)
    console.log("Checkout page loaded")

    // Fill in customer information (email)
    const emailField = await driver.findElement(By.css("#checkout_email, #email"))
    await emailField.sendkeys("test@example.com")

    // Fill in shipping information if on the first step
    try {
      const firstNameField = await driver.findElement(By.css("#checkout_shipping_address_first_name"))
      await firstNameField.sendKeys("Test")

      const lastNameField = await driver.findElement(By.css("#checkout_shipping_address_last_name"))
      await lastNameField.sendKeys("User")

      const addressField = await driver.findElement(By.css("#checkout_shipping_address_address1"))
      await addressField.sendKeys("123 Test Street")

      const cityField = await driver.findElement(By.css("#checkout_shipping_address_city"))
      await cityField.sendKeys("Test City")

      const zipField = await driver.findElement(By.css("#checkout_shipping_address_zip"))
      await zipField.sendKeys("12345")

      // Select country if dropdown exists
      try {
        const countrySelect = await driver.findElement(By.css("#checkout_shipping_address_country"))
        await countrySelect.click()
        const countryOption = await driver.findElement(By.css('option[value="US"]'))
        await countryOption.click()

        // Wait for province/state field to be populated
        await driver.sleep(1000)

        // Select state/province
        const provinceSelect = await driver.findElement(By.css("#checkout_shipping_address_province"))
        await provinceSelect.click()
        const provinceOption = await driver.findElement(
          By.css("#checkout_shipping_address_province option:nth-child(2)"),
        )
        await provinceOption.click()
      } catch (error) {
        console.log("Country/province selection not available or already selected")
      }

      const phoneField = await driver.findElement(By.css("#checkout_shipping_address_phone"))
      await phoneField.sendKeys("1234567890")

      console.log("Shipping information filled")
    } catch (error) {
      console.log("Already on email step or shipping information not required at this stage")
    }

    // Continue to next step (shipping method)
    try {
      const continueButton = await driver.findElement(
        By.css('button[type="submit"][id*="continue"], .step__footer__continue-btn'),
      )
      await continueButton.click()
      console.log("Continued to shipping method")

      // Wait for shipping method page to load
      await driver.wait(until.elementLocated(By.css(".section--shipping-method")), 10000)

      // Select shipping method (usually first one is selected by default)
      // Continue to payment method
      const continueToPaymentButton = await driver.findElement(
        By.css('button[type="submit"][id*="continue"], .step__footer__continue-btn'),
      )
      await continueToPaymentButton.click()
      console.log("Continued to payment method")

      // Note: We'll stop here before entering actual payment details
      console.log("Test completed successfully up to payment information")
    } catch (error) {
      console.log("Could not proceed to shipping/payment: ", error.message)
    }

    // Take a screenshot of the final state
    await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("shopify-test-result.png", image, "base64")
    })
    console.log("Screenshot saved as shopify-test-result.png")
  } catch (error) {
    console.error("Test failed:", error)
  } finally {
    // Close the browser
   // await driver.quit()
    //console.log("Test finished, browser closed")
  }
}

// Run the test
runShopifyTest()