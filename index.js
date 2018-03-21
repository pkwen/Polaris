const express = require("express");
const helmet = require("helmet");
const expressEnforcesSSL = require("express-enforces-ssl");
// const PORT = 3001;
const PORT = process.env.PORT || 3001;
//
const http = require("http");
const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const uuidv1 = require("uuid/v1");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI =
  "mongodb://heroku_gzrz45rc:qj6deuc7i8bf0iaklikem8fql9@ds125555.mlab.com:25555/heroku_gzrz45rc";
//

const app = express();

// Initialize an express app with some security defaults
app.use(https).use(helmet());

//cookie sesions
// app.get("/example-path", async (req, res, next) => {
//   res.json({ message: "Hello World!" });
// });
// app.get("/token/:id", (req, res) => {
//   req.session.token = req.params.id;
//   console.log(req.session);
//   res.send(
//     JSON.stringify({
//       token: req.session.token
//     })
//   );
// });

// Serve static assets built by create-react-app
app.use(express.static("build"));

//connect to mongodb
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error("Failed to connect.");
    throw err;
  }
  console.log("Connected to mongodb.");

  // If no explicit matches were found, serve index.html
  app.get("*", function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
  });

  app.use(notfound).use(errors);

  // Create the WebSockets server
  const server = http.createServer(app);
  var serverOnPort = server.listen(PORT);
  const wss = new SocketServer({ server: serverOnPort });

  //send message to client (userCount number)
  var codebase = {
    polaris: {
      roomID: "polaris",
      content: "Welcome to Polaris.Please log in with your GitHub account.",
      sha: "randomString",
      branch: "master"
    },

    danny: {
      roomID: "danny",
      content: "ugh... just lemme get five more minutes...",
      sha: "unbruteforceablehash"
    },

    michael: {
      roomID: "michael",
      content: "vancouver > toronto, apparently",
      sha: "plsdontnameme"
    }
  };
  // initiate database with sample data
  // for(let i in codebase) {
  //   db.collection('rooms').insertOne(codebase[i]);
  // }

  // find all rooms in mongo collection
  const findAllRooms = callback => {
    db
      .collection("rooms")
      .find({})
      .toArray((err, res) => {
        callback(res);
      });
  };

  // load each room's info into server
  const syncServer = res => {
    if (err) throw new Error("Database sync failed.");
    res.forEach(room => {
      codebase[room.roomID] = room;
    });
  };

  // load all rooms from mongo to codebase variable
  findAllRooms(syncServer);
  setTimeout(() => {
    console.log(codebase);
  }, 2000);

  const intervalSync = callback => {
    for (let j in codebase) {
      if (codebase[j].content) {
        db
          .collection("rooms")
          .update({ roomID: codebase[j].roomID }, codebase[j], {
            upsert: true
          });
      }
    }
    callback(null, true);
    console.log("Data back-up sync complete.");
  };

  setInterval(() => {
    intervalSync(err => {
      console.log(err);
    });
  }, 60000*15);

  // const getRoom = (roomID, callback) => {
  //   db.collection('rooms').find({ roomID: roomID }).toArray((err, res) => {
  //     callback(err, res);
  //   });
  // };

  // const saveRoom = (room, callback) => {
  //   db.collection('rooms').insertOne(room);
  //   callback(null, true);
  // }

  // const syncContent = (roomID, change, callback) => {
  //   db.collection('rooms').update({ roomID: roomID }, { $set: { content: change.content }});
  //   callback(null, true);
  // }

  // const syncBranch = (roomID, change, callback) => {
  //   db
  //     .collection("rooms")
  //     .update(
  //       { roomID: roomID },
  //       { $set: { branch: change.branch } }
  //     );
  //     callback(null, true);
  // }

  // const syncSha = (roomID, change, callback) => {
  //   db
  //     .collection("rooms")
  //     .update(
  //       { roomID: roomID },
  //       { $set: { sha: change.sha } }
  //     );
  //     callback(null, true);
  // };

  // const collection = db.collection('rooms');
  // collection.insert(codebase.polaris, (err, res) => {
  //   collection.find().toArray((err, res) => {
  //     console.log(res);
  //   });
  // });

  wss.on("connection", ws => {
    console.log("Client connected");
    ws.roomID = "polaris";
    ws.send(JSON.stringify(codebase[ws.roomID]));
    ws.on("message", message => {
      const newMsg = JSON.parse(message);
      if (!newMsg.type && typeof newMsg.content === 'string') {
        codebase[newMsg.roomID].content = newMsg.content;
        if (newMsg.sha) {
          codebase[newMsg.roomID].sha = newMsg.sha;
        }
        if (newMsg.branch) {
          codebase[newMsg.roomID].branch = newMsg.branch;
        }
        // console.log(wss.clients);
        wss.clients.forEach(function each(client) {
          if (
            client !== ws &&
            client.readyState === ws.OPEN &&
            client.roomID === ws.roomID
          ) {
            client.send(JSON.stringify(codebase[newMsg.roomID]));
          }
        });
      } else if (newMsg.type === "system") {
        ws.roomID = newMsg.roomID;
        if (codebase[ws.roomID]) {
        } else {
          codebase[ws.roomID] = {
            roomID: ws.roomID,
            content: `/* Welcome to Polaris Editor.\n\tLet's get right into it! */`,
            sha: ""
          };
        }
        ws.send(JSON.stringify(codebase[ws.roomID]));
      }
    });

    //error catcher
    ws.on("error", () => console.log("errored"));

    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on("close", () => {
      console.log("Client disconnected");
      // const msg = { name: username, type: 'incomingLogOut', userCount: wss.clients.size, id: uuidv4() };
      // wss.clients.forEach(function each(client) {
      //   if (client !== ws && client.readyState === ws.OPEN) {
      //     client.send(JSON.stringify(msg));
      //   }
      // });
    });
  });

  // app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  server.listen(PORT, () => console.log(`Listening on ${PORT}`));
});

function https(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers["x-forwarded-proto"];
    if (proto === "https" || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get("Host")}${req.originalUrl}`);
  } else {
    return next();
  }
}

function notfound(req, res, next) {
  res.status(404).send("Not Found");
}

function errors(err, req, res, next) {
  console.log(err);
  res.status(500).send("something went wrong");
}
