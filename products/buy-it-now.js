import { By } from "selenium-webdriver";

export async function buyItNow(driver) {
    try {
        await driver.sleep(2000);
        const buyItNowButton = await driver.findElement(By.css('shopify-buy-it-now-button button.shopify-payment-button__button'))
        await buyItNowButton.click()
    } catch (error) {
        console.error("Error in buyItNow function:", error);
        throw error;
    } finally {
        console.log("By it now succesfully");
        await driver.sleep(2000);
    }
}