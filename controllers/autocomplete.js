module.exports = function(trie) {
    require("dotenv").config();
    const express = require("express");
    const router = express.Router();

    router.post("/", (req, res) => {
        res.json(trie.autocomplete(req.body.word));
    })
    return router;
}