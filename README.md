# JEMS — Junior English Masterbook

**JEMS** is a friendly, browser-based English learning game for young learners. It combines English practice with Bangla support and interactive activities to make learning feel more like play.

🌐 **Live website:** https://fahm-codes.github.io/JEMS/

## Features

- **Picture & Word Match** — connect words with visual clues.
- **Memory Match** — practise recall by matching pairs.
- **Word Scramble** — rearrange letters to spell a word.
- **Missing Letter** — complete words with the correct letter.
- **Odd One Out** — identify the item that does not belong.
- **Word Bingo** — choose the English word that matches a Bangla prompt.
- **Listen & Choose** — listen to a spoken word and select the answer.
- **Grammar Fix** — practise choosing the correct form.
- **Flashcards** — review English words and their Bangla meanings.
- **Word Grid Battle** — take turns placing letters and score points by making valid English words, with Easy, Medium and Hard board sizes.
- **Speech support** — use the browser's speech synthesis for listening practice.
- **Learning profile and progress** — save learning details and progress in the current browser using local storage.

## Getting started

### Use the live site

Open https://fahm-codes.github.io/JEMS/ in a modern browser. No account or server installation is required.

### Run locally

1. Clone this repository:
   ```bash
   git clone https://github.com/fahm-codes/JEMS.git
   ```
2. Open the project folder.
3. Open `index.html` in a modern browser, or use a local static web server.

The current app is primarily a standalone HTML, CSS and JavaScript project. It does not require a build step or backend server.

## Word Grid Battle dictionary

Word Grid Battle includes a built-in set of words and attempts to load an expanded English word list from the public `dwyl/english-words` repository when an internet connection is available. The external word list is not the Oxford Dictionary. Internet access may be needed for the expanded list; availability depends on the external source. Game progress and profile data are stored locally in the browser and do not automatically sync across devices.

## Tech

- HTML
- CSS
- Vanilla JavaScript
- Browser local storage
- Web Speech API (where supported by the browser)
- Public English word-list resource for expanded word validation

## Browser support

Use a recent version of Chrome, Edge, Firefox or Safari for the best experience. Speech features depend on browser and operating-system support. Some optional features require an internet connection.

## Privacy and data

JEMS does not require an account or a dedicated backend. Profile and progress information is saved in the browser's local storage on the device you use. Clearing browser site data or switching devices/browsers may remove or leave behind that locally saved progress.

## Developer

Designed and developed by **Fahmid Hasan Sunny**.

- GitHub: https://github.com/fahm-codes
- Instagram: https://www.instagram.com/fahm.codes/
- Email: fahmidsunny59@gmail.com
- LinkedIn: https://bd.linkedin.com/in/fahmidsunny

## Contributing and feedback

Suggestions, bug reports and improvements are welcome. Open an issue in this repository with details about the problem or idea.

## License

No explicit license is currently specified in this repository. Unless a license is added, the source code should not be assumed to be open for reuse, redistribution or modification by others.
