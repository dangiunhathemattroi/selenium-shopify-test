import { quantityInput } from "../quantity-input.js";
import { addToCart } from "../add-to-cart.js";

export async function exceptionQuantityAddSpace(driver) {
    try {
        await driver.sleep(3000);
        await quantityInput(driver, ' ');
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