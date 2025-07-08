import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

async function runShopifyTest() {
  const options = new chrome.Options();

  // Initialize the WebDriver
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    console.log("Starting Shopify test...");
    console.log("TC1: check tìm kiếm dữ liệu tồn tại trong DB...")

    // Truy cập vào trang Shopify
    await driver.get("https://dtn1-theme.myshopify.com/");
    console.log("Navigated to Shopify store");

    const sendpass = await driver.findElement(By.css("form #password"))
    await sendpass.sendKeys("Bss123@#", Key.RETURN)

    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.css("body")), 10000)

    console.log("Starting search ...");

    const searchIcon = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon.click();

    const searchField = await driver.findElement(By.css("input[name='q']"));
    await searchField.sendKeys("sony", Key.RETURN);
    await driver.sleep(5000);

    console.log("Done execute TC1!")


    console.log("TC2: check tìm kiếm dữ liệu không tồn tại trong DB...")
    await driver.get("https://dtn1-theme.myshopify.com/");
    console.log("Navigated to Shopify store");

    console.log("Starting search ...");
    const searchIcon2 = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon2.click();
    const searchField2 = await driver.findElement(By.css("input[name='q']"));
    await searchField2.sendKeys("sssssssssssssssssssssssssssss", Key.RETURN);
    await driver.sleep(5000);
    console.log("Done execute TC2!")


    console.log("TC3: check tìm kiếm rỗng...")
    const searchIcon3 = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon3.click();
    const searchField3 = await driver.findElement(By.css("input[name='q']"));
    await searchField3.sendKeys("   ")
    await driver.sleep(3000)
    await searchField3.sendKeys(Key.RETURN);
    await driver.sleep(5000);
    console.log("Done execute TC3!")


    console.log("TC4: check tìm không phân biệt hoa thường...")
    console.log("Starting search ...");
    const searchIcon4 = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon4.click();
    const searchField4 = await driver.findElement(By.css("input[name='q']"));
    await searchField4.sendKeys("SONY", Key.RETURN);
    await driver.sleep(5000);
    console.log("Done execute TC4!")


    console.log("TC5: check tìm có khoảng trắng đầu cuối...")
    console.log("Starting search ...");
    const searchIcon5 = await driver.findElement(By.css('details-modal.header__search svg.icon-search, summary.header__icon svg.icon-search'));
    await searchIcon5.click();
    const searchField5 = await driver.findElement(By.css("input[name='q']"));
    await searchField5.sendKeys("   Sony   ", Key.RETURN);
    await driver.sleep(5000)
    console.log("Done execute TC5!")
    console.log("Search initiated!");

  } catch (error) {
    console.error("Test failed:", error);

  } finally {
    await driver.quit();
    console.log("Test finished, browser closed");
  }

}
runShopifyTest()
