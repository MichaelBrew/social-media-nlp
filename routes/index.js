const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.render('index', {env: process.env.NODE_ENV});
});

module.exports = router;
