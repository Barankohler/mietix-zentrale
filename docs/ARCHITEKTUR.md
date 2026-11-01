# Architektur

## Grundprinzip

Jede Seite ist **eine einzige HTML-Datei** mit allem drin: HTML, `<style>` und mehrere `<script>`-Blöcke.
Es gibt keine Frameworks, keine Bibliotheken, kein npm und keinen Build-Schritt im Repository. Das gilt bewusst so:
Die Seiten sollen auf jedem Gerät sofort und auch offline laufen.

```
┌──────────── Gerät (iPhone, iPad, Mac) ────────────┐
│  Seite (HTML)                                     │
│    │ liest/schreibt                               │
│    ▼                                              │
│  localStorage  (mietixVorgaenge, mietixKunden …)  │
│  IndexedDB "mietix" (Unterschriften als Bild)     │
│    ▲                                              │
│    │ Baustein „Abgleich“ (in jeder Seite)         │
└────┼──────────────────────────────────────────────┘
     │ REST, alle 60 s + nach jeder Änderung
     ▼
Supabase (Frankfurt): Tabellen vorgaenge, kunden, … , stand, papierkorb, verlauf
     ▲
     │ Excel-Brücke (Skript auf dem Mac) → Tabelle stand
```

## Seiten

| Seite | Hauptaufgaben im Code |
|---|---|
| `index.html` | Kennzahlen (`zahlenZeichnen`), Liste „Zu erledigen“ (überfällige Abholung, offene Miete/Kaution, Endabrechnung, Doppelbelegung, Nachfassen bei Angeboten älter als 24 h), WhatsApp heute (Erinnerung an die Abholung, Verlängerung anbieten), freie Autos anbieten, Morgen, Ausstieg ab März 2027, Status-Punkt (Anmeldung/Brücke) |
| `kunden.html` | Baustein „Mietix Kundenstamm“, Kundenkarte, Zusammenführen von Mieten aus Mietverträgen und Excel-Verlauf (gleicher Kunde über Telefon oder Namen, gleiche Miete = Auto ±3 Tage), Angebot verschicken, Suche/Filter/Sortierung |
| `nachrichten.html` | Textvorlagen, Lücken (`Feld:` ohne Inhalt) gelb markiert, „morgen“/„übermorgen“ bekommen automatisch ein Datum, Kilometerpakete aus `preise.json`, eigene Texte in `mietixStand.nachrichten` |
| `statistik.html` | 7 Abschnitte aus `mietixStand.statistik` (von der Excel-Brücke): Monat, Fixkosten gegen Tempo, Monatsvergleich, Autos, Stamm, Ausgaben, Daran arbeiten. Vergleich immer mit demselben Zeitraum im Vormonat |
| `einstellungen.html` | Anmeldung, Brücken-Stand, Links, Vermieter-Unterschrift (öffnet `mietix-vertrag`) |
| `papierkorb.html` | Ein Kasten je Bereich, Wiederherstellen über `window.mietixWiederherstellen`. Wenn ein wiederhergestellter Eintrag ein Auto belegen würde, wird erst nachgefragt |

## Gemeinsame Bausteine

Die Bau-Skripte auf dem Mac setzen dieselben Blöcke in **jede** Seite ein (auch in die anderen Mietix-Werkzeuge).
Deshalb steht derselbe Code mehrfach im Repository. Ändern muss man ihn in der Quelle, nicht hier.

| Baustein (Kommentar am Anfang) | Aufgabe |
|---|---|
| `/* Mietix Abgleich … */` | Anmeldung, Abgleich mit Supabase, Unterschriften in IndexedDB, Sicherheitsnetz, Vertragsnummer, Anzeige von Anmeldung und Status |
| `/* Fenster … */` | Dialoge: Knopf mit `data-fenster` öffnet, ✕, Tipp daneben oder Esc schließt |
| `/* Schutz … */` | Roter Hinweis bei Fehlern (`mxFehler`), Warnung bei vollem Gerätespeicher, Prüfung, ob `preise.json` lädt, Entwürfe von Formularen beim Tippen sichern |
| `/* Mietix App-Gefühl … */` | Einheitliches Design und Kopfzeile, Wischen vom linken Rand als „zurück“, sanftes Überblenden, Hinweis auf neue Version, Service Worker registrieren, Vorladen der meistgenutzten Seiten |
| `/* Einheit fest im Zahlenfeld … */` | „€“ und „km“ fest am Eingabefeld |
| `/* Anschrift getrennt … */` | Anschrift in getrennte Felder |

