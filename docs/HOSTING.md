# Hosting und Veröffentlichung

Stand: 01.11.2026

## Kurzfassung

| Was | Wo |
|---|---|
| **Webseiten (Frontend)** | **GitHub Pages** aus dem Repository `Barankohler/mietix-zentrale`, Zweig `main`, Wurzelordner |
| **Adresse** | <https://barankohler.github.io/mietix-zentrale/> |
| **Datenbank und Anmeldung** | **Supabase**, Projekt `zbeqrwvlmiulxvhryiku` (Region Frankfurt) |
| **Quellcode und Bau-Skripte** | auf dem **Mac** in `Personal-OS/projects/mietix` (`tools/…`), **nicht** in diesem Repository |
| **Excel-Brücke** | Skript auf dem **Mac**, schreibt in die Supabase-Tabelle `stand` |
| **Preisliste** | GitHub Pages: <https://barankohler.github.io/mietix-preise/preise.json> |
| **Schriften** | Google Fonts (Inter) |
| **Sicherungsstände** | Mac (`Personal-OS/projects/mietix/staende`) und iCloud (`Excel Archiv/Mietix/Stände`) |

Eigene Server, Docker oder Kosten für Hosting gibt es nicht. GitHub Pages und Supabase übernehmen alles.

## 1. GitHub Pages (die Seiten)

- Das Repository ist **öffentlich** (Voraussetzung für kostenloses GitHub Pages).
- GitHub Pages veröffentlicht den Zweig `main` direkt. Jede Datei im Repository ist damit öffentlich erreichbar, auch diese Dokumentation
  (z. B. `…/mietix-zentrale/README.html` bzw. die `.md`-Dateien).
- Es gibt keine eigene Domain (`CNAME` fehlt), keinen GitHub-Actions-Workflow und keinen Build-Schritt auf GitHub. Die HTML-Dateien werden 1:1 ausgeliefert.
- Nach einem Push dauert es meist 1 bis 2 Minuten, bis die neue Version online ist. Die Seiten erkennen das selbst
  (sie vergleichen sich mit der Fassung im Netz) und zeigen „Neue Version da. Tippen zum Aktualisieren“.
- Alle Mietix-Werkzeuge liegen unter derselben Adresse `barankohler.github.io`. Darum teilen sie sich `localStorage`,
  also Anmeldung und Daten auf dem Gerät.

## 2. Wie Änderungen hierher kommen

```
Mac: Personal-OS/projects/mietix
  ├─ tools/vertrag/build_html.py      ─┐
  ├─ tools/anfragen/build_html.py      ├─ erzeugen die fertigen HTML-Seiten
  ├─ tools/…                          ─┘  und bauen gemeinsame Bausteine ein (Abgleich, Schutz, App-Gefühl …)
  └─ tools/vertrag/speicher.sql           Tabellen und Regeln für Supabase
            │
            ▼  automatischer Push (Commit „Zentrale aktualisiert (TT.MM.JJJJ)“)
GitHub: Barankohler/mietix-zentrale, mietix-vertrag, mietix-anfragen, mietix-belegung …
            │
            ▼  GitHub Pages
https://barankohler.github.io/mietix-…/
```

Folgen davon:

- **Dieses Repository ist Ausgabe, nicht Quelle.** Änderungen an den HTML-Dateien gehören in die Quelle auf dem Mac.
  Sonst überschreibt der nächste Push sie.
- Die Werkzeuge werden meist gemeinsam veröffentlicht (gleiche Uhrzeit bei `mietix-zentrale`, `-anfragen`, `-belegung`, `-vertrag`).
- Die Commit-Nachrichten sagen nur das Datum. Was sich geändert hat, steht in den Kommentaren im Code (mit Datum) und im Diff.
- Ob das Hochlade-Skript Dateien löscht, die es selbst nicht kennt (z. B. diese `.md`-Dateien), ist hier nicht sichtbar.
  Falls die Dokumentation nach einem Push verschwindet, gehört sie zusätzlich in die Quelle auf dem Mac.

## 3. Supabase (Daten und Anmeldung)

- Adresse: `https://zbeqrwvlmiulxvhryiku.supabase.co`, Region Frankfurt (EU), in Betrieb seit 26.10.2026.
- Die Seiten sprechen Supabase direkt über die REST-Schnittstelle an (`/rest/v1/…`, `/auth/v1/…`). Eine Supabase-Bibliothek wird nicht geladen.
- Der Schlüssel `sb_publishable_…` im Code ist **öffentlich gedacht** (Publishable Key). Der Schutz der Daten kommt aus
  der **Anmeldung** und den **Regeln in der Datenbank** (Row Level Security, festgelegt in `tools/vertrag/speicher.sql` auf dem Mac).
  Einen geheimen Schlüssel (`service_role` / `sb_secret_…`) darf es hier **nie** geben, weil das Repository öffentlich ist.
- Neue Zugänge: Die Registrierung ist normalerweise gesperrt und wird für neue Personen kurz in Supabase freigegeben, alternativ per Einladungs-Mail.
- Zusätzlich schreibt die Datenbank jede Änderung in die Tabelle `verlauf` (Protokoll).
- Datenbank-Funktion: `rpc/vertragsnummer_mindestens` sorgt dafür, dass Vertragsnummern nicht doppelt vergeben werden.

## 4. Offline (Service Worker)

`sw.js` liegt im Ordner der Seite und wird von jeder Seite registriert (nur über `https:`).

- **Netz zuerst:** Antworten werden im Cache `mietix-seiten-1` gespeichert.
- **Seitenaufruf bei schlechtem Netz:** Nach 3 Sekunden kommt die gespeicherte Kopie, das Netz lädt im Hintergrund weiter.
- **Ohne Netz:** gespeicherte Kopie.
- **Nicht gecacht:** Anfragen an Supabase und alles, was nicht `GET` ist.
- Gecacht werden nur die eigene Adresse und Google Fonts, jsDelivr, unpkg und cdnjs.

## 5. Fremde Dienste, die die Seiten aufrufen

| Dienst | Wofür |
|---|---|
| `zbeqrwvlmiulxvhryiku.supabase.co` | Daten und Anmeldung |
| `barankohler.github.io/mietix-preise/preise.json` | Preisliste (Autos, Preise, Kilometerpakete) |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Schrift „Inter“ |
| `wa.me` | WhatsApp-Nachrichten öffnen |
| `search.google.com/local/writereview` | Link für Google-Bewertungen |
