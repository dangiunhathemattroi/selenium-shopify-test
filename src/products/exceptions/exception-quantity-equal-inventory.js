import { quantityInput } from "../quantity-input.js";
import { closeDrawer } from "../close-drawer.js";

export async function exceptionQuantityEqualInventory(driver) {
    try {
        await driver.sleep(3000);
        const quantityField = await driver.findElement({ css: '.product-form__input.product-form__quantity .quantity__input' });
        const cartQuantity = await quantityField.getAttribute('data-cart-quantity') ?? 0;
        const inventoryQuantity = await quantityField.getAttribute('data-inventory-quantity') ?? 0;
        await quantityInput(driver, inventoryQuantity - cartQuantity);
        await driver.sleep(3000);
        await closeDrawer(driver);
    } catch (error) {
        console.error("Error in exceptionQuantityEqualInventory function:", error);
        throw error;
    } finally {
        console.log("Quantity = inventotry and added to cart");
        await driver.sleep(3000);
    }
}