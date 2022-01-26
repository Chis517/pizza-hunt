const router = require('express').Router();
const commentController = require('../../controllers/comment-controller');
const commentRoutes = require('./comment-routes');
const pizzaRoutes = require('./pizza-routes');

// adds prefix of `/comments` to routes created from `comment-routes.js`
router.use('/comments', commentRoutes);
// adds prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/pizzas', pizzaRoutes);

module.exports = router;