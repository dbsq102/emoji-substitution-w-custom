/*
 * This file contains emoji map for substitutions as well as option saving.
 */

// Default emojis available.
var dictionary = new Map();
dictionary.set('fire', '🔥');
dictionary.set('water', '💦');
dictionary.set('thunder', '⚡');
dictionary.set('wind', '💨');
dictionary.set('king', '🤴');
dictionary.set('queen', '👸');
dictionary.set('crown', '👑');
dictionary.set('apple', '🍎');
dictionary.set('banana', '🍌');
dictionary.set('baseball', '⚾');
dictionary.set('wine', '🍷');
dictionary.set('wink', '😉');
dictionary.set('basketball', '🏀');
dictionary.set('golf', '⛳');
dictionary.set('hamburger', '🍔');
dictionary.set('happy', '😀');
dictionary.set('horse', '🐴');

// Put the default emojis in a global array.
var sortedEmojiMap = new Map(dictionary);

// Save changes upon pressing the button.
function saveOptions(e) {
  browser.storage.sync.set({
    replaced: document.querySelector("#replaced").value,
    emoji: document.querySelector("#emoji").value
  });
  e.preventDefault();
  // Change the recently changed segment.
  Promise.all([
    browser.storage.sync.get('replaced'),
    browser.storage.sync.get('emoji')
  ]).then(([res, res2]) => {
    document.querySelector("#recentReplaced").innerHTML = res.replaced;
    document.querySelector("#recentEmoji").innerHTML = res2.emoji;
  })
}

function restoreOptions() {
  Promise.all([
    browser.storage.sync.get('replaced'),
    browser.storage.sync.get('emoji')
  ]).then(([res, res2]) => {
    /*document.querySelector("#replaced").value = res.replaced;
    document.querySelector("#emoji").value = res2.emoji;*/
    document.querySelector("#recentReplaced").innerHTML = res.replaced;
    document.querySelector("#recentEmoji").innerHTML = res2.emoji;
  })
}

// Upon loading the page, display previous recently changed emoji.
document.addEventListener('DOMContentLoaded', restoreOptions);
// Upon clicking the button, save options into browser.storage.sync.
document.querySelector("form").addEventListener("submit", saveOptions);
