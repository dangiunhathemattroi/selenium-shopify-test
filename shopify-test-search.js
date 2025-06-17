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

     console.log("Starting search ...");

    const searchIcon = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon.click();

    // send key
    const searchField = await driver.findElement(By.css("input[name='q']"));
    await searchField.sendKeys("smartphone", Key.RETURN);



    //search ở search result page 
        // await driver.sleep(5000);
        // const closeButton = await driver.findElement(By.css('form.search input.search__input'));
        // await closeButton.click();
        // console.log('Closed the search modal or reset button');

    console.log("Search initiated!");

    
  } catch (error) {
    console.error("Test failed:", error);


    
  } finally {
    // await driver.quit();
    // console.log("Test finished, browser closed");
  }
}

// Run the test
runShopifyTest();
