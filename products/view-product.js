import { By, until } from "selenium-webdriver";

export async function viewProduct(driver) {
    try {
        await driver.sleep(2000); // Wait for the page to load
        await driver.wait(until.elementLocated(By.css(".card-wrapper.product-card-wrapper")), 5000)
        const productEls = await driver.findElements(By.css('.card-wrapper.product-card-wrapper'))
        await productEls[0].click();
    } catch (error) {
        console.error("Error in viewProduct function:", error);
        throw error;
    } finally {
        // Ensure the product page is loaded
        await driver.wait(until.elementLocated(By.css(".content-for-layout, product-info")), 5000);
        await driver.sleep(2000);
        console.log("Product page loaded");
    }
}