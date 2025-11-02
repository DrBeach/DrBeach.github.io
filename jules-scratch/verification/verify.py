
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("file://" + os.path.abspath("index.html"))

        # Manually set current_gen to 101 to test the logic
        await page.evaluate("current_gen = 101")

        # Wait for a game tick
        await page.wait_for_timeout(300)

        # Now the button should be visible
        await page.wait_for_selector("#transmission_button", state="visible")

        # Check that the transmission tab is visible and has the correct content
        await page.click("#transmission_button")

        await page.screenshot(path="jules-scratch/verification/screenshot.png")
        await browser.close()

asyncio.run(main())
