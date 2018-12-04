module.exports = function(trie) {
    require("dotenv").config();
    const express = require("express");
    const router = express.Router();

    router.get("/:word", (req, res) => {
        res.json(trie.autocomplete(req.params.word));
    })
    return router;
}