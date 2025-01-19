const puppeteer = require('puppeteer');

async function openChannel(page) {
    
        // Wait for the page to fully load
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds to let the page settle

        // Log the HTML content for debugging
        const pageContent = await page.content();
        console.log("Page Content Loaded:", pageContent);

        // Adjusted selector for the chat list
        const chatListSelector = 'div.search-group ul.chatlist';

        // Wait for the chat list to appear
        await page.waitForSelector(chatListSelector, { visible: true, timeout: 60000 });
        console.log("Chat list container found.");

        // Select the first chat in the list
        const firstChatSelector = `${chatListSelector} a.chatlist-chat`;
        
        // Wait for the first chat to be visible
        await page.waitForSelector(firstChatSelector, { visible: true, timeout: 20000 });
        console.log("First chat in the list located.");

        // Click the first chat
        await page.click(firstChatSelector);
        console.log("First chat clicked.");
        
       
    
}

module.exports = openChannel;
