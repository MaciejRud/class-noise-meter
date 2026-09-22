# Cicho-metr

A floating classroom noise meter. It listens to the laptop microphone, shows the level on a
small gauge that stays on top of every other window (slides, browser, full-screen apps), and
starts a counter once the class has been loud for a few seconds. Built for one teacher and
a projector.

- Electron, one `index.html`, no build step for the UI
- Windows: portable `.exe`, no installer
- macOS: `.dmg`, unsigned (see first run below)

## Instrukcja dla nauczycielki

**Pierwsze uruchomienie**

- Windows: uruchom `Cicho-metr.exe`. Gdy SmartScreen pokaże ostrzeżenie: *Więcej informacji* → *Uruchom mimo to*. Tylko raz.
- Mac: otwórz `.dmg`, przeciągnij Cicho-metr do Aplikacji, uruchom. Gdy system odmówi
  („nie można zweryfikować dewelopera"): *Ustawienia systemowe* → *Prywatność i ochrona* →
  na dole *Otwórz mimo to*. Tylko raz. Potem zgódź się na dostęp do mikrofonu.
  Jeśli mikrofon został odrzucony (zegar pokazuje „brak mikrofonu"): *Ustawienia systemowe* →
  *Prywatność i ochrona* → *Mikrofon* → włącz Cicho-metr i uruchom aplikację ponownie.

**Obsługa**

- Przeciągnij zegar tam, gdzie ma stać; zapamięta miejsce.
- Rozmiar: złap prawą albo dolną krawędź (albo róg) i rozciągnij.
- Najedź na zegar → w rogu pojawi się ⚙ (ustawienia) i ✕ (zamknij).
- W ustawieniach: **Kalibruj** w cichej klasie (3 s ciszy = 0 %), potem ustaw **próg** tak, żeby
  normalna praca była zielona/żółta, a hałas czerwony. **Pokaż licznik po** — ile sekund hałasu
  uruchamia licznik; **Ukryj licznik po** — ile sekund ciszy go gasi.

## Development

```
npm install
npm start          # run from source
npm run dist:win   # portable exe in dist/ (Windows)
```

macOS builds come from GitHub Actions (`.github/workflows/build.yml`, run manually or on a
`v*` tag): the `cicho-metr-mac` artifact holds the universal `.dmg`. There is no Mac in the
loop, so the first run on a real Mac is the test — plan: `docs/plan.md`.
