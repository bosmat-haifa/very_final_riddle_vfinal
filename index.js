const fs = require("fs");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    var data = fs.readFileSync("./database.json", "utf-8");
    var content = JSON.parse(data);
    var hashes = content["hashes"];
    var hash = hashes[Math.floor(Math.random() * hashes.length)];
    var used = content["used"];
    var innocent = true;

    while (used.includes(hash)) {
        if (used.length < 10) {
            console.log(hash);
            res.sendFile(__dirname+"/WARNING.html");
            innocent = false;
            break;
        }
        hash = hashes[Math.floor(Math.random() * hashes.length)];
    }
    if (!innocent) return;
    var usedHash = hashes.splice(hashes.indexOf(hash), 1).shift();
    used.push(usedHash);
    fs.writeFileSync("./database.json", JSON.stringify(content, null, 4));
    
    var lines = [];
    var page = fs.readFileSync("./index.html", "utf-8").split("\n");
    
    for (const line of page) {
        lines.push(line);
    }

    lines[lines.length-5] = `window.location.hash = "${usedHash}";`;
    fs.writeFileSync("./index.html", lines.join("\n"));
    
    res.sendFile(__dirname+"/index.html");
});

app.get("/favicon.ico", (req, res) => {
    res.end();
});

app.listen(process.env.PORT || 8000, () => {console.log(`running on port ${process.env.PORT || 8000}`)});


/*
{
    "hashes": ["T3chN10nI5oUrFr13nd", "1nT3LW0rk5W1thU5", "W3L0vEcYb3r", "y0uR3LuCkY", "t1M3I5t1ck1ng", "c0mPUt3rI50uR1if3", "W3Als0RUL3", "wEW1lLH3lPy0U", "tH1sI5tH3FUTUR3", "r3M3mBErTH1s"]
}
*/

// every time that someone is joining the site it needs to remove the hash from the database and remember his ip to not let him join a different hash