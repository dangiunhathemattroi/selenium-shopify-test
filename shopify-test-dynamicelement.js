import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

async function runShopifyTest() {
  // Set up Chrome options
  const options = new chrome.Options();
  options.addArguments('--start-maximized'); // Mở toàn màn hình (tuỳ chọn)

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.get("https://dtn1-theme.myshopify.com/");
    console.log("✅ Navigated to Shopify store");
    const sendpass = await driver.findElement(By.css("form #password"));
    await sendpass.sendKeys("Bss123@#", Key.RETURN);
    await driver.wait(until.elementLocated(By.css("body")), 10000);
    console.log("✅ Logged in and page loaded");

    // Hover lần 1
    const menuElement = await driver.findElement(By.id("Details-HeaderMenu-2"));
    await driver.actions({ bridge: true }).move({ origin: menuElement }).perform();
    console.log("✅ Hovered over main menu");
    await driver.sleep(1000); 

    // Hover tiếp vào submenu (washing machine)
    const submenu = await driver.findElement(By.id("HeaderMenu-washing-machine-2"));
    await driver.actions({ bridge: true }).move({ origin: submenu }).perform();
    console.log("✅ Hovered over submenu");

    await driver.sleep(1000); 
    const panasonicLink = await driver.findElement(
      By.css(".menu_tab_item.menu-active .dynamic-menu_list a.menu_item_link[href*='panasonic']")
    );
    await panasonicLink.click();
    console.log("✅ Clicked Panasonic link");
    // check URL hiện tại
    const currentUrl = await driver.getCurrentUrl();
    console.log(" Current URL: " + currentUrl);
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    //await driver.quit();
    console.log("🚪 Browser closed.");
  }
}

runShopifyTest();
