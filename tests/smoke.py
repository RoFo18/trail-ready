import asyncio, sys
from playwright.async_api import async_playwright
URL="http://localhost:8765/index.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
        page = await ctx.new_page()
        errs=[]
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: m.type=="error" and errs.append(m.text))
        await page.goto(URL); await page.wait_for_selector(".menu")
        await page.screenshot(path="/tmp/home.png", full_page=True)
        # play several rounds of each mode
        async def play_round(mode, shots=False):
            await page.click(f"[data-go={mode}]")
            for i in range(12):
                if await page.query_selector(".finish"): break
                if await page.query_selector("#gotit"): await page.click("#gotit"); continue
                if await page.query_selector("[data-a]"):
                    await page.click("[data-a='0']"); await page.click("[data-b='1']")
                elif await page.query_selector("[data-o]"):
                    await page.click("[data-o='2']")
                elif await page.query_selector("#ol"):
                    await page.click("#check")
                    if await page.query_selector("#retry"):
                        await page.click("#retry"); await page.click("#check")
                elif await page.query_selector("[data-l]"):
                    n = len(await page.query_selector_all("[data-l]"))
                    for k in range(n):
                        await page.click(f"[data-l='{k}']"); await page.click(f"[data-r='{k}']")
                    await page.click("#check")
                if await page.query_selector("#conf:not(.hidden)"):
                    if shots and i==0: await page.screenshot(path=f"/tmp/{mode}-q.png", full_page=True)
                    await page.click("[data-sure='1']")
                await page.wait_for_selector("#next")
                if shots and i==0: await page.screenshot(path=f"/tmp/{mode}-fb.png", full_page=True)
                await page.click("#next")
            await page.screenshot(path=f"/tmp/{mode}-end.png", full_page=True)
            if await page.query_selector("#toHome"): await page.click("#toHome")
            else: await page.click("[data-back]")
            await page.wait_for_selector(".menu")
        await play_round("quick", True)
        await play_round("order", True)
        await play_round("connect", True)
        await play_round("quick")
        # topic
        await page.click("[data-go=topics]"); await page.click("[data-t=aid]")
        await page.screenshot(path="/tmp/topic.png", full_page=True)
        await page.goto(URL); await page.wait_for_selector(".menu")
        # story
        await page.click("[data-go=story]"); await page.screenshot(path="/tmp/story.png", full_page=True)
        await page.goto(URL); await page.wait_for_selector(".menu")
        await page.click("[data-go=signoff]"); await page.screenshot(path="/tmp/signoff.png", full_page=True)
        await page.click("[data-r='2C-10']"); await page.screenshot(path="/tmp/spirit.png", full_page=True)
        await page.goto(URL); await page.wait_for_selector(".menu")
        await page.click("[data-go=signoff]"); await page.click("[data-r='2C-6a']"); await page.screenshot(path="/tmp/req.png", full_page=True)
        # offline check
        await page.goto(URL); await page.wait_for_timeout(2500)
        badge = await page.inner_text("#offline")
        await ctx.set_offline(True)
        await page.reload(); await page.wait_for_selector(".menu", timeout=5000)
        print("offline reload OK; badge:", badge)
        await page.screenshot(path="/tmp/home2.png", full_page=True)
        print("errors:", errs)
        await b.close()
asyncio.run(main())
