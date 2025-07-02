import { By, until, Key } from "selenium-webdriver";
import { login } from "../accounts/login.js";

export async function checkout(driver) {
    try {
        await driver.sleep(3000);
        const loginElements = await driver.findElements(By.css(".content-for-layout .login"));
        if (loginElements.length) {
            console.log("login page loaded")
            console.log("login page loaded")
            const sendemail = await driver.findElement(By.css("form input[name='customer[email]']"));
            sendemail.sendKeys("ngakn64@gmail.com")

            const sendpw = await driver.findElement(By.css("form input[name='customer[password]']"));
            sendpw.sendKeys("Bss123@#", Key.RETURN)
        }

        await driver.sleep(3000);

        const pageElements = await driver.findElements(By.css(".content-for-layout"));

        if (pageElements.length) {
            await driver.get("https://dtn1-theme.myshopify.com/checkout");
        }

        console.log("checkout page loaded");

        await driver.sleep(10000);

        const firstNameEls = await driver.findElements(By.id("TextField0"));
        if (firstNameEls.length) {
            await firstNameEls[0].sendKeys("Test");
        }

        const lastNameEls = await driver.findElements(By.id("TextField1"));
        if (lastNameEls.length) {
            await lastNameEls[0].sendKeys("User");
        }

        const addressEls = await driver.findElements(By.id("TextField2"));
        if (addressEls.length) {
            await addressEls[0].sendKeys("123 Test Street");
        }

        const cityEls = await driver.findElements(By.id("TextField4"));
        if (cityEls.length) {
            await cityEls[0].sendKeys("Test City", Key.RETURN);
        }

        await driver.sleep(5000);

        console.log("process payment...");

        const numberFrame = await driver.wait(
            until.elementLocated(By.css('iframe[id^="card-fields-number"]')),
            10000
        );
        await driver.switchTo().frame(numberFrame);
        await driver.findElement(By.name("number")).sendKeys("1");
        await driver.sleep(2000);
        await driver.switchTo().defaultContent();

        // Expiry date
        const expiryFrame = await driver.wait(
            until.elementLocated(By.css('iframe[id^="card-fields-expiry"]')),
            10000
        );
        await driver.switchTo().frame(expiryFrame);
        await driver.findElement(By.name("expiry")).sendKeys("12");
        await driver.sleep(2000);
        await driver.switchTo().defaultContent();

        await driver.sleep(2000);

        await driver.switchTo().frame(expiryFrame);
        await driver.findElement(By.name("expiry")).sendKeys("30");
        await driver.sleep(2000);
        await driver.switchTo().defaultContent();

        // CVV
        const cvvFrame = await driver.wait(
            until.elementLocated(
                By.css('iframe[id^="card-fields-verification_value"]')
            ),
            10000
        );
        await driver.switchTo().frame(cvvFrame);
        await driver.findElement(By.name("verification_value")).sendKeys("123");
        await driver.sleep(2000);
        await driver.switchTo().defaultContent();

        const payButton = await driver.wait(
            until.elementLocated(By.id("checkout-pay-button")),
            10000
        );
        await payButton.click();
        await driver.sleep(5000);
    } catch (error) {
        console.error("Error in Checkout function:", error);
    } finally {
        console.log("Checkout successfully");
        await driver.sleep(2000);
    }
}
