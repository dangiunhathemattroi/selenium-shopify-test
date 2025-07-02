import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { loginShopify } from "../../utils/helpers.js";
import { viewProduct } from "./view-product.js";
import { addToCart } from "./add-to-cart.js";
import { exceptionQuantityEqual0 } from "./exceptions/exception-quantity-equal-0.js";
import { exceptionQuantityEqualInventory } from "./exceptions/exception-quantity-equal-inventory.js";
import { exceptionQuantityGteInventory } from "./exceptions/exception-quantity-gte-inventory.js";
import { exceptionQuantityDecimalOrNegative } from "./exceptions/exception-quantity-decimal-or-negative.js";
import { exceptionQuantityAddString } from "./exceptions/exception-quantity-add-string.js";
import { exceptionQuantityAddSpace } from "./exceptions/exception-quantity-add-space.js";

async function runShopifyTest() {
    const options = new chrome.Options();
    options.addArguments(
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars"
    );
    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        await loginShopify(driver, "Bss123@#");
        // Test Case 1: Product details and following a product
        await viewProduct(driver);
        // //add to cart
        await addToCart(driver);
        //see product khác từ PDP
        await driver.executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});",
            await driver.findElement(
                By.css("suggestion-viewed-products.suggestions-viewed-products")
            )
        );
        // Test Case 2: Add to cart
        console.log("Test Case 2: Adding product to cart");
        await viewProduct(driver);
        // Add to cart
        await addToCart(driver);
        // Wait for the cart to update
        console.log("Product added to cart");
        console.log("TC3: Set quantity =0");
        await exceptionQuantityEqual0(driver);
        console.log("TC4: Set quantity= ton kho");
        await exceptionQuantityEqualInventory(driver);
        console.log("TC5: Set quantity= ton kho+1");
        await viewProduct(driver);
        await exceptionQuantityGteInventory(driver);
        console.log("TC6:Nhap so am/so thap phan");
        await viewProduct(driver);
        await exceptionQuantityDecimalOrNegative(driver);
        console.log("TC7:Nhap ki tu");
        await exceptionQuantityAddString(driver);
        console.log("TC8:Nhap space");
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
