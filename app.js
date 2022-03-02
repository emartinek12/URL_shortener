const express = require("express");
const request = require("request");
const {nanoid} = require("nanoid");
const bodyParser = require("body-parser");
const cors = require("cors");
const { redirect, render } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs')

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let urls = [];

app.use(cors());

app.get("/", (req, res) => {
  res.render('index', { urls });
})

app.post("/encode", (req, res) => {

  let foundLong = urls.find(url => url.longUrl === req.body.longUrl)

  if (foundLong == undefined) {
    var shortUrl = nanoid(6);
    const url = {
      "longUrl": req.body.longUrl,
      "shortUrl": shortUrl,
      "encoded": true
    };
    urls.push(url);
  } else {
    foundLong.encoded = true;
  }

  res.redirect('/');
})

app.get('/encode', (req, res) => {
  res.json(urls);
});

app.post('/decode', async (req, res) => {

  let found = await urls.find(url => url.shortUrl === req.body.short);
    if (found == undefined) return res.status(404).send('URL not found');

  found.encoded = false;
  res.redirect('/');
})

app.get('/decode', (req, res) => {
  res.json(urls);
})

app.get('/:shortUrl', async (req, res) => {

  const short = await urls.find(url => url.shortUrl === req.params.shortUrl)
    if (short == null) return res.sendStatus(404)

  res.redirect(short.longUrl);
});

app.listen("3000", function() {
  console.log("The server is running on port 3000");
})
