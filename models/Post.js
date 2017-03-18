const sentiment = require('sentiment')

function analyze(posts) {
  console.log(`Post.analyze: posts = `, posts)

  return posts.map(post => ({
    post,
    sentiment: sentiment(post)
  }))
}

module.exports = {
  analyze
}
