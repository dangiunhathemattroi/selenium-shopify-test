import { By } from "selenium-webdriver";
import { closeDrawer } from "./close-drawer.js";

export async function addToCart(driver) {
    try {
        await driver.sleep(2000);
        const addToCartButton = await driver.findElement(By.css('button[name="add"], .product-form__submit.button.button--full-width'))
        await addToCartButton.click()
        await driver.sleep(2000);
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in addToCart function:", error);
        throw error;
    } finally {
        console.log("Product added to cart and drawer closed");
        await driver.sleep(2000); // Ensure the drawer is closed before proceeding
    }
}