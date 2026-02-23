import puppeteer from 'puppeteer';

(async () => {
    console.log("Starting Chrome...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
        console.log("Logging in...");
        await page.goto('http://localhost:3000/login');
        await page.type('input[type="email"]', 'admin@ejemplo.com');
        await page.type('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log("Capturing Dashboard...");
        await page.goto('http://localhost:3000/wp-admin');
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'public/dashboard.png' });

        console.log("Capturing Editor...");
        await page.goto('http://localhost:3000/wp-admin/posts/new');
        await new Promise(r => setTimeout(r, 5000));
        await page.screenshot({ path: 'public/editor.png' });

        console.log("Capturing Settings...");
        await page.goto('http://localhost:3000/wp-admin/settings/general');
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'public/settings.png' });

        console.log("Capturing Frontend...");
        await page.goto('http://localhost:3000/');
        await new Promise(r => setTimeout(r, 3000));
        await page.screenshot({ path: 'public/frontend.png' });

        console.log("Done capturing screenshots.");
    } catch (err) {
        console.error("Error during screenshot capture:", err);
    }

    await browser.close();
})();
