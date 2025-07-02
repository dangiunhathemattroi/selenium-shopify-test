import { quantityInputForBuyItNow } from "../../../products/quantity-input.js";
import { buyItNow } from "../../../products/buy-it-now.js";
import { redirectCheckoutForBuyItNow } from "../../redirectToCheckoutPage.js";
import { viewProduct } from "../../../products/view-product.js";

export async function exceptionQuantityByInventory(driver) {
    try {
        await driver.sleep(2000);
        await viewProduct(driver);
        const quantityField = await driver.findElement({ css: '.product-form__input.product-form__quantity .quantity__input' });
        const cartQuantity = await quantityField.getAttribute('data-cart-quantity') ?? 0;
        const inventoryQuantity = await quantityField.getAttribute('data-inventory-quantity') ?? 0;
        await quantityInputForBuyItNow(driver, inventoryQuantity - cartQuantity);
        await buyItNow(driver);
        await redirectCheckoutForBuyItNow(driver);
        await driver.get("https://dtn1-theme.myshopify.com");
    } catch (error) {
        console.error("Error in exceptionQuantityByInventory function:", error);
        throw error;
    } finally {
        console.log("Quantity set by inventory and rediect to checkout page");
        await driver.sleep(2000);
    }
}