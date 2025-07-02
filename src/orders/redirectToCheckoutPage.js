import { By, Key } from "selenium-webdriver";

export async function redirectCheckoutForBuyItNow(driver) {
    try {
        await driver.sleep(2000);
        const loginElements = await driver.findElements(By.css(".content-for-layout .login"));
        if (loginElements.length) {
            console.log("login page loaded")
            const sendemail = await driver.findElement(By.css("form input[name='customer[email]']"));
            sendemail.sendKeys("ngakn64@gmail.com")

            const sendpw = await driver.findElement(By.css("form input[name='customer[password]']"));
            sendpw.sendKeys("Bss123@#", Key.RETURN)
        }
        await driver.sleep(2000);
        const pageElements = await driver.findElements(By.css(".content-for-layout"));
        if (pageElements.length) {
            await driver.get("https://dtn1-theme.myshopify.com/checkout");
        }
        console.log("checkout page loaded");
        await driver.sleep(5000);
    } catch (error) {
        console.error("Error in Checkout function:", error);
    }
}
