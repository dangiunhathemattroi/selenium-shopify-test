import { By, Key } from "selenium-webdriver";

async function handleLogin(driver, account, password) {
    try {
        const sendemail = await driver.findElement(By.css("form input[name='customer[email]']"));
        sendemail.sendKeys(account)

        const sendpw = await driver.findElement(By.css("form input[name='customer[password]']"));
        sendpw.sendKeys(password, Key.RETURN)
    } catch (error) {
        console.error("Error in handle login function:", error);
    }
}

export async function login(driver, account, password) {
    try {
        await driver.sleep(3000);
        const loginElements = await driver.findElements(By.css(".content-for-layout .login"));
        if (loginElements.length) {
            await driver.sleep(2000);
            handleLogin(driver, account, password);
        } else {
            await driver.sleep(2000);
            await driver.get('https://dtn1-theme.myshopify.com/account/login');
            await driver.sleep(2000);
            handleLogin(driver, account, password);
        }
    } catch (error) {
        console.error("Error in login function:", error);
    } finally {
        await driver.sleep(3000);
        console.log("Login succesfully");
    }
}

