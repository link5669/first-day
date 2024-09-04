import express from "express";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, update } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyAewTjlRA1Vteb197qOTU2xf_DkfMXV7lU",
    authDomain: "first-3537a.firebaseapp.com",
    databaseURL: "https://first-3537a-default-rtdb.firebaseio.com",
    projectId: "first-3537a",
    storageBucket: "first-3537a.appspot.com",
    messagingSenderId: "783639660224",
    appId: "1:783639660224:web:f12508fcd00d8784820f25"
};

const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);

const port = 5001;
const app = express();

let round = 0
let roundData = []

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/resetRounds", (req, res) => {
    round = 0
    res.status(200).send()
})

app.get("/getRound", (req, res) => {
    res.json(round)
})

app.get("/getRoundData", (req, res) => {
    const pd = req.query.pd;

    get(ref(db, `roundData`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.json(snapshot.val());
            } else {
                res.status(200).json({ error: 'Round data not found' });
            }
        })
        .catch((error) => {
            console.error('Error retrieving round data:', error);
            res.status(200).json({ error: 'Error retrieving round data' });
        });
});

app.post("/submitData", (req, res) => {
    const updates = {};
    const user = req.query.data.split('.')[1]
    const field = req.query.data.split('.')[2]
    updates[`${req.query.pd}/${user}/${field}`] = req.query.val;
    console.log(updates)
    return update(ref(db), updates);
});

app.get("/getPdData", (req, res) => {
    const pd = req.query.pd;

    get(ref(db, pd))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.json(snapshot.val());
            } else {
                res.status(200).json({ error: 'data not found' });
            }
        })
        .catch((error) => {
            console.error('Error retrieving data:', error);
            res.status(200).json({ error: 'Error retrieving data' });
        });
});

app.get("/newRound", (req, res) => {
    const pd = req.query.pd;

    get(ref(db, pd))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const keys = Object.keys(data);
                const newRoundData = [];

                for (let i = 0; i < keys.length; i++) {
                    const randKidIndex = Math.floor(Math.random() * keys.length);
                    const randKidKey = keys[randKidIndex];
                    const randKidValue = data[randKidKey];
                    const randStatIndex = Math.floor(Math.random() * 6);
                    const randStatKey = Object.keys(randKidValue)[randStatIndex];
                    const randStatValue = Object.values(randKidValue)[randStatIndex];

                    if (randStatValue === '') {
                        data[randKidKey][randStatKey] = 'Assigned!';
                        newRoundData.push(`${keys[i]}.${randKidKey}.${randStatKey}`);
                    }
                }

                round++;
                set(ref(db, `roundData`), newRoundData)
                    .then(() => {
                        res.json(newRoundData);
                    })
                    .catch((error) => {
                        console.error('Error saving round data:', error);
                        res.status(500).json({ error: 'Error saving round data' });
                    });
            } else {
                res.status(404).json({ error: 'Data not found' });
            }
        })
        .catch((error) => {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Error retrieving data' });
        });
});

app.get("/addChild", (req, res) => {
    get(ref(db, `${req.query.pd}/` + req.query.name))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                set(ref(db, `${req.query.pd}/` + req.query.name), {
                    'school subject': "",
                    'thing they did this summer': "",
                    'music genre': "",
                    'TV show': "",
                    'animal': "",
                    'secret talent': ""
                });
            }
        })

    res.status(200).send()
})

app.listen(port, () => console.log(`Server listening on port ${port}`));



