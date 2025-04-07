// Enhanced Selenium WebDriver test for Shopify site with better structure
import { Builder, By } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import { SELECTORS } from "./utils/selectors.js"
import { waitForElement, safeClick, fillField, takeScreenshot } from "./utils/helpers.js"

class ShopifyTest {
  constructor(url) {
    this.url = url
    this.driver = null
  }

  async setup() {
    const options = new chrome.Options()
    // Uncomment for headless mode
    // options.addArguments('--headless');

    this.driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()
  }

  async teardown() {
    if (this.driver) {
      await this.driver.quit()
      console.log("Browser closed")
    }
  }

  async navigateToStore() {
    await this.driver.get(this.url)
    await waitForElement(this.driver, "body")
    console.log(`Navigated to ${this.url}`)
  }

  async browseProducts() {
    console.log("Browsing products...")
    await safeClick(this.driver, SELECTORS.COLLECTION_LINKS)
    await waitForElement(this.driver, SELECTORS.PRODUCT_GRID)
    console.log("Collection page loaded")
  }

  async viewProductDetails() {
    console.log("Viewing product details...")
    await safeClick(this.driver, SELECTORS.PRODUCT_ITEMS)
    await waitForElement(this.driver, SELECTORS.PRODUCT_DETAILS)
    console.log("Product page loaded")
  }

  async followProduct() {
    console.log("Attempting to follow product...")
    try {
      await safeClick(this.driver, SELECTORS.WISHLIST_BUTTON)
      console.log("Product followed/added to wishlist")
    } catch (error) {
      console.log("Follow/wishlist feature not available")
    }
  }

  async selectVariant() {
    console.log("Selecting product variant if available...")
    try {
      await safeClick(this.driver, SELECTORS.VARIANT_SELECTORS)
      console.log("Product variant selected")
    } catch (error) {
      console.log("No product variants available")
    }
  }

  async addToCart() {
    console.log("Adding product to cart...")
    await safeClick(this.driver, SELECTORS.ADD_TO_CART_BUTTON)
    await waitForElement(this.driver, SELECTORS.CART_NOTIFICATION)
    console.log("Product added to cart")
  }

  async proceedToCheckout() {
    console.log("Proceeding to checkout...")
    await safeClick(this.driver, SELECTORS.CHECKOUT_BUTTON)
    await waitForElement(this.driver, SELECTORS.CHECKOUT_EMAIL)
    console.log("Checkout page loaded")
  }

  async fillShippingInfo() {
    console.log("Filling shipping information...")

    await fillField(this.driver, SELECTORS.CHECKOUT_EMAIL, "mailto:test@example.com")

    try {
      await fillField(this.driver, SELECTORS.FIRST_NAME, "Test")
      await fillField(this.driver, SELECTORS.LAST_NAME, "User")
      await fillField(this.driver, SELECTORS.ADDRESS, "123 Test Street")
      await fillField(this.driver, SELECTORS.CITY, "Test City")
      await fillField(this.driver, SELECTORS.ZIP, "12345")
      await fillField(this.driver, SELECTORS.PHONE, "1234567890")

      // Handle country and province selection
      try {
        const countrySelect = await waitForElement(this.driver, SELECTORS.COUNTRY)
        await countrySelect.click()
        const countryOption = await this.driver.findElement(By.css('option[value="US"]'))
        await countryOption.click()

        await this.driver.sleep(1000)

        const provinceSelect = await waitForElement(this.driver, SELECTORS.PROVINCE)
        await provinceSelect.click()
        const provinceOption = await this.driver.findElement(By.css(`${SELECTORS.PROVINCE} option:nth-child(2)`))
        await provinceOption.click()
      } catch (error) {
        console.log("Country/province selection not available or already selected")
      }

      console.log("Shipping information filled")
    } catch (error) {
      console.log("Already on email step or shipping information not required at this stage")
    }
  }

  async continueToShipping() {
    console.log("Continuing to shipping method...")
    await safeClick(this.driver, SELECTORS.CONTINUE_BUTTON)
    console.log("Continued to shipping method")
  }

  async runFullTest() {
    try {
      await this.setup()
      await this.navigateToStore()
      await this.browseProducts()
      await this.viewProductDetails()
      await this.followProduct()
      await this.selectVariant()
      await this.addToCart()
      await this.proceedToCheckout()
      await this.fillShippingInfo()
      await this.continueToShipping()

      // Take screenshot of final state
      await takeScreenshot(this.driver, "shopify-test-result.png")

      console.log("Test completed successfully")
    } catch (error) {
      console.error("Test failed:", error)
      await takeScreenshot(this.driver, "shopify-test-error.png")
    } finally {
      await this.teardown()
    }
  }
}

// Run the test
const shopifyTest = new ShopifyTest("http://skworld.vn/")
shopifyTest.runFullTest()