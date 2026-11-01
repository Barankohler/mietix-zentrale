# CLAUDE.md

Anweisungen für Claude bei der Arbeit in diesem Repository.

## Was das ist

`mietix-zentrale` ist die Startseite der Mietix-Werkzeuge (Sportwagenvermietung von Baran).
Statische HTML-Seiten, veröffentlicht über **GitHub Pages** unter <https://barankohler.github.io/mietix-zentrale/>.
Die Daten liegen auf dem Gerät (`localStorage`/IndexedDB) und werden über **Supabase** (Frankfurt) zwischen den Geräten abgeglichen.

Zuerst lesen: `README.md`, `docs/HOSTING.md`, `docs/ARCHITEKTUR.md`, `docs/DATEN.md`.

## Wichtigste Regel: Dies ist Ausgabe, nicht Quelle

Die HTML-Dateien werden auf Barans Mac (`Personal-OS/projects/mietix`, Skripte `tools/…/build_html.py`) erzeugt
und automatisch hierher gepusht (Commits „Zentrale aktualisiert (TT.MM.JJJJ)“).

- Direkte Änderungen an `*.html` hier werden beim nächsten Push **überschrieben**. Vor Code-Änderungen nachfragen,
  ob sie hier (nur als schnelle Korrektur) oder in der Quelle auf dem Mac gemacht werden sollen.
- Die Bausteine „Mietix Abgleich“, „Schutz“, „Mietix App-Gefühl“, „Fenster“, „Einheit fest“ und „Anschrift getrennt“ stecken in **jeder** Seite
  und auch in anderen Repositories (`mietix-vertrag`, `mietix-anfragen` …). Eine Änderung an einer Stelle reicht nicht.
- `tools/…` und `speicher.sql` gibt es in diesem Repository **nicht**.

## Sprache und Stil

- Mit dem Nutzer **auf Deutsch** sprechen und **immer echte Umlaute** (ä, ö, ü, ß) schreiben, nie ae/oe/ue.
- Code ist komplett deutsch benannt (`lies`, `merk`, `zeichne`, `abgleichen`, IDs und CSS-Klassen). Diesen Stil beibehalten.
- Kommentare im bestehenden Stil: kurz, mit Datum und Anlass, z. B. `// Grund … (01.11.2026, Baran: „…“)`.
- Kompakter Stil wie im Bestand. Keine Frameworks, keine Bibliotheken, kein Build-Schritt, keine externen Skripte.
- Für Handy gebaut: Eingabefelder mindestens `font-size:16px` (sonst zoomt das iPhone), Tippflächen ≥ 44 px, `env(safe-area-inset-*)` beachten.

## Fachliche Regeln (aus dem Code)

- **Nichts darf still verloren gehen.** Löschen landet im Papierkorb (90 Tage), Konflikte als „Andere Fassung“ im Papierkorb, Rückgängig 8 s.
- **Offline zuerst.** Alles muss ohne Internet und ohne Anmeldung funktionieren. Der Abgleich holt später nach.
- Daten nur über `localStorage.setItem` der bekannten Schlüssel schreiben (`mietixVorgaenge`, `mietixKunden` …). Der Abgleich hängt sich dort ein.
- Unterschriften nie als `bild:<Kennung>` nach Supabase schicken (siehe `bilderRein`).
- Beträge in ganzen Euro anzeigen (`toLocaleString("de-DE")`), Datum deutsch (`TT.MM.`).

## Sicherheit

- Das Repository ist **öffentlich**. Der Supabase-Schlüssel `sb_publishable_…` ist öffentlich gedacht.
  **Niemals** einen geheimen Schlüssel (`service_role`, `sb_secret_…`), Passwörter oder Kundendaten committen.
- Der Datenschutz hängt an den Row-Level-Security-Regeln in Supabase (`speicher.sql` auf dem Mac).

## Prüfen

Es gibt keine Tests und keinen Build. Zum Ansehen:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000/` öffnen (Playwright/Chromium ist in der Cloud-Umgebung vorhanden).
Ohne Anmeldung laufen die Seiten mit leerem `localStorage`. Der Service Worker registriert sich nur über `https:`.

## Git

- Commits mit aussagekräftiger Nachricht auf Deutsch (was und warum), nicht nur „aktualisiert“.
- Nicht direkt auf `main` pushen, außer der Nutzer sagt es ausdrücklich. `main` ist sofort live.
