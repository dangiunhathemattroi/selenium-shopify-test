import { quantityInput } from "../quantity-input.js";
import { closeDrawer } from "../close-drawer.js";

export async function exceptionQuantityDecimalOrNegative(driver) {
    try {
        await quantityInput(driver, -1);
        await driver.sleep(3000);
        await closeDrawer(driver);
        await driver.sleep(3000);
        await quantityInput(driver, 1.3);
        await driver.sleep(3000);
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqualInventory function:", error);
        throw error;
    } finally {
        await driver.sleep(3000);
        console.log("Quantity = inventotry and added to cart");
    }
}