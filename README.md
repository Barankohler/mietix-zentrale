# Mietix Zentrale

Die **Zentrale** ist die Startseite und Schaltstelle aller Mietix-Werkzeuge (Mietix Sportwagenvermietung).
Sie läuft als Web-App im Browser und lässt sich auf iPhone, iPad und Mac wie eine App auf den Home-Bildschirm legen.

**Adresse:** <https://barankohler.github.io/mietix-zentrale/>

> **Wichtig:** Dieses Repository ist das **veröffentlichte Ergebnis**, nicht die Quelle.
> Die HTML-Seiten werden auf dem Mac (Ordner `Personal-OS/projects/mietix`) von den Bau-Skripten
> (`tools/…/build_html.py`) erzeugt und automatisch hierher hochgeladen („Zentrale aktualisiert (Datum)“).
> Wer eine HTML-Datei hier direkt ändert, verliert die Änderung beim nächsten Hochladen.
> Details: [docs/HOSTING.md](docs/HOSTING.md).

---

## Inhalt dieses Repositorys

| Datei | Wofür |
|---|---|
| `index.html` | **Zentrale (Startseite):** Begrüßung, Kennzahlen (unterwegs, stehen, Übergaben, Rückgaben), Mietumsatz des Monats gegen die Fixkosten, „Zu erledigen“, „WhatsApp heute“, „Freie Autos anbieten“, „Morgen“, „Ausstieg 30.06.2027“, Suche und Kacheln zu allen Werkzeugen |
| `kunden.html` | **Kunden:** Kundenstamm mit Suche, Filtern und Sortierung, Kundenkarte mit allen Mieten (auch ältere Mieten aus der Excel), Angebot an Kunden verschicken, neuer Mietvertrag mit vorausgefülltem Kunden |
| `nachrichten.html` | **Nachrichten:** WhatsApp-Textvorlagen nach Thema (Erster Kontakt, Kaution, Reservierung, Anzahlung, Kilometerpakete, Abholung und Rückgabe, Danach, Fahrzeuge, Wochenende). Kopieren, Lücken ausfüllen, Texte selbst ändern |
| `statistik.html` | **Zahlen:** Monat in einer Zahl, „Reicht es diesen Monat?“, Monate im Vergleich, „Welches Auto verdient?“, Stammkunden, Ausgaben, „Daran arbeiten“ |
| `einstellungen.html` | **Einstellungen:** Anmeldung, Stand der Excel-Brücke, weitere Seiten (Story, Umsatz-Radar), alle Links kopieren, Unterschrift des Vermieters, Hinweis zu den Sicherungsständen |
| `papierkorb.html` | **Papierkorb:** Gelöschtes und „andere Fassungen“ aus dem Abgleich wiederherstellen (90 Tage) |
| `sw.js` | Service Worker: Seiten funktionieren auch ohne Internet bzw. bei schlechtem Netz (nach 3 Sekunden kommt die gespeicherte Kopie) |
| `logo.png`, `icon-512.png`, `apple-touch-icon.png` | Logo und App-Symbole |
| `vollmacht.pdf` | Vorlage „Vollmacht“ für Kunden, deren Fahrzeug nicht auf sie angemeldet ist |
| `docs/` | Ausführliche Dokumentation (siehe unten) |
| `CLAUDE.md` | Arbeitsanweisungen für Claude (KI-Assistent) in diesem Repository |

## Die Mietix-Werkzeuge im Überblick

Die Zentrale ist eine von mehreren Seiten. Jedes Werkzeug ist ein eigenes Repository und wird über GitHub Pages veröffentlicht.
Alle liegen unter `https://barankohler.github.io/<name>/` und teilen sich Anmeldung und Daten.

