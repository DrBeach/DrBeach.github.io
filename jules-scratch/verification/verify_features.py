from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct the file path to the local HTML file
        file_path = "file://" + os.path.abspath("index.html")
        page.goto(file_path)

        # 1. Add credits to afford a manager
        page.get_by_role("button", name="Admin").click(force=True)
        page.get_by_role("button", name="+$500").click(force=True) # Now we have 1000

        # 2. Go to Management and buy a manager
        page.get_by_role("button", name="Management").click(force=True)
        buy_manager_button = page.get_by_role("button", name="Hire Manager")
        expect(buy_manager_button).to_be_visible()
        buy_manager_button.click(force=True)

        # 3. Click the "Negotiate Price" button
        negotiate_button = page.get_by_role("button", name="Negotiate Power Price")
        expect(negotiate_button).to_be_visible()
        expect(negotiate_button).to_be_enabled()
        negotiate_button.click(force=True)

        # 4. Click the "Dashboard" button to view the graphs
        page.get_by_role("button", name="Dashboard").click(force=True)

        # Give a moment for the chart to render and price to update
        page.wait_for_timeout(500)

        # 5. Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()
