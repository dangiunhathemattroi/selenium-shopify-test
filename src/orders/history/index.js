import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { loginShopify } from "../../../utils/helpers.js";
import { login } from "../../accounts/login.js";

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
        await driver.sleep(2000);
        const orderTab = await driver.findElement(By.id("order-history-tab"));
        orderTab.click();
        driver.sleep(2000);
        const orderDetail = await driver.findElement(By.css("a.order-detail-button"))
        orderDetail.click();
        driver.sleep(2000);
    } catch (err) {
        console.log(err);
    } finally {
        await driver.quit();
        console.log("Test finished!");
    }
}

// Run the test
runShopifyTest();