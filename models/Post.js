const sentiment = require('sentiment')

function analyze(posts) {
  return posts.map(post => Object.assign({}, post, {
    sentiment: sentiment(post.message)
  }))
}

module.exports = {
  analyze
}
