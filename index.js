require('dotenv').config()
var express = require('express');
const app = express()
var router = express.Router();
var mongoose = require('mongoose');
var Movie = require('./models/models');
// const jwt = require("jsonwebtoken")
// const jwtSecret =
//   "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd"
const {userAuth,adminAuth} =require('./userAuth')
// require('./routes/movies')
const cookieParser = require("cookie-parser");
// ...
app.use(cookieParser());




// THis is used to create token for user
//Sample token
// jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbmR5Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjUxNTgyMzA3LCJleHAiOjE2NTE4ODIzMDd9.FPibEs5AkQEqh92lXKh5KC5oB2FN7GFZUc2QRAKU-DU;
// const token = jwt.sign(
//     { username:"sandy", role: "admin" },
//     jwtSecret,
//     {
//       expiresIn: 300000, // 3hrs in sec
//     }
//   );
// console.log(token)

const port = process.env.PORT|| 3005

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})



/* GET home page. */
app.get('/list', adminAuth,function(req, res, next) {
  console.log("yess",process.env.DB_HOST)
  mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true },(err,db)=>{
      if(err){
        console.error('error connecting to db: ', err.errmsg);
      }
      else{
        console.log("connected to database");
        Movie
        .find()
        .sort('name')
        .then(movies => {
          res.status(200).send(movies );
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
          });
        });
      }

  })



});

// Sample Data load
app.get('/make', adminAuth,function (req, res, next) {
    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
      .then(() => console.log('connected to the database'))
      .catch(err => console.error('error connecting to db: ', err.errmsg));
  
    // Make two example movies to populate the database
    let timestamp=new Date(2022, 1, 2)
    // console.log(d)
    var movie1 = new Movie({
      name: 'Alien',
      releaseDate: timestamp,
      rating: 1,
      cast:["sandy","rocky"],
      Genre:"Romance"
    });
    var movie2 = new Movie({
      name: 'Jaws',
      releaseDate: timestamp,
      rating: 2,
      cast:["sandy","sandeysh"],
      Genre:"Comedy"
    });

    movie1.save(function (err) {
      if (err) throw err;
    });
    movie2.save(function (err) {
      if (err) throw err;
    });
    res.status(200).json({message:"Loaded Successfully"});
  });
  



  // DELETE
app.delete('/delete/:id', adminAuth,function (req, res, next) {

    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
      .then(() => console.log('connected to the database'))
      .catch(err => console.error('error connecting to db: ', err.errmsg));
  
    Movie.deleteOne({ _id: req.params.id })
      .then(() => {
        console.log('worked');
        res.status(200).json({id:movies.id,message:"Deleted Successfully"});
      }).catch(err => {
        console.log('did not work');
        res.status(500).send({
          message: err.message || "Some error occurred while deleting the movie entry."
        });
      });
  });


// POST
app.post('/add', adminAuth,function (req, res, next) {

    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
      .then(() => console.log('connected to the database'))
      .catch(err => console.error('error connecting to db: ', err.errmsg));
  
    // Validate request
    if (!req.body.name) {
      return res.status(400).send({
        message: "Movie content can not be empty"
      });
    }
  
    // Create a Movie
    const movie = new Movie({
      name: req.body.name,
      rating: req.body.rating,
      cast:req.body.cast,
      Genre:req.body.Genre,
      releaseDate: req.body.releaseDate,
    });
  
    // Save Movie in the database
    movie.save()
      .then(movies => {
        res.status(200).json({id:movies.id,message:"Loaded Successfully"});
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the movie entry."
        });
      });
  });


  app.post('/update/:id',adminAuth, function (req, res, next) {
    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true })
    .then(() => console.log('connected to the database'))
    .catch(err => console.error('error connecting to db: ', err.errmsg));
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Movie content can not be empty"
        });
    }

    Movie.updateOne({ _id:req.params.id },{ name: req.body.name, rating: req.body.rating, cast:req.body.cast, Genre:req.body.Genre, releaseDate: req.body.releaseDate})
    .then(() => {
      res.status(200).json({message:"Updated Successfully"});
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the movie entry."
      });
    });

  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


module.exports = router;

