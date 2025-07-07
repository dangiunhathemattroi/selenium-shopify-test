import { By } from "selenium-webdriver";

export async function history(driver) {
    try {
        await driver.sleep(2000);
        await driver.get('https://dtn1-theme.myshopify.com/account')
        console.log("Test case 1: History succesfully");
        const orderTab = await driver.findElement(By.id("order-history-tab"));
        orderTab.click();
        driver.sleep(3000);
    } catch (error) {
        console.error("Error in history function:", error);
    } finally {
        await driver.sleep(3000);
        console.log("Login succesfully");
    }
}

