// openTelegram.js
const puppeteer = require('puppeteer');
const path = require('path');
const openChannel = require('./openChannel'); // Import the function from openChannel.js
const { extractMessages } = require('./extractMessages'); // Import the extractMessages function

async function openTelegramAndSearch() {
    const userDataDir = path.resolve('./telegram-session');

    const browser = await puppeteer.launch({
        headless: false, // Set to true if you want the browser to run in the background
        args: ['--start-maximized'],
        userDataDir,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // Go to Telegram Web
        await page.goto('https://web.telegram.org/', { waitUntil: 'networkidle2' });

        // Log the current HTML structure for debugging
        console.log("Page loaded. Dumping the body content...");
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        console.log(bodyHTML);

        // Wait for the correct search input field to appear
        await page.waitForSelector('input.input-field-input.input-search-input', { timeout: 60000 });
        console.log("Search bar located.");

        // Type the channel name into the search bar
        await page.type('input.input-field-input.input-search-input', 'SDE Premium Referrals', { delay: 100 });
        await page.keyboard.press('Enter');

        // Wait for the channel to appear in the search results
        await page.waitForSelector('ul.chatlist a.chatlist-chat[data-peer-id="-2163383819"]', { timeout: 10000 });
        console.log("Channel found.");

        // Open the channel using the openChannel function
        await openChannel(page); // This will select and open the channel

        // Call extractMessages and pass the page object
        await extractMessages(page); // Pass the page object to extractMessages

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

openTelegramAndSearch();
