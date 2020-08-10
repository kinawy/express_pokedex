// variable for express
const express = require("express");
// variable for the express router
const router = express.Router();
// variable for axios
const axios = require("axios");
// variable for my models aka database in psql
const db = require("../models");

// GET /pokemon - return a page with favorited Pokemon
router.get("/", (req, res) => {
  // get the records from my database, render to view
  db.pokemon
    .findAll()
    .then((poke) => {
      // render my index.ejs page from my pokemon folder inside views, assign the pokemon to a pokemon object, // this is my favorites page
      res.render("pokemon/index", { pokemon: poke });
    })
    .catch((error) => {
      console.log("Error", error);
      res.render("Error");
    });
});

// this one renders my show page, where I have a little crappy pokemon card
router.get("/:id", (req, res) => {
  // finds in my database where the id matches the request
  db.pokemon
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((poke) => {
      // then grab the url again and change their dataValues.name to lower case so they can be added on to the end of the API call, then I get it again inside another axios call, wwhere I do a then.
      let pokeUrl =
        "http://pokeapi.co/api/v2/pokemon/" +
        poke.dataValues.name.toLowerCase();
      axios
        .get(pokeUrl)
        .then((response) => {
          // set a variable for the new data, render pokemon/show.ejs and give it the pokeData object to be used on the page
          let pokeData = response.data;
          console.log(pokeData.stats);

          res.render("pokemon/show", { pokeData: pokeData });
        })
        // THIS ONE WAS SUCH A PAIN IN THE ASS, didn't realize I needed a second catch for so damn long, I spent more time on that than I did anything else
        .catch((error) => {
          console.log("Error", error);
        });
    })
    .catch((error) => {
      console.log("Error", error);
    });
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post("/", (req, res) => {
  // creates the pokemon in my database, gives it the name of req.body.name, which is its name
  console.log(req.body);
  db.pokemon
    .findOrCreate({
      name: req.body.name,
    })
    .then((poke) => {
      console.log("Created: ", poke.name);
      // then redirects the call to my favorites page
      res.redirect("/pokemon");
    });
});

router.delete("/:id", (req, res) => {
  // uses the destroy function to remove a pokemon from my database, not working though
  db.pokemon
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((poke) => {
      console.log("Deleted " + poke.name + " from favorites.");
      // then redirects to the favorites page again
      res.redirect("/pokemon");
    })
    .catch((error) => {
      console.log("Error", error);
    });
});

module.exports = router;
