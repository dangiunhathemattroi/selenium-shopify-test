import { quantityInput } from "../quantity-input.js";
import { closeDrawer } from "../close-drawer.js";

export async function exceptionQuantityAddSpace(driver) {
    try {
        await driver.sleep(3000);
        await quantityInput(driver, ' ');
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