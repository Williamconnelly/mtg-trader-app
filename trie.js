class Node {
    constructor() {
        this.word
    }
}
class Trie {
    constructor () {
        this.head = new Node();
    }
    add(word) {
        let keysWord = word.toLowerCase();
        let curr = this.head;
        for (let i=0; i<keysWord.length; i++) {
            if (!curr.hasOwnProperty(keysWord[i])) {
                curr[keysWord[i]] = new Node();
            }
            curr = curr[keysWord[i]];
        }
        curr.word = word;
    }

    addWords(array) {
        for (let i=0; i<array.length; i++) {
            this.add(array[i]);
        }
    }

    autocomplete(string) {
        string = string.toLowerCase();
        let words = []
        let curr = this.head;
        // for (let i=0; i<string.length; i++) {
        //     curr = curr[string[i]];
        // }
        let i=0;
        while (i<string.length && curr) {
            curr = curr[string[i++]];
        }
        if (i === string.length && curr) {
            this.recursiveHelper(curr, words);
        }
        return words;
    }

    recursiveHelper(node, words) {
        if (node.word !== undefined) {
            words.push(node.word);
        }
        for (let key in node) {
            if (key.length <= 1) {
                this.recursiveHelper(node[key], words);
            }
        }
    }
}

let myTrie = new Trie();
myTrie.addWords(require("./cardNames").cardNames);

exports.trie = myTrie;