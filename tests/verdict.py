# Answers every question correctly through the real UI and fails if any
# shows anything but a green verdict. Also checks the second-try and
# half-right messages. Needs a server on :8765 serving site/.
import asyncio, json, sys
from playwright.async_api import async_playwright
BASE = "http://localhost:8765/index.html"

async def answer(page, q):
    t = q["type"]
    async def click_text(attr, text):
        for b in await page.query_selector_all(f"[data-{attr}]"):
            if (await b.inner_text()).split("\n")[-1].strip() == text:
                await b.click(); return
        raise Exception(f"option not found: {text}")
    if t == "mc":
        await click_text("o", q["correct"]); await page.click('[data-sure="1"]')
    elif t in ("tier", "odd"):
        await click_text("a", q["correct"] if t == "tier" else q["oddOne"])
        await click_text("b", q["bcorrect"]); await page.click('[data-sure="1"]')
    elif t == "order":
        await page.click("#check")            # first try, deliberately unsorted
        await page.click("#retry")
        steps = q["steps"]
        for k in range(len(steps)):
            cur = [ (await li.inner_text()).split("\n")[1].strip() for li in await page.query_selector_all("#ol li") ]
            if cur[k] != steps[k]:
                j = cur.index(steps[k])
                await page.click(f'#ol li[data-k="{k}"]'); await page.click(f'#ol li[data-k="{j}"]')
        await page.click("#check")
    elif t == "match":
        used = set()
        for k, (l, r) in enumerate(q["pairs"]):
            await page.click(f'[data-l="{k}"]')
            for b in await page.query_selector_all("[data-r]"):
                j = await b.get_attribute("data-r")
                if j in used: continue
                if (await b.inner_text()).strip().endswith(r):
                    used.add(j); await b.click(); break
        await page.click("#check")
    elif t == "build":
        for w in q["target"]:
            for b in await page.query_selector_all("[data-t]"):
                if (await b.inner_text()).strip() == w: await b.click(); break
        await page.click("#check")
    elif t == "typed":
        await page.fill("#ans", q["accept"][0]); await page.click("#check")
    elif t == "recall":
        await page.click("#show"); await page.click("#all")

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        page = await (await b.new_context(viewport={"width": 390, "height": 844})).new_page()
        errs = []; page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto(BASE); await page.wait_for_selector(".menu")
        qs = json.loads(await page.evaluate('import("./data.js").then(m => JSON.stringify(m.QUESTIONS))'))
        bad = []
        for q in qs:
            await page.goto(f"{BASE}#q={q['id']}"); await page.reload()
            await page.wait_for_selector("h2.q")
            try:
                await answer(page, q)
                v = (await page.inner_text(".verdict")).strip()
                want = "✓ Right on the second try" if q["type"] == "order" else "✓ Right!"
                if v != want: bad.append((q["id"], q["type"], v))
            except Exception as e:
                bad.append((q["id"], q["type"], "ERROR " + str(e)[:80]))
        # Half right: right answer, wrong reason.
        tq = next(q for q in qs if q["type"] == "tier")
        await page.goto(f"{BASE}#q={tq['id']}"); await page.reload(); await page.wait_for_selector("h2.q")
        for bt in await page.query_selector_all("[data-a]"):
            if (await bt.inner_text()).split("\n")[-1].strip() == tq["correct"]: await bt.click(); break
        for bt in await page.query_selector_all("[data-b]"):
            if (await bt.inner_text()).split("\n")[-1].strip() != tq["bcorrect"]: await bt.click(); break
        await page.click('[data-sure="1"]')
        half = (await page.inner_text(".verdict")).strip()
        print(f"checked {len(qs)} questions; bad: {len(bad)}; half-right verdict: {half!r}; page errors: {len(errs)}")
        for x in bad[:20]: print("  ", x)
        await b.close()
        sys.exit(1 if bad or errs or half != "Half right." else 0)
asyncio.run(main())