## Der Abgleich im Detail

Quelle: Baustein „Mietix Abgleich“, Abschnitte `Anmeldung`, `Abgleich`, `Sicherheitsnetz`.

1. **Auslöser:** `Storage.prototype.setItem` wird überschrieben. Jede Änderung an einem der Speicher startet nach 800 ms einen Abgleich.
   Dazu kommt ein Abgleich beim Start, beim Zurückkehren zur Seite und jede Minute.
2. **Erst holen, dann schicken.** Je Tabelle werden alle Zeilen geholt, die seit dem letzten Abgleich geändert wurden.
   Zwei Minuten werden überlappend abgefragt, falls die Uhren der Geräte nicht gleich gehen.
3. **Zusammenführen** (`zusammen()`): Je Eintrag merkt sich das Gerät einen Fingerabdruck (Hash) des letzten gemeinsamen Stands, je Feld und je Unterfeld (`feld.unter`).
   - Nur hier geändert: Der eigene Stand bleibt.
   - Nur dort geändert: Der neue Stand wird übernommen.
   - Beide haben verschiedene Felder geändert: Beide Änderungen werden kombiniert.
   - Beide haben dasselbe Feld geändert: Der eigene Stand bleibt, die andere Fassung kommt in den Papierkorb („Andere Fassung“).
   - Hier geändert und dort gelöscht: Der Eintrag bleibt („Geändert schlägt Gelöscht“).
4. **Hochladen:** alles, was vom gemeinsamen Stand abweicht, als Upsert in Blöcken zu 200 (`Prefer: resolution=merge-duplicates`).
   Gelöschtes geht als `{_weg:true}` hoch.
5. **Unterschriften:** Bilder (`data:image/…`) liegen auf dem Gerät in IndexedDB. In `localStorage` steht nur `bild:<Kennung>`.
   Nach Supabase geht immer das ganze Bild, nie die Kennung. Fehlt ein Bild, wird nichts hochgeladen und es erscheint ein Hinweis.
6. **Neu-Aufbau einmal je Gerät** (`mietixNeuAufbau1`): Mietverträge, Papierkorb und Stand werden einmal frisch vom gemeinsamen Stand übernommen.
7. **Zeitlimit:** Jede Anfrage an Supabase bricht nach 20 Sekunden ab.
8. **Abmelden** passiert nur, wenn Supabase die Anmeldung wirklich ablehnt (4xx), nicht bei schlechtem Netz.
9. Nach einem Abgleich mit neuen Daten wird das Ereignis `mietix-abgleich` gesendet. Die Seiten zeichnen sich dann neu.

## Sicherheitsnetz („Verklicken darf nichts verlieren“)

1. **Rückgängig:** Nach jeder Änderung erscheint 8 Sekunden lang ein Knopf. Änderungen innerhalb von 0,7 s gehören zusammen.
2. **Papierkorb:** Was aus einer Liste verschwindet, kommt in `mietixPapierkorb` (Tabelle `papierkorb`) und bleibt 90 Tage.
3. **Verlauf:** Die Datenbank protokolliert jede Änderung in der Tabelle `verlauf`.
4. **Sicherungsstände** auf dem Mac und in iCloud.

## Code-Stil

- Alles auf **Deutsch**: Variablen (`lies`, `merk`, `zeichne`, `abgleichen`), IDs, CSS-Klassen, Kommentare.
- Sehr kompakter, teils minifizierter Stil (viel in einer Zeile).
- Kommentare nennen **Datum und Anlass**, z. B. `// … (31.10.2026, Baran: „…“)`. So bleibt nachvollziehbar, warum etwas so ist.
- Farben: `--rot:#C4161C` (Markenfarbe), Schrift Inter bzw. System-Schrift, ausgelegt für Handy (max. 430–680 px breit).
