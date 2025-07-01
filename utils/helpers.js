import { By, Key, until } from "selenium-webdriver";

/**
 * Waits for an element to be visible and returns it
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<WebElement>} - The found element
 */
export async function waitForElement(driver, selector, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.css(selector)), timeout)
}

/**
 * Attempts to click an element, with retry logic
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} selector - CSS selector
 * @param {number} retries - Number of retries
 * @returns {Promise<boolean>} - Success status
 */
export async function safeClick(driver, selector, retries = 3) {
  let attempts = 0
  while (attempts < retries) {
    try {
      const element = await waitForElement(driver, selector)
      await driver.executeScript("arguments[0].scrollIntoView(true);", element)
      await driver.sleep(1000) // Give time for any animations
      await element.click()
      return true
    } catch (error) {
      attempts++
      console.log(`Click attempt ${attempts} failed for ${selector}: ${error.message}`)
      await driver.sleep(1000) // Wait before retry
    }
  }
  console.error(`Failed to click ${selector} after ${retries} attempts`)
  return false
}

/**
 * Fills a form field with text
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} selector - CSS selector
 * @param {string} text - Text to enter
 * @returns {Promise<boolean>} - Success status
 */
export async function fillField(driver, selector, text) {
  try {
    const field = await waitForElement(driver, selector)
    await field.clear()
    await field.sendKeys(text)
    return true
  } catch (error) {
    console.error(`Failed to fill field ${selector}: ${error.message}`)
    return false
  }
}

/**
 * Takes a screenshot and saves it to a file
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} filename - File name to save the screenshot
 */
export async function takeScreenshot(driver, filename) {
  try {
    await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync(filename, image, "base64")
    })
    console.log(`Screenshot saved as ${filename}`)
  } catch (error) {
    console.error(`Failed to take screenshot: ${error.message}`)
  }
}

export async function loginShopify(driver, password) {
  try {
    await driver.get("https://dtn1-theme.myshopify.com/");
    console.log("Navigated to Shopify store");
    await driver.wait(until.elementLocated(By.css("form #password")), 5000)
    const sendpass = await driver.findElement(By.css("form #password"))
    sendpass.sendKeys(password, Key.RETURN)
    await driver.wait(until.elementLocated(By.css("body")), 5000)
  } catch (error) {
    console.error("Password field not found:", error.message)
    return
  }
}


export function randomDelay(min = 1500, max = 4000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}