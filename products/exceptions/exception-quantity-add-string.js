import { quantityInput } from "../quantity-input.js";
import { addToCart } from "../add-to-cart.js";

export async function exceptionQuantityAddString(driver) {
    try {
        await driver.sleep(3000);
        await quantityInput(driver, 'a');
        await driver.sleep(3000);
        await addToCart(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqualInventory function:", error);
        throw error;
    } finally {
        await driver.sleep(3000);
        console.log("Quantity = inventotry and added to cart");
    }
}