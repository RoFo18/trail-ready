import asyncio
from playwright.async_api import async_playwright
URL="http://localhost:8765/index.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
        # The container can't reach Wikimedia; stand in a plain image so photo slots still render.
        import base64
        png=base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=")
        await ctx.route("**/*wikimedia.org/**", lambda r: r.fulfill(status=200, content_type="image/png", body=png))
        page = await ctx.new_page(); errs=[]
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: m.type=="error" and errs.append(m.text))
        await page.goto(URL); await page.wait_for_selector(".row")
        await page.screenshot(path="/tmp/sc-home.png", full_page=True)
        keys = await page.eval_on_selector_all(".row", "els => els.map(e => e.dataset.k)")
        # open every requirement
        for k in keys:
            await page.click(f"[data-k={k}]"); await page.wait_for_selector(".title")
            for im in await page.query_selector_all(".card img"): await im.scroll_into_view_if_needed()
            await page.wait_for_timeout(150)
            broken = await page.eval_on_selector_all(".card img", "els => els.filter(i => !(i.complete && i.naturalWidth)).map(i => i.src)")
            if broken: errs.append(f"{k} broken images {broken}")
            if k in ("knots", "hurry", "firstaid"): await page.screenshot(path=f"/tmp/sc-learn-{k}.png", full_page=True)
            await page.click(".back"); await page.wait_for_selector(".row")
        # full test on first aid, with screenshots of each question type
        shots = set()
        for k in ["firstaid", "buildfire", "lnt", "knots"]:
            await page.click(f"[data-k={k}]"); await page.wait_for_selector(".title")
            if k=="firstaid": await page.screenshot(path="/tmp/sc-req.png", full_page=True)
            await page.click("#test")
            for i in range(80):
                if await page.query_selector("#backreq"): break
                if await page.query_selector("[data-o]"):
                    t="mc"
                    qt = await page.inner_text("h2.q")
                    if k=="lnt" and "seven" in qt and "lntq" not in shots: await page.screenshot(path="/tmp/sc-lnt-q.png", full_page=True); shots.add("lntq")
                    await page.click("[data-o='1']")
                elif await page.query_selector("[data-s]"):
                    t="order"
                    if "order" not in shots: await page.screenshot(path="/tmp/sc-order-before.png", full_page=True)
                    while await page.query_selector("[data-s]"):
                        await page.click("[data-s]")
                elif await page.query_selector("[data-l]"):
                    t="match"
                    n = len(await page.query_selector_all("[data-l]"))
                    for j in range(n):
                        await page.click(f"[data-l='{j}']"); await page.click(f"[data-r='{j}']")
                await page.wait_for_selector("#next")
                if t not in shots: await page.screenshot(path=f"/tmp/sc-{t}.png", full_page=True); shots.add(t)
                await page.click("#next")
            await page.screenshot(path=f"/tmp/sc-end-{k}.png", full_page=True)
            await page.click("#backreq"); await page.wait_for_selector("#done")
            await page.check("#done"); await page.click(".back"); await page.wait_for_selector(".row")
        txt = await page.inner_text("main")
        print("done marks:", txt.count("Done"))
        # reload keeps state; second test has fewer questions
        await page.reload(); await page.wait_for_selector(".row")
        await page.click("[data-k=firstaid]"); await page.wait_for_selector(".title")
        print("firstaid button:", await page.inner_text("#test") if await page.query_selector("#test") else "none")
        print("errors:", errs)
        await b.close()
asyncio.run(main())
