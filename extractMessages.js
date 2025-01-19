// extractMessages.js
const fs = require('fs');
const path = require('path');

async function extractMessages(page) {
    const messages = [];
    let previousHeight;
    let messageCount = 0;
    let previousDate = '';  // To track the previous message's date

    try {
        // Scroll to load the messages
        while (messageCount < 50) {
            previousHeight = await page.evaluate('document.body.scrollHeight');

            // Extract the messages visible on the page
            const newMessages = await page.evaluate(() => {
                const messageElements = document.querySelectorAll('.bubble.is-in.can-have-tail.no-forwards .message.spoilers-container');
                return Array.from(messageElements).map(msg => {
                    const messageText = msg.innerText.trim();
                    const links = Array.from(msg.querySelectorAll('a')).map(anchor => anchor.href).join('\n');
                    const timeElement = msg.querySelector('.time-inner');
                    const messageDate = timeElement ? timeElement.getAttribute('title') : '';

                    return { messageText, links, messageDate };
                });
            });

            // Add new messages to the array
            messages.push(...newMessages);
            messageCount = messages.length;

            // Scroll up to load more messages
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight - 1000)');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for new messages to load
        }

        // Trim the array to the last 50 messages
        const last50Messages = messages.slice(-50);

        // Save the messages to a text file with proper formatting
        const filePath = path.resolve('./extracted_messages.txt');
        let formattedMessages = '';
        let lastMessageDate = ''; // To track the last added date

        last50Messages.forEach((msg, index) => {
            const { messageText, links, messageDate } = msg;

            // Check if the date has changed
            if (messageDate !== lastMessageDate) {
                // Add the new date as a heading
                formattedMessages += `\n\n${messageDate}\n----------------------------\n`;
                lastMessageDate = messageDate;  // Update the last message date
            }

            // Add the message and links
            formattedMessages += `${index + 1}. ${messageText}\nLinks:\n${links}\n\n`;
        });

        fs.writeFileSync(filePath, formattedMessages, 'utf-8');
        console.log(`Last 50 messages saved to ${filePath}`);

    } catch (error) {
        console.error("Error occurred during message extraction:", error);
    }
}

module.exports = { extractMessages };
