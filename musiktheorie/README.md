# Musiktheorie lernen 🎼

Ein vollständiges, interaktives Musiktheorie-Lernprogramm im Browser – auf Deutsch, ohne Installation, ohne Build-Schritt.

**Starten:** `index.html` im Browser öffnen (funktioniert auch offline).

## Inhalt

| Kapitel | Lektionen | Übungen |
|---|---|---|
| 1. Grundlagen | Töne & Notennamen · Notensystem & Schlüssel · Halbtöne, Ganztöne & Vorzeichen | Klaviertasten benennen · Noten lesen (Violin-/Bassschlüssel) · Töne auf der Klaviatur finden · Halbton/Ganzton · Enharmonik |
| 2. Rhythmus und Takt | Notenwerte & Pausen · Punktierung, Haltebogen, Triolen · Takt & Taktarten · Tempo, Dynamik, Artikulation | Notenwerte · Takte vervollständigen · Fachbegriffe |
| 3. Intervalle | Was ist ein Intervall? · Rein, groß, klein · Übermäßig, vermindert, Umkehrung | Intervalle zählen · bestimmen · bauen · hören |
| 4. Tonleitern | Dur · Moll (natürlich, harmonisch, melodisch) · Kirchentonarten · Pentatonik, Blues & mehr | Tonleiter-Stufen · Tonleitern erkennen · hören |
| 5. Tonarten & Quintenzirkel | Generalvorzeichen · Quintenzirkel · Parallel- & Varianttonarten | Tonart am Vorzeichen · Vorzeichen einer Tonart · Parallel/Variante |
| 6. Akkorde | Dreiklänge · Umkehrungen & Lagen · Septakkorde | Dreiklänge bestimmen · Akkordsymbole lesen · Umkehrungen · Akkorde hören |
| 7. Harmonielehre | Stufen · Funktionen (T, S, D, Parallelen) · Kadenzen & Akkordfolgen · Stimmführung | Stufenakkorde · Funktionen · Kadenzen hören |
| 8. Gehörbildung | Trainingstipps | Tonhöhen vergleichen · Intervalle · Akkorde · Tonleitern · Kadenzen · Melodien nachspielen |

- Jede Übung hat **drei Schwierigkeitsstufen**, zufällig generierte Aufgaben (10 pro Runde) und erklärendes Feedback.
- **Gemischtes Training** zieht Aufgaben aus allen Kapiteln.
- **Werkzeuge:** Klavier (auch per Computertastatur), interaktiver Quintenzirkel, Akkord-Explorer (inkl. Stufenakkorde jeder Tonart), Tonleiter-Explorer, Metronom mit Tap-Tempo.
- Alle Notenbeispiele sind anhörbar (Web Audio API), Notensatz als SVG.
- Fortschritt, Bestwerte und Lernserie werden lokal im Browser gespeichert (`localStorage`).
- Hell-/Dunkelmodus, mobil nutzbar, Tastaturbedienung im Quiz (`1`–`9`, `Enter`, `R`).

## Aufbau

```
index.html
css/style.css
fonts/NotoMusic-Regular.woff2   Notenschrift für Schlüssel (SIL Open Font License, siehe fonts/OFL.txt)
js/theory.js      Musiktheorie-Kern: Töne, Intervalle, Tonleitern, Akkorde, Tonarten (deutsche Notennamen)
js/audio.js       Klangerzeugung (Web Audio)
js/staff.js       Notensatz (SVG)
js/piano.js       Klaviatur
js/widgets.js     Interaktive Bausteine in Lektionen
js/lessons.js     Kursinhalte
js/exercises.js   Aufgabengeneratoren
js/tools.js       Werkzeuge
js/app.js         Navigation, Quiz-Ablauf, Fortschritt
```
