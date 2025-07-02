import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { loginShopify } from "../../../utils/helpers.js";
import { viewProduct } from "../../products/view-product.js";
import { buyItNow } from "../../products/buy-it-now.js";
import { redirectCheckoutForBuyItNow } from "../redirectToCheckoutPage.js";
import { login } from "../../accounts/login.js";
import { exceptionQuantityBy0 } from "./exceptions/quantity-by-0.js";
import { exceptionQuantityByInventory } from "./exceptions/quantity-by-inventory.js";
import { exceptionQuantityGteInventory } from "./exceptions/quantity-gte-inventory.js";
import { exceptionQuantityDecimalOrNegative } from "./exceptions/quantity-decimal-or-negative.js";
import { exceptionQuantityAddSpace } from "./exceptions/quantity-add-space.js";

async function runShopifyTest() {
    const options = new chrome.Options();
    options.addArguments(
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars"
    );
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Truy cập vào trang Shopify
        await loginShopify(driver, "Bss123@#");
        console.log("Test case 1: Orders succesfully");
        await login(driver, "ngakn64@gmail.com", "Bss123@#");
        await viewProduct(driver);
        await buyItNow(driver);
        await redirectCheckoutForBuyItNow(driver);
        await driver.get("https://dtn1-theme.myshopify.com");

        console.log("Test case 2: Orders quantity by 0");
        await exceptionQuantityBy0(driver);

        console.log("Test case 3: Orders quantity by inventory");
        await exceptionQuantityByInventory(driver);

        console.log("Test case 4: Orders quantity gte inventory");
        await exceptionQuantityGteInventory(driver);

        console.log("Test case 5: Orders quantity dicimal or negative");
        await exceptionQuantityDecimalOrNegative(driver);

        console.log("Test case 6: Orders quantity add space");
        await exceptionQuantityAddSpace(driver);
    } catch (err) {
        console.log(err);
    } finally {
        await driver.quit();
        console.log("Test finished!");
    }
}

// Run the test
runShopifyTest();