const MongoClient = require('mongodb').MongoClient;
const url  = 'mongodb://localhost:27017'
const {ObjectId} = require('mongodb'); 

    MongoClient.connect(url,async(err,db) => {
        if(err) throw err;
        var dbo = db.db('lhs');
        var User =  dbo.collection('users')
        var Races = dbo.collection('round_to_races')
        var Horses = dbo.collection('race_participant')
        const user_selection = dbo.collection('user_selections')
        const users = await User.find().toArray();
        const events = await Promise.all(
            users.map(async(user) => {
                  const tournament = ObjectId("62a32ba1f264b23072eb7b32");
                  const round = ObjectId("62a345a52240b015851d6f92") ;
                  const newRace = await Races.find({roundId : "62a345f02240b015851d7568"}).limit(4).toArray();
                  const selection = await Promise.all(newRace.map(async(race) => {
                        const horses = await Horses.find({race : ObjectId(race.raceId)}).toArray()
                        var randomhorse = horses[Math.floor(Math.random()*horses.length)];
                        const horseSelected = randomhorse._id;
                        const raceId = ObjectId(race._id) ;
                        var id = new ObjectId();
                        const user_selection = {
                            raceId : raceId,
                            horseSelected : horseSelected,
                            _id : id
                        }
                        return user_selection
                  }))
                 const data = {
                     user: user._id,
                     tournament : tournament,
                     round : round,
                     races : selection
                 }
               await user_selection.insertOne(data)
            })
        )
        
        // console.log(data,"xczxcata")
    })


