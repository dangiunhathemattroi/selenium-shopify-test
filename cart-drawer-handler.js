// Specialized handler for Shopify cart drawer
import { By, until, Key } from "selenium-webdriver"

export class CartDrawerHandler {
  constructor(driver) {
    this.driver = driver
  }

  async waitForDrawerToOpen() {
    console.log("Waiting for cart drawer to open...")

    const selectors = [".cart-drawer", ".drawer--right", ".cart-sidebar", "#CartDrawer", "[data-cart-drawer]"]

    for (const selector of selectors) {
      try {
        const element = await this.driver.wait(until.elementLocated(By.css(selector)), 5000)

        // Check if drawer is visible (not just present in DOM)
        const isVisible = await this.driver.executeScript("return arguments[0].offsetParent !== null", element)

        if (isVisible) {
          console.log(`Cart drawer found with selector: ${selector}`)
          return element
        }
      } catch (error) {
        continue
      }
    }

    throw new Error("Cart drawer not found or not visible")
  }

  async findCheckoutButton(drawerElement) {
    console.log("Looking for checkout button in cart drawer...")

    const checkoutSelectors = [
      ".cart-drawer__checkout",
      ".cart__checkout-button",
      ".drawer__checkout",
      ".cart-drawer-footer .btn",
      "[data-cart-drawer-checkout]",
      'a[href*="checkout"]',
      'button[name="checkout"]',
    ]

    for (const selector of checkoutSelectors) {
      try {
        const button = await drawerElement.findElement(By.css(selector))
        const isVisible = await this.driver.executeScript("return arguments[0].offsetParent !== null", button)

        if (isVisible) {
          console.log(`Checkout button found with selector: ${selector}`)
          return button
        }
      } catch (error) {
        continue
      }
    }

    throw new Error("Checkout button not found in cart drawer")
  }

  async clickCheckoutInDrawer() {
    try {
      // Wait for drawer to open
      const drawer = await this.waitForDrawerToOpen()

      // Wait for any animations to complete
      await this.driver.sleep(1000)

      // Find and click checkout button
      const checkoutButton = await this.findCheckoutButton(drawer)

      // Scroll button into view if needed
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});",
        checkoutButton,
      )

      await this.driver.sleep(500)

      // Try clicking the button
      await checkoutButton.click()

      console.log("Successfully clicked checkout button in cart drawer")
      return true
    } catch (error) {
      console.log("Failed to click checkout in cart drawer:", error.message)
      return false
    }
  }

  async closeDrawer() {
    console.log("Attempting to close cart drawer...")

    const closeSelectors = [
      ".cart-drawer__close",
      ".drawer__close",
      ".cart-close",
      "[data-cart-drawer-close]",
      ".drawer-overlay",
    ]

    for (const selector of closeSelectors) {
      try {
        const closeButton = await this.driver.findElement(By.css(selector))
        await closeButton.click()
        console.log("Cart drawer closed")
        return true
      } catch (error) {
        continue
      }
    }

    // Try pressing Escape key as fallback
    try {
      await this.driver.actions().sendKeys(Key.ESCAPE).perform()
      console.log("Attempted to close drawer with Escape key")
      return true
    } catch (error) {
      console.log("Could not close cart drawer")
      return false
    }
  }

  async getCartItemCount() {
    try {
      const drawer = await this.waitForDrawerToOpen()
      const items = await drawer.findElements(By.css(".cart-item, .drawer__cart-item"))
      return items.length
    } catch (error) {
      console.log("Could not get cart item count:", error.message)
      return 0
    }
  }
}
