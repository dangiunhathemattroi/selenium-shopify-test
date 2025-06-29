import { By, until } from "selenium-webdriver";
import { closeDrawer } from "./close-drawer.js";

export async function addToCart(driver) {
    try {
        await driver.wait(until.elementLocated(By.css('button[name="add"], .add-to-cart')), 5000)
        const addToCartButton = await driver.findElement(By.css('button[name="add"], .add-to-cart'))
        await addToCartButton.click()
        await driver.sleep(2000); // Wait for the cart drawer to open
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in addToCart function:", error);
        throw error;
    } finally {
        console.log("Product added to cart and drawer closed");
        await driver.sleep(2000); // Ensure the drawer is closed before proceeding
    }
}