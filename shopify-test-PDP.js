import { Builder, By, Key, until } from "selenium-webdriver";
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


    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.css("body")), 10000)

    // Test Case 1: Product details and following a product
    console.log("Test Case 1:  Viewing product details and following")

    // Click on a product
    const productLink = driver.findElement(By.css('.card-wrapper.product-card-wrapper'))
    await productLink.click()

    console.log("PDP loaded!");

    await driver.sleep(5000)
    //see product khác từ PDP
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", await driver.findElement(By.css('suggestion-viewed-products.suggestions-viewed-products')));
    await driver.sleep(5000);
    const product3 = await driver.findElement(By.css('.card-wrapper.product-card-wrapper'));
    product3.click();
    await driver.sleep(5000);
    console.log("PDP loaded!");
  } finally {
    await driver.quit();
    console.log("Test finished!");
  }
}

// Run the test
runShopifyTest();
