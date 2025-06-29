import { By, until, Key } from "selenium-webdriver";

export async function quantityInput(driver, quantity = 1) {
    try {
        await driver.sleep(2000);
        await driver.wait(until.elementLocated(By.css(".cart-notification, .cart-drawer, .cart-popup")), 5000)
        const quantityInput = await driver.findElement(By.css("quantity-input.quantity input.quantity__input, input[type='number'].quantity__input"));
        await quantityInput.clear();
        await quantityInput.sendKeys(quantity, Key.RETURN);
    } catch (error) {
        console.error("Error in quantityInput function:", error);
        throw error;
    } finally {
        await driver.sleep(2000);
        console.log("Quantity input updated");
    }
}