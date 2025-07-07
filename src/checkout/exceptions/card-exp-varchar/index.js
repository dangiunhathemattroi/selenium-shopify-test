import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { loginShopify } from "../../../../utils/helpers.js";
import { viewProduct } from "../../../products/view-product.js";
import { buyItNow } from "../../../products/buy-it-now.js";
import { exceptionCheckoutCardExpVarchar } from "./card-exp-varchar.js";

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
        console.log("Test case 1: Checkout successfully")
        await viewProduct(driver);
        await buyItNow(driver);
        await exceptionCheckoutCardExpVarchar(driver);
    } catch (err) {
        console.log(err);
    } finally {
        await driver.quit();
        console.log("Test finished!");
    }
}

// Run the test
runShopifyTest();