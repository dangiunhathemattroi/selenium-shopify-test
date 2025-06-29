import { quantityInput } from "../quantity-input.js";
import { addToCart } from "../add-to-cart.js";

export async function exceptionQuantityEqualInventory(driver) {
    try {
        await quantityInput(driver, "1000");
        await driver.sleep(3000);
        await addToCart(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqualInventory function:", error);
        throw error;
    } finally {
        console.log("Quantity = inventotry and added to cart");
        await driver.sleep(3000);
    }
}