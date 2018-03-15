const express = require("express");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const expressEnforcesSSL = require("express-enforces-ssl");
// const PORT = 3001;
const PORT = process.env.PORT || 3001;
//
const http = require("http");
const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const uuidv1 = require("uuid/v1");
// const MongoClient = require("mongodb").MongoClient;
// const MONGODB_URI = "mongodb://localhost:27017/polaris";
//

const app = express();

// Initialize an express app with some security defaults
app.use(https).use(helmet());

//cookie sesions
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

// Application-specific routes
// Add your own routes here!
// app.get("/example-path", async (req, res, next) => {
//   res.json({ message: "Hello World!" });
// });
app.get('/token/:id', (req, res) => {
  req.session.token = req.params.id;
  console.log(req.session);
  res.send(JSON.stringify({
    token: req.session.token
  }));
})

// Serve static assets built by create-react-app
app.use(express.static("build"));

//connect to mongodb
// MongoClient.connect(MONGODB_URI, (err, db) => {
//   if(err) {
//     console.error('Failed to connect.');
//     throw err;
//   }

//   console.log('Connected to mongodb.');

  app.get("/danny", (req, res) => {
    // db.collection('rooms').insertOne({ id: 1, creator: 'creator', content: 'content', sha: 'sha', token: 'token' });
    console.log('In')
    res.status(211).send(JSON.stringify('Weird'));
  })
  // If no explicit matches were found, serve index.html
  app.get("*", function(req, res) {
    res.sendFile(__dirname + "/build/index.html");
  });

  app.use(notfound).use(errors);

  //
  // Create the WebSockets server
  const server = http.createServer(app);
  var serverOnPort = server.listen(PORT);
  const wss = new SocketServer({ server: serverOnPort });

  // Set up a callback that will run when a client connects to the server
  // When a client connects they are assigned a socket, represented by
  // the ws parameter in the callback.

  // let userCount = 0;

  // wss.on("connection", ws => {
  //   console.log("Client connected");

  //   userCount++;
  //   console.log("userCount:", userCount);

  //   //add userCount (to parsedMessage) to be passed to each client
  //   let userCountObj = {
  //     type: "userCount",
  //     userCount: userCount
  //   };

  //   console.log("userCountObj:", userCountObj);

    //send message to client (userCount number)
  var codebase = {
    // id: "",
    polaris: {
      content: `
      Welcome to Polaris.
      Please log in with your GitHub account.
      `
    }
    
  };
  wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.roomID = 'polaris';
    ws.send(JSON.stringify(codebase[ws.roomID]));
    ws.on('message', (message) => {
      const newMsg = JSON.parse(message);
      if(!newMsg.type) {
        codebase[newMsg.roomID].content = newMsg.content;
        // console.log(wss.clients);
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === ws.OPEN && client.roomID === ws.roomID) {
            client.send(JSON.stringify(codebase[newMsg.roomID]));
          }
        });
      } else if(newMsg.type === 'system') {
        ws.roomID = newMsg.roomID;
        if(codebase[ws.roomID]) {
        } else {
          codebase[ws.roomID] = {
            content: ""
          }
        }
        ws.send(JSON.stringify(codebase[ws.roomID]));
        console.log(ws.roomID);
      }
    })

    //error catcher
    ws.on("error", () => console.log("errored"));


    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => {
      console.log('Client disconnected');
      // const msg = { name: username, type: 'incomingLogOut', userCount: wss.clients.size, id: uuidv4() };
      // wss.clients.forEach(function each(client) {
      //   if (client !== ws && client.readyState === ws.OPEN) {
      //     client.send(JSON.stringify(msg));
      //   }
      // });

    });

  });

  //
  
  // app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  server.listen(PORT, () => console.log(`Listening on ${PORT}`));
  
// });

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