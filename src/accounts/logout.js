import { By } from "selenium-webdriver";

async function handleLogout(driver) {
    try {
        await driver.sleep(3000);
        const singoutButton = await driver.findElement(By.css('.account-container a.sign-out'));
        singoutButton.click();
    } catch (error) {
        console.error("Error in handle logout function:", error);
    } finally {
        await driver.sleep(3000);
        console.log("Logout successfully")
    }
}

export async function logout(driver) {
    try {
        await driver.sleep(3000);
        const loginElements = await driver.findElements(By.css(".content-for-layout main-account"));
        if (loginElements.length) {
            await handleLogout(driver);
        } else {
            await driver.get('https://dtn1-theme.myshopify.com/account');
            await handleLogout(driver);
        }
    } catch (error) {
        console.error("Error in login function:", error);
    }
}