import { quantityInputForBuyItNow } from "../../../products/quantity-input.js";
import { buyItNow } from "../../../products/buy-it-now.js";
import { redirectCheckoutForBuyItNow } from "../../redirectToCheckoutPage.js";
import { viewProduct } from "../../../products/view-product.js";

export async function exceptionQuantityDecimalOrNegative(driver) {
    try {
        await driver.sleep(2000);
        await viewProduct(driver);
        await quantityInputForBuyItNow(driver, -1);
        await buyItNow(driver);
        await redirectCheckoutForBuyItNow(driver);
        await driver.get("https://dtn1-theme.myshopify.com");
    } catch (error) {
        console.error("Error in exceptionQuantityDecimalOrNegative function:", error);
        throw error;
    } finally {
        console.log("Quantity set by negative and rediect to checkout page");
        await driver.sleep(2000);
    }
}