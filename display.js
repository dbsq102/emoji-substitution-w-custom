/*global sortedEmojiMap*/
var emojiMap = sortedEmojiMap;

for (let [word, emoji] of emojiMap) {
    document.write("<p>"+ word + " = " + emoji + "</p>");
}