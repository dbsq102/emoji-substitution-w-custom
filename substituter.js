/*global sortedEmojiMap*/
var emojiMap = sortedEmojiMap;

var regexs = new Map();
for (let word of emojiMap.keys()) {
  regexs.set(word, new RegExp(word, 'gi'));
}

// Adds the custom emoji into the pool.
Promise.all([
  browser.storage.sync.get('replaced'),
  browser.storage.sync.get('emoji')
]).then(([res, res2]) => {
  emojiMap.set(res.replaced, res2.emoji);
  regexs.set(res.replaced, new RegExp(res.replaced, 'gi'));
  replaceText(document.body);
})

console.log(emojiMap);
console.log(regexs);

/**
 * Substitutes emojis into text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the emoji substitution is done inline.
 */
function replaceText (node) {
  // Setting textContent on a node removes all of its children and replaces
  // them with a single text node. Since we don't want to alter the DOM aside
  // from substituting text, we only substitute on single text nodes.
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode &&
        node.parentNode.nodeName === 'TEXTAREA') {
      return;
    }

    let content = node.textContent;

    for (let [word, emoji] of emojiMap) {
      const regex = regexs.get(word);

      content = content.replace(regex, emoji);
    }

    node.textContent = content;
  }
  else {
    // This node contains more than just text, call replaceText() on each
    // of its children.
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }    
  }
}

replaceText(document.body);

// Now monitor the DOM for additions and substitute emoji into new nodes.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});

document.querySelector("form").addEventListener("submit", replaceText(document.body));