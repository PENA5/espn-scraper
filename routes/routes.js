const express = require("express");
const app = express.Router();
const db = require('../models/')
var axios = require("axios");
var cheerio = require("cheerio");

app.get("/", (req, res) => {
  db.Article
  .find({saved: false})
  .then(function(dbArticle){
    var hbsObject= {
      articles: dbArticle
    };
  res.render('index', hbsObject);
})
.catch(function(err) {
  res.json(err);
});
});

app.get("/scrape", function (req, res) {
  console.log("scraping");
  
  axios.get("http://www.espn.com/").then(function (response) {
    
    var $ = cheerio.load(response.data);
    
    $("article").each(function (i, element) {
      var result = {};
      
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
     
      db.Scrape.create(result)
        .then(function (dbArticle) {
         
          res.redirect("/scrapes");
          console.log(dbArticle);
        })
        .catch(function (err) {
        
          return res.json(err);
        });
    });

    console.log("scrape done");
    // res.redirect('index', {});
    // res.json({
    //   result: 'scrape done'
    // });

  });
});


app.get("/scrapes", function (req, res) {
  console.log("app.get/scrapes");
 
  db.Scrape.find({})
    .then(function (data) {
      var results = {
        articles: data,
        saved:true

      }
     
      // res.json(results);
      console.log(data[0].title);
      console.log(data[0].id);

      res.render('articles', results);
      // res.render('articles', {articles : JSON.stringify(dbArticle)});

    })
    .catch(function (err) {
      res.json(err);
    });
});


app.get("/articles", function (req, res) {
  console.log("app.get/articles");
 
  var saved = true;
  db.Article.find({})
    .then(function (data) {
      var results = {
        articles: data,
        saved: false
      }
      
      // res.json(results);
      console.log(data[0].title);
      console.log(data[0].id);

      res.render('articles', results);
      // res.render('articles', {articles : JSON.stringify(dbArticle)});

    })
    .catch(function (err) {
      res.json(err);
    });
});


app.post("/articles/", function (req, res) {
  db.Article.create(req.body)
    .then(function (data) {

      console.log(data);
      // var results = {
      //   article: data,
      //   note: data.notes
      // }
      res.send(data);
    })
    .catch(function (err) {
      return res.json(err);
    });
});


app.get("/articles/:id", function (req, res) {
  console.log("APP.GET /articles/:id populated");
  
  db.Article.findOne({
      _id: req.params.id
    })

    .populate("notes")
    .then(function (data) {

      console.log(data);
      var results = {
        article: data,
        note: data.notes
      }
      res.render('article', results);
      // console.log(data);
      // res.json(data);

      // res.json(dbArticle);

    })
    .catch(function (err) {
      res.json(err);
    });
});


app.post("/notes/:id", function (req, res) {

  console.log("/notes/:id to POST a note to an article");
  db.Note.create(req.body)
    .then(function (dbNote) {

      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          notes: dbNote._id
        }
      }, {
        new: true
      });

    })
    .then(function (data) {
      var results = {
        note: data

      }
      res.render('article', results);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.put("/notes/:id", function (req, res) {
  console.log("updating the note");
  db.Note.update({
      "_id": req.params.id
    }, {
     
      $set: {
        "title": req.body.title,
        "body": req.body.body
      }
    },
    
    function (error, edited) {
    
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(edited);
        var results = {
          note: edited
        }
        res.render('article', edited);
        // res.send(edited);
      }
    });
});



app.delete("/notes/:noteid/:articleid", function (req, res) {
  console.log("removing the note from article");

  db.Article.update({
      "_id": req.params.articleid
    }, {
      
      "$pull": {
        "notes": req.params.noteid
      }
    },
    function (error, deleted) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("note removed from article");
        db.Note.findByIdAndRemove(req.params.noteid, function (err, removed) {
          if (err)
            res.send(err);
          else
            res.json({
              removed: 'note Deleted!'
            });

        }); //end findByIdAndRemove
      } 
    }); 

}); 


app.get("/notes/:id", function (req, res) {
  console.log("APP.GET /notes/:id");
  
  db.Note.findOne({
      _id: req.params.id
    })
    .then(function (data) {

      console.log(data);
      // var results = {
      //   note: data.note
      // }
      // res.render('create.note', results);
      console.log(data);
      res.json(data);

      // res.json(dbArticle);

    })
    .catch(function (err) {
      res.json(err);
    });
});


module.exports = app;