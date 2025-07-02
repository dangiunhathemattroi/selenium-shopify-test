import { quantityInput } from "../quantity-input.js";
import { closeDrawer } from "../close-drawer.js";

export async function exceptionQuantityEqual0(driver) {
    try {
        await driver.sleep(3000);
        await quantityInput(driver, 0);
        await driver.sleep(3000);
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqual0 function:", error);
        throw error;
    } finally {
        console.log("Quantity set to 0 and added to cart");
        await driver.sleep(3000);
    }
}