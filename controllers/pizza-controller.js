const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        escape.status(400).json(err);
      });
  },

  // get one pizza by ID
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
    .then(dbPizzaData => {
      // If no pizza is found, send 404
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this ID!' });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => {
      console.groupCollapsed(err);
      res.status(400).json(err);
    });
  },

  // createPizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  // update Pizza by ID
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this ID!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete Pizza by ID
  deletePizza({ params }, res) {
    Pizza.findByIdAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this ID!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = pizzaController;