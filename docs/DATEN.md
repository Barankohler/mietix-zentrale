# Datenmodell

Die Seiten arbeiten mit `localStorage`. Der Abgleich spiegelt die Speicher in Supabase-Tabellen.
In jeder Tabelle gibt es die Spalten: Schlüssel (siehe unten), `daten` (JSON mit dem ganzen Eintrag) und `geaendert` (Zeitstempel).
Die Tabellen und Regeln sind in `tools/vertrag/speicher.sql` auf dem Mac festgelegt.

## Speicher und Tabellen

| `localStorage`-Schlüssel | Supabase-Tabelle | Schlüssel | Form | Inhalt |
|---|---|---|---|---|
| `mietixVorgaenge` | `vorgaenge` | `nr` | Liste | Mietverträge (6-stellige Vertragsnummer) |
| `mietixAnfragen` | `anfragen` | `id` | Liste | Anfragen-Buch |
| `mietixKunden` | `kunden` | `name` | Objekt (Name → Kunde) | Kundenstamm |
| `mietixFahrzeuge` | `fahrzeuge` | `name` | Objekt | Fahrzeugdaten aus den Verträgen |
| `mietixAutos` | `autos` | `name` | Objekt | Termine je Auto: `tuev`, `service`, `reifen`, `garantie` |
| `mietixAusgaben` | `ausgaben` | `id` | Liste | Ausgaben (`betrag`, `art`, `auto`) |
| `mietixSperren` | `sperren` | `id` | Liste | Gesperrte Zeiträume je Auto (`auto`, `von`, `bis`) |
| `mietixAufgaben` | `aufgaben` | `id` | Liste | Aufgaben (`aufgabe`) |
| `mietixZustand` | `zustand` | `id` | Liste | Zustand/Notizen je Auto (`auto`, `text`) |
| `mietixStand` | `stand` | `id` | Objekt | Gemeinsamer Stand, siehe unten |
| `mietixPapierkorb` | `papierkorb` | `id` | Liste | Gelöschtes und andere Fassungen (90 Tage) |
| – | `verlauf` | – | – | Protokoll aller Änderungen (nur Datenbank) |

Nur auf dem Gerät (werden nicht abgeglichen):

| Schlüssel | Inhalt |
|---|---|
| `mietixSitzung` | Anmeldung: `token`, `neu` (Refresh-Token), `bis`, `email` |
| `mietixAbgleich` | Je Speicher: Zeit des letzten Abgleichs, Fingerabdrücke je Eintrag und Feld |
| `mietixNeuAufbau1` | Merker: Neu-Aufbau auf diesem Gerät erledigt |
| `mietixEntwurfProtokolle` | Entwürfe (Unterschriften werden ausgelagert) |
| IndexedDB `mietix` / `bilder` | Unterschriften als Bild, Schlüssel `bild:<Kennung>` |

## Mietvertrag (`mietixVorgaenge`)

Wichtige Felder (Auswahl, wie sie die Zentrale liest):

| Feld | Bedeutung |
|---|---|
| `nr` | Vertragsnummer (6 Ziffern) |
| `name`, `tel` / `telefon` | Kunde |
| `auto` | Fahrzeugname (wie in `preise.json`, `n` oder `anzeige`) |
| `vonD`, `vonU` / `bisD`, `bisU` | Mietbeginn und -ende (Datum `JJJJ-MM-TT`, Uhrzeit) |
| `status` | `gebucht`, `zurück`, `storniert` (Anfragen auch `angebot`, `offen`) |
| `ueb` | Übergabe (Objekt, u. a. `datum`). Ist es gesetzt, ist das Auto beim Kunden |
| `rueck` | Rückgabe (Objekt, u. a. `datum`) |
| `zahlung` | Zahlungen, z. B. `zahlung.kaut.betrag` (Kaution) |
| `kautionRueck` | Kaution zurückgegeben |
| `_weg` | `true` = gelöscht (nur im Abgleich) |

## Gemeinsamer Stand (`mietixStand`)

| Feld | Von wem | Inhalt |
|---|---|---|
| `bruecke` | Excel-Brücke | `zeit`, `ok`, `text`: letzte Meldung der Brücke |
| `statistik` | Excel-Brücke | `monate[]` (`m`, `miete`, `mieten` …), `fix` (`gesamt`, `proTag`), `vergleich` (`vormonat`, `vormonatMieteBisTag`, `tag`), `verlauf` (ältere Mieten) |
| `nachrichten` | Seite Nachrichten | Selbst geänderte Textvorlagen |
| `schadensbelege` | Schadens-Werkzeuge | Belege |

## Preisliste

`https://barankohler.github.io/mietix-preise/preise.json` (Repository `mietix-preise`) enthält `cars[]` mit `n` (Name), `anzeige` (Anzeigename), Preisen und Kilometerpaketen.
Die Zentrale nutzt sie für die Flotte („stehen“), die Preise beim Anbieten und für Verlängerungen sowie für die Kilometerpakete in den Nachrichten.
