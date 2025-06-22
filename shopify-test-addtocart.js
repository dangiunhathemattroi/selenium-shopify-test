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

    //add to cart 
    const addToCartButton = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton.click()

    await driver.sleep(2000)
    const close = await driver.findElement(By.css('.drawer__close'))
    await close.click();

    await driver.sleep(5000)
     //see product khác từ PDP
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", await driver.findElement(By.css('suggestion-viewed-products.suggestions-viewed-products')));
    await driver.sleep(5000);
    const product3 = await driver.findElement(By.css('.card-wrapper.product-card-wrapper'));
    product3.click();
    console.log("PDP loaded!");

    // Test Case 2: Add to cart
    console.log("Test Case 2: Adding product to cart")
    // Add to cart
    await driver.sleep(1000)

    //add to cart 
    const addToCartButton1 = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
    await addToCartButton1.click()

    // Wait for the cart to update
    await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 10000)
    
    console.log("Product added to cart")
    console.log('TC3: Set quantity =0')
    const quantityInput = await driver.findElement(By.id("Drawer-quantity-1"));
    console.log(quantityInput);
    await quantityInput.clear();
    await quantityInput.sendKeys("0", Key.RETURN);

    console.log('TC4: Set quantity= ton kho')
    console.log('TC5: Set quantity= ton kho+1')

    console.log('TC6:Nhap ki tu')
    console.log('TC7:Nhap space')

  } catch (err) {
        console.log(err);
    } finally {
    //await driver.quit();
     console.log("Test finished!");
  }
}

// Run the test
runShopifyTest();
