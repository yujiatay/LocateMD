var http = require("http");
var admin = require("firebase-admin");
// Get serviceAccountKey from firebaseconsole
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://locatemd.firebaseio.com"
});

admin
  .auth()
  .verifyIdToken(token)
  .then(function(decodedToken) {
    console.log(decodedToken.uid);
  })
  .catch(function(error) {
    // Handle error
  });

// Use admin rights to list users
admin.auth().createUser;
admin
  .auth()
  .listUsers(1000)
  .then(function(listUsersResult) {
    listUsersResult.users.forEach(function(userRecord) {
      console.log("user", userRecord.toJSON());
    });
  })
  .catch(function(error) {
    console.log("Error listing users:", error);
  });


http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World!");
  })
  .listen(8080);

console.log("Server started at localhost:8080");
