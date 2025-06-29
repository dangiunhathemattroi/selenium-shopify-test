import { quantityInput } from "../quantity-input.js";
import { addToCart } from "../add-to-cart.js";

export async function exceptionQuantityEqual0(driver) {
    try {
        await quantityInput(driver, 0);
        await addToCart(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqual0 function:", error);
        throw error;
    } finally {
        console.log("Quantity set to 0 and added to cart");
    }
}