| Werkzeug | Repository | Wofür |
|---|---|---|
| Zentrale | `mietix-zentrale` | Start, Kunden, Nachrichten, Zahlen, Einstellungen, Papierkorb |
| Buchungen | `mietix-vertrag` | Mietverträge, Übergabe, Rückgabe, Unterschriften |
| Anfragen | `mietix-anfragen` | Anfragen-Buch, neue Anfrage |
| Kalender / Angebot | `mietix-belegung` | Belegung der Autos, freie Autos anbieten |
| Autos | `mietix-autos` | Fahrzeuge, TÜV, Service, Reifen, Garantie |
| Geld | `mietix-geld` | Einnahmen und Ausgaben |
| Schäden | `mietix-schadensabrechnung` | Schadensabrechnung (dazu `mietix-schadensformular`, `mietix-schadensklaerung`) |
| Story | `mietix-story` | Instagram-Bild aus den freien Autos |
| Umsatz-Radar | `mietix-umsatz-radar` | Umsatzübersicht |
| Preise | `mietix-preise` | `preise.json`: Preisliste aller Autos, wird von der Zentrale geladen |
| weitere | `mietix-endabrechnung`, `mietix-anzahlung`, `mietix-preisrechner`, `mietix-zustand`, `mietix-uebergabe` | Einzelwerkzeuge |

## So funktioniert es (kurz)

1. **Alles läuft im Browser.** Es gibt keinen eigenen Server, nur statische HTML-Dateien mit eingebautem CSS und JavaScript, ohne Frameworks und ohne Build-Schritt im Browser.
2. **Die Daten liegen zuerst auf dem Gerät** (`localStorage`, Unterschriften in `IndexedDB`). Damit funktioniert alles auch ohne Internet.
3. **Der Abgleich** gleicht die Daten über **Supabase** (Datenbank in Frankfurt) zwischen allen Geräten ab: beim Start, beim Zurückkehren zur Seite, jede Minute und kurz nach jeder Änderung.
   Wenn zwei Geräte etwas ändern, werden die Änderungen zusammengeführt. Es geht nichts still verloren, denn die andere Fassung landet im Papierkorb.
4. **Anmeldung:** E-Mail und Passwort, einmal pro Gerät. Sie gilt für alle Mietix-Werkzeuge.
5. **Die Excel-Brücke** ist ein Skript auf dem Mac. Es schreibt Zahlen aus der Excel-Mappe (Umsatz, Fixkosten, alte Mieten) in den gemeinsamen Speicher (`stand`).
   Der Punkt oben rechts in der Zentrale zeigt den Stand: **grün** heißt angemeldet und aktuell, **rot** heißt, die Brücke hat sich seit über 2 Stunden nicht gemeldet („Mac aus oder ohne Internet?“), **grau** heißt nicht angemeldet.

Ausführlich: [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md) und [docs/DATEN.md](docs/DATEN.md).

## Benutzen

- **Öffnen:** <https://barankohler.github.io/mietix-zentrale/>
- **Als App installieren (iPhone/iPad):** In Safari unten auf „Teilen“ tippen, dann „Zum Home-Bildschirm“.
- **Anmelden:** in der Zentrale oder unter Einstellungen. Ein neuer Zugang ist nur möglich, solange Baran die Registrierung in Supabase kurz freigibt. Alternativ geht eine Einladungs-Mail.
- **Neue Version:** Erscheint oben „Neue Version da. Tippen zum Aktualisieren“, einfach antippen.
- **Etwas versehentlich gelöscht?** Unten erscheint 8 Sekunden lang „Rückgängig“. Danach liegt es 90 Tage im **Papierkorb**.
- **Sicherungsstände** der ganzen Zentrale liegen auf dem Mac (`Personal-OS/projects/mietix/staende`) und in iCloud (`Excel Archiv/Mietix/Stände`).

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [docs/HOSTING.md](docs/HOSTING.md) | Wo und wie alles gehostet und veröffentlicht wird |
| [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md) | Aufbau der Seiten, gemeinsame Bausteine, Abgleich, Offline-Betrieb |
| [docs/DATEN.md](docs/DATEN.md) | Datenmodell: Speicher auf dem Gerät, Tabellen in Supabase, wichtige Felder |
| [CLAUDE.md](CLAUDE.md) | Regeln für die Arbeit mit Claude in diesem Repository |
