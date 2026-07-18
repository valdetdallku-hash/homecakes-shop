# Homecakes Dekor — Dyqan Online

Dyqan i plotë për dekore tortash: katalog 56 produkte (mund t'i ndryshosh/shtosh vetë), personalizim teksti + ngjyre + foto, dhe pagesa reale me **Stripe**.

## Çka përfshihet
- Katalog produktesh (`data/products.json`) — redakto emrat, çmimet, ngjyrat pa prekur kod
- Faqe produkti me formular personalizimi
- Shportë (cart) me llogaritje totali
- Checkout real me Stripe (kartë krediti/debiti)
- Faqe konfirmimi dhe anulimi

## Hapi 1 — Instalo mjetet (vetëm një herë, në kompjuterin tënd)
1. Shkarko dhe instalo **Node.js** (version 18+): https://nodejs.org
2. Hap terminalin/CMD brenda folderit të projektit dhe run:
   ```
   npm install
   ```

## Hapi 2 — Konfiguro Stripe (5 minuta)
1. Krijo llogari falas në https://dashboard.stripe.com/register
2. Shko te **Developers > API keys**
3. Kopjo **Secret key** (fillon me `sk_test_...` për provë, ose `sk_live_...` për para reale)
4. Kopjo skedarin `.env.example` në një skedar të ri `.env.local`
5. Ngjit çelësin te `STRIPE_SECRET_KEY=`

**Këshillë:** Fillo me `sk_test_...` (test mode), bëj disa porosi provë me kartën `4242 4242 4242 4242` (çdo datë e ardhshme, çdo CVC), pastaj kalo në `sk_live_...` kur je gati për klientë realë.

## Hapi 3 — Provo lokalisht
```
npm run dev
```
Hap http://localhost:3000 në browser.

## Hapi 4 — Publiko online (falas, ~10 minuta)
Rekomandoj **Vercel** (krijuesit e Next.js, hosting falas për projekte si ky):

1. Krijo llogari falas në https://vercel.com (mund të lidhesh me GitHub)
2. Ngarko këtë projekt në një repository GitHub (ose përdor `vercel` CLI direkt nga folderi)
3. Në Vercel, "Import Project" → zgjidh repon
4. Te **Environment Variables**, shto të njëjtat variabla nga `.env.local` (STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL)
5. Kliko Deploy — brenda 2 minutash ke link live (p.sh. `homecakes-dekor.vercel.app`)
6. Domain-in tënd (p.sh. homecakes.com) mund ta lidhësh më vonë te Vercel Settings > Domains

## Hapi 5 (opsionale) — Foto reale nga klientët
Aktualisht, nëse s'konfigurohet Cloudinary, foto e ngarkuar nga klienti thjesht nuk dërgohet (porosia vazhdon pa problem, vetëm pa foto). Për me marr foto reale:
1. Krijo llogari falas në https://cloudinary.com
2. Settings → Upload → Add upload preset → vendos "Unsigned"
3. Shto `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` dhe `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` te `.env.local`

## Si i sheh porositë
Çdo porosi shfaqet te **Stripe Dashboard > Payments**. Klikon mbi pagesën dhe sheh detajet e personalizimit (ngjyrë, tekst, link foto) te seksioni "Metadata".

## Si shton produkte të reja (pa prekur kod — Google Sheets)

Punonjësi mund të shtojë produkte të reja vetëm duke shkruar në një Google Sheet, pa hapur kod fare.

**Konfigurimi (bëhet një herë nga ti):**
1. Krijo një Google Sheet të re me këto kolona (rreshti i parë, saktësisht këto emra):
   ```
   emri | kategoria | cmimi | ngjyrat | imazhi | perscrimi
   ```
   - `ngjyrat` — ndaj ngjyrat me `|` (p.sh. `Ari|Argjend|Rozë Gold`)
   - `imazhi` — link i drejtpërdrejtë foto (mund të ngarkosh foton në Google Drive/Imgur/Cloudinary dhe të ngjisësh linkun "direct")
   - `cmimi` — vetëm numër (p.sh. `12.50`)
2. File → Share → Publish to web → zgjidh sheet-in → format **Comma-separated values (.csv)** → Publish
3. Kopjo linkun që të jepet (do duket si `https://docs.google.com/spreadsheets/d/xxx/pub?output=csv`)
4. Ngjite atë link te `.env.local` dhe te Vercel Environment Variables, si `SHEET_CSV_URL=...`
5. Redeploy (ose thjesht prit — Vercel e rifreskon automatikisht çdo 5 minuta pa deploy të ri)

**Përdorimi ditor (punonjësi):**
Hap Google Sheet-in (link i thjeshtë, si Excel online), shton rresht të ri me produktin, ruan (automatik). Brenda **5 minutash** produkti i ri shfaqet vetë në dyqan — pa kod, pa deploy, pa më kontaktu ty.

**Rezervë (fallback):** Nëse `SHEET_CSV_URL` s'është konfiguruar ose Sheet-i s'është qasshëm, faqja përdor automatikisht listën lokale te `data/products.json`, kështu dyqani s'prishet kurrë.

## Si shton/ndryshon produkte (mënyra e vjetër, direkt në kod)
Nëse preferon të mos përdorësh Google Sheets, mund të vazhdosh të redaktosh `data/products.json` direkt — çdo produkt ka: `name`, `price`, `colors`, `image`, `description`.

## Nevojitet ndihmë?
Nëse diçka nuk shkon (Stripe error, deploy fail, etj.) kthehu te Claude me mesazhin e gabimit ekzakt dhe e zgjidhim bashkë.
