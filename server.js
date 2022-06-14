const MongoClient = require('mongodb').MongoClient;
const url  = 'mongodb://localhost:27017'
const {ObjectId} = require('mongodb'); 
let object = new ObjectId();
const timestamp = object.getTimestamp();

MongoClient.connect(url,async(err,db) => {
    if(err) throw err;
    var dbo = db.db('lhs');

    //to create users
    var User =  dbo.collection('users')
    const number_of_users = 2000;
    for(i = 0;i<number_of_users;i++){
        const email = "users" + i + "@example.com";
        const user_collection = {}
        user_collection.email = email;
        user_collection.password = "$2b$12$wy3SJIUe4uxS1tg4EpwCueM9xX6J0dd5qDOrvmscMAuxekdWynWou";
        user_collection.isAdmin = false;
        user_collection.lockoutEnabled = false;
        user_collection.accessFailedCount = 0;
        user_collection.ageVerified = false;
        user_collection.marketingPreferences = [
            "EMAIL",
            "SMS",
            "PHONE"
            ];
        user_collection.status = "VERIFIED";
        user_collection.notificationToken = "fJh6m819fEjiofMmx7eQtu:APA91bGtu72NZ7ATJNykXx0i7KVVOASY3bsw-oQXDW77gBtQVKPzWPi70DsOcxuN2DSToCp2l92mGzIf3FL96W1MgRQ2v9n0BxmDTEFF1k4zqwzUbrdRZvWone77-nFwt9Vljy67anaU";
        user_collection.createdAt =  timestamp;
        user_collection.updatedAt = timestamp;
        user_collection.address =  {
            "addressLine1": "18 Millfield Lane",
            "addressLine2": "Tarporley",
            "city": "Tarporley",
            "postcode": "Cw6 0bf"
            };
            user_collection.dob =  "23-04-1994";
            user_collection.firstName =  "George";
            user_collection.lastName =  "Daly";
            user_collection.phoneNumber =  "07977567115";
            user_collection.lockoutExpires =  null

            await User.insertOne(user_collection)
        }

    //to create user-selection
    var Races = dbo.collection('round_to_races')
    var Horses = dbo.collection('race_participant')
    const user_selection = dbo.collection('user_selections')
    
    const users = await User.find().toArray();
    await Promise.all(
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
                const horse_selection = {
                    raceId : raceId,
                    horseSelected : horseSelected,
                    _id : id
                }
                return horse_selection
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
})


