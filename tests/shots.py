import asyncio
from playwright.async_api import async_playwright
URL="http://localhost:8765/index.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
        page = await ctx.new_page()
        await page.goto(URL); await page.wait_for_selector(".menu")
        await page.click("[data-go=order]"); await page.wait_for_selector("#ol")
        await page.screenshot(path="/tmp/order-q.png", full_page=True)
        await page.click("#check"); await page.screenshot(path="/tmp/order-fb.png", full_page=True)
        await page.goto(URL); await page.wait_for_selector(".menu")
        for _ in range(8):
            await page.click("[data-go=connect]")
            if await page.query_selector("[data-l]"): break
            await page.goto(URL); await page.wait_for_selector(".menu")
        await page.click("[data-l='0']"); await page.click("[data-r='1']"); await page.click("[data-l='1']"); await page.click("[data-r='0']")
        await page.screenshot(path="/tmp/match.png", full_page=True)
        await b.close()
asyncio.run(main())
