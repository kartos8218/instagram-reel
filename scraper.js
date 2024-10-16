// scraper.js
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

app.use(express.json());
app.use(cors());

// accepts the URL of an Instagram page
const getVideo = async (url) => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const videoString = $("meta[property='og:video']").attr("content");
  return videoString;
};

// the callback is an async function
app.post("/api/download", async (request, response) => {
  console.log("request coming in...");
  try {
    const videoLink = await getVideo(request.body.url);
    if (videoLink !== undefined) {
      response.json({ downloadLink: videoLink });
    } else {
      response.json({ error: "The link you have entered is invalid." });
    }
  } catch (err) {
    response.json({
      error: "There is a problem with the link you have provided.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

module.exports = app;
