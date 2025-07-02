import { By, until } from "selenium-webdriver";

export async function closeDrawer(driver) {
    try {
        await driver.wait(until.elementLocated(By.css("cart-drawer.drawer.active")), 5000);
        const close = await driver.findElement(By.css('button.drawer__close .svg-wrapper svg'))
        await close.click();
    } catch (error) {
        console.error("Error in closeDrawer function:", error);
    }
}