import { By, until, Key } from "selenium-webdriver";

export async function quantityInput(driver, quantity = 1) {
    try {
        await driver.sleep(3000);
        const quantityInput = await driver.findElement(
            By.css(
                "quantity-input.quantity input.quantity__input, input[type='number'].quantity__input"
            )
        );
        await driver.sleep(3000);
        await quantityInput.clear();
        await driver.sleep(3000);
        await quantityInput.sendKeys(String(quantity), Key.RETURN);
    } catch (error) {
        console.error("Error in quantityInput function:", error);
        throw error;
    } finally {
        await driver.sleep(2000);
        console.log("Quantity input updated");
    }
}