import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { loginShopify } from "../utils/helpers.js";
import { viewProduct } from "./view-product.js";
import { addToCart } from "./add-to-cart.js";
import { exceptionQuantityEqual0 } from "./exceptions/exception-quantity-equal-0.js";

async function runShopifyTest() {
    const options = new chrome.Options();
    options.addArguments('--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Truy cập vào trang Shopify
        await driver.get("https://dtn1-theme.myshopify.com/");
        console.log("Navigated to Shopify store");

        await loginShopify(driver, "Bss123@#");
        // Test Case 1: Product details and following a product
        await viewProduct(driver);
        // //add to cart 
        await addToCart(driver);
        //see product khác từ PDP
        await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", await driver.findElement(By.css('suggestion-viewed-products.suggestions-viewed-products')));
        // Test Case 2: Add to cart
        console.log("Test Case 2: Adding product to cart")
        await viewProduct(driver);
        // Add to cart
        await addToCart(driver);
        // Wait for the cart to update
        await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 5000)
        console.log("Product added to cart")
        console.log('TC3: Set quantity =0')
        await exceptionQuantityEqual0(driver);
        console.log('TC4: Set quantity= ton kho')
        console.log('TC5: Set quantity= ton kho+1')

        console.log('TC6:Nhap ki tu')
        console.log('TC7:Nhap space')

    } catch (err) {
        console.log(err);
    } finally {
        await driver.quit();
        console.log("Test finished!");
    }
}

// Run the test
runShopifyTest();