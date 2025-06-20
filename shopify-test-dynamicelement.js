import { Builder, By, Key, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import { CartDrawerHandler } from "./cart-drawer-handler.js"
import { waitForElement, safeClick, fillField, takeScreenshot } from "./utils/helpers.js"


async function runShopifyTest() {
  // Set up Chrome options
  const options = new chrome.Options()

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build()

  await driver.get("https://dtn1-theme.myshopify.com/");
  console.log("Navigated to Shopify store");

   const sendpass = await driver.findElement(By.css("form #password"))
  sendpass.sendKeys("Bss123@#", Key.RETURN)

  // Wait for the page to load completely
  await driver.wait(until.elementLocated(By.css("body")), 10000)

   console.log("Starting check dynamic element ...");

   const element = await driver.findElement(By.id('Details-HeaderMenu-1'));

   // Hover 
   await driver.actions({ bridge: true }).move({ origin: element }).perform();


}
  runShopifyTest()