# GTM Banen live zetten op gtmbanen.nl (Strato VPS)

Deze app is een **Node.js-server** (Next.js die live uit een SQLite-bestand rendert) + een
**scraper die op een schema draait**. Dat vraagt om een server waar Node draait — je **Strato VPS**,
niet de gewone (PHP-)webhosting van Strato.

> Heb je géén VPS? Dan kun je ook een Node-host gebruiken (Render, Railway, Fly.io) en bij Strato
> alleen de DNS naar die host wijzen. Let op: SQLite heeft een **persistente schijf** nodig — op
> hosts met een "ephemeral" filesystem ben je de database na elke deploy kwijt. Op een VPS speelt
> dat niet. Onderstaande gids gaat uit van de VPS.

## Overzicht

```
Internet ──► Nginx (443/80, SSL) ──► Next.js  (127.0.0.1:3000, systemd)
                                         │  leest
                                         ▼
                                    data/gtmbanen.db  ◄── scraper (cron) schrijft
```

Omdat de pagina's `force-dynamic` zijn, ziet de site **direct** nieuwe vacatures zodra de scraper
de database bijwerkt — een rebuild/herstart is alleen nodig bij **code**-wijzigingen.

---

## 1. DNS instellen bij Strato

In het Strato-paneel → Domein `gtmbanen.nl` → DNS:

| Type | Naam | Waarde |
| ---- | ---- | ------ |
| A | `@` | `<IP van je VPS>` |
| A | `www` | `<IP van je VPS>` |

DNS-propagatie duurt soms tot een uur. Check met `ping gtmbanen.nl`.

## 2. VPS klaarmaken (eenmalig)

SSH naar de VPS (Ubuntu/Debian aangenomen) en installeer Node 24+, Nginx en Git:

```bash
# Node 24 LTS (node:sqlite werkt vanaf Node 24 zonder flag — wij ontwikkelden op 26)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
node -v   # moet >= 24 zijn
```

> Kleine VPS (1 GB RAM)? De Next.js-build kan dan te weinig geheugen hebben. Voeg swap toe:
> `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`

## 3. Code op de server zetten

**Optie A – via Git (aanbevolen):** push deze map naar een (privé) GitHub-repo en clone op de VPS:

```bash
sudo mkdir -p /var/www && sudo chown $USER /var/www
cd /var/www
git clone <jouw-repo-url> gtmbanen
cd gtmbanen
```

**Optie B – zonder GitHub (rsync vanaf je pc):** vanaf Windows met WSL/Git Bash, zónder node_modules:

```bash
rsync -av --exclude node_modules --exclude .next --exclude 'data/*.db*' \
  ./ user@<VPS-IP>:/var/www/gtmbanen/
```

## 4. Installeren, configureren en builden

```bash
cd /var/www/gtmbanen
npm ci                      # installeer ALLE deps (de scraper gebruikt tsx uit devDependencies)

# .env aanmaken (optioneel: de standaard-URL is al https://gtmbanen.nl)
cat > .env <<'EOF'
NEXT_PUBLIC_SITE_URL=https://gtmbanen.nl
SALARY_USD_EUR_RATE=0.92
# E-mail voor vacature-alerts (optioneel). Zonder key print de digest alleen.
# RESEND_API_KEY=...
# ALERTS_FROM_EMAIL=vacatures@gtmbanen.nl
EOF

npm run scrape              # vul de database met vacatures (eerste keer)
npm run fetch-logos         # haal bedrijfslogo's op
npm run build               # productie-build
```

## 5. De site als service draaien (systemd)

Kopieer de meegeleverde unit en pas `User` aan naar jouw gebruiker:

```bash
sudo cp deploy/gtmbanen.service /etc/systemd/system/gtmbanen.service
sudo nano /etc/systemd/system/gtmbanen.service   # zet User= en paden goed
sudo systemctl daemon-reload
sudo systemctl enable --now gtmbanen
sudo systemctl status gtmbanen                    # moet "active (running)" zijn
curl -I http://127.0.0.1:3000                     # moet 200 geven
```

## 6. Nginx reverse proxy + HTTPS

```bash
sudo cp deploy/nginx-gtmbanen.conf /etc/nginx/sites-available/gtmbanen
sudo ln -s /etc/nginx/sites-available/gtmbanen /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Gratis SSL-certificaat (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gtmbanen.nl -d www.gtmbanen.nl
```

Certbot zet automatisch 80 → 443 redirect en vernieuwt het certificaat. Klaar: **https://gtmbanen.nl** is live.

## 7. Scraper automatisch laten draaien (cron)

```bash
crontab -e
```

Plak (pas het pad aan als je niet in `/var/www/gtmbanen` zit):

```cron
# Dagelijks vacatures verversen + opschonen, wekelijks logo's, dagelijks alerts
0 6 * * *  cd /var/www/gtmbanen && /usr/bin/npm run scrape      >> /var/log/gtmbanen.log 2>&1
30 6 * * * cd /var/www/gtmbanen && /usr/bin/npm run reclassify  >> /var/log/gtmbanen.log 2>&1
45 6 * * 1 cd /var/www/gtmbanen && /usr/bin/npm run fetch-logos >> /var/log/gtmbanen.log 2>&1
0 7 * * *  cd /var/www/gtmbanen && /usr/bin/npm run alerts:send >> /var/log/gtmbanen.log 2>&1
```

De site pikt nieuwe data **automatisch** op (geen herstart nodig).

## 8. Updaten na een codewijziging

```bash
cd /var/www/gtmbanen
git pull                 # of opnieuw rsync'en
npm ci
npm run build
sudo systemctl restart gtmbanen
```

## Aandachtspunten

- **Node-versie:** gebruik Node 24+ (dan werkt `node:sqlite` zonder flag). Op Node 22.x zou je
  `--experimental-sqlite` nodig hebben — upgrade liever.
- **Database = één bestand** (`data/gtmbanen.db`). Maak hier een back-up van (bijv. dagelijkse
  `cp`/cron of `sqlite3 .backup`). Het staat in `.gitignore`, dus het wordt niet meegedeployed.
- **LinkedIn/Indeed vanaf een VPS:** datacenter-IP's worden vaker geblokkeerd dan thuis-IP's. De
  ATS-feeds (Greenhouse, Lever, Ashby, Recruitee, …) — de betrouwbare kern — werken altijd.
- **Firewall:** zorg dat poorten 80 en 443 open staan (`sudo ufw allow 'Nginx Full'`).
- **E-mailalerts:** zet `RESEND_API_KEY` (resend.com) in `.env` om echte mails te sturen; zonder
  key doet `alerts:send` een dry-run.
