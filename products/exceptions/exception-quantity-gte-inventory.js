import { quantityInput } from "../quantity-input.js";
import { closeDrawer } from "../close-drawer.js";

export async function exceptionQuantityGteInventory(driver) {
    try {
        await driver.sleep(3000);
        await quantityInput(driver, "9999");
        await driver.sleep(3000);
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityGteInventory function:", error);
        throw error;
    } finally {
        console.log("Quantity set gte Inventory and added to cart");
        await driver.sleep(3000);
    }
}