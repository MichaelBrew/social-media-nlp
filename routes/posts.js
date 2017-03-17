const router = require('express').Router();
const sentiment = require('sentiment');

router.post('/analyze', (req, res, next) => {
  const analyzedPosts = req.body.map(post => ({
    post,
    sentiment: sentiment(post)
  }));

  res.send(analyzedPosts);
});

module.exports = router;
