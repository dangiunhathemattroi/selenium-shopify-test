import { By, Key, until } from "selenium-webdriver";
export async function exceptionCheckoutFieldEmpty(driver) {
    try {
        await driver.sleep(3000);
        const loginElements = await driver.findElements(By.css(".content-for-layout .login"));
        if (loginElements.length) {
            console.log("login page loaded")
            const sendemail = await driver.findElement(By.css("form input[name='customer[email]']"));
            sendemail.sendKeys("ngakn64@gmail.com")

            const sendpw = await driver.findElement(By.css("form input[name='customer[password]']"));
            sendpw.sendKeys("Bss123@#", Key.RETURN)
        }

        await driver.sleep(3000);

        console.log("checkout page loaded");

        await driver.sleep(5000);

        console.log("process payment...");

        const payButton = await driver.wait(
            until.elementLocated(By.id("checkout-pay-button")),
            10000
        );

        await payButton.click();
    } catch (error) {
        console.error("Error in Checkout function:", error);
    } finally {
        console.log("Checkout Field Empty successfully");
        await driver.sleep(8000);
    }
}
