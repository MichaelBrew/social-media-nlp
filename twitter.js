require('dotenv').config();

const Twitter = require('twitter');
const sentiment = require('sentiment');
const _ = require('lodash');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function startStreaming() {
  client.stream('statuses/filter', {track: 'javascript'}, (stream) => {
    stream.on('data', (event) => {
      if (event) {
        const {score} = sentiment(event.text);
        console.log(`TEXT: ${event.text}; SCORE: ${score}`)
      }
    });

    stream.on('error', (error) => {
      throw error;
    });
  });
}

// TODO: Use application-only auth w/ bearer token
function getKeywordTweets() {
  client.get(`https://api.twitter.com/1.1/search/tweets.json?q=${process.env.KEYWORD}&src=typd`, {})
    .then(res => {
      const analyzedStatuses = res.statuses.map(({text}) => {
        const {score} = sentiment(text)

        let analysis = 'neutral'

        if (score <= -5) {
          analysis = 'very bad'
        } else if (score < 0) {
          analysis = 'bad'
        } else if (score >= 5) {
          analysis = 'very good'
        } else if (score > 0) {
          analysis = 'good'
        }

        return {text, sentiment: analysis}
      })

      console.log(analyzedStatuses)
    });
}

startStreaming();
