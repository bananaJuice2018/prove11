/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling. 
 * They're for information purposes only.
 * 
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course. 
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
// Read json data from local file
var fs = require('fs');
var dummyData = JSON.parse(fs.readFileSync('./data/ta10-data.json', 'utf8')).avengers;
const ta03Routes = require('./routes/ta03'); 

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/fetchAll', function(req, res) {
   //let offset = req.query.offset;
   //let limit = req.query.limit;
   // let resData = dummyData.slice(offset, offset + limit);
   // const data = {results: resData, count: dummyData.length}
   const data = {results: dummyData, count: dummyData.length}
   res.json(data);
});

app.post('/insert', function(req, res) {
   const name = req.body.name;
   dummyData.push({'name': name});

   //=====Broadcast new name to all clients connected
   io.emit('new name', name);
   console.log("Emitting New Name =====", name);

   res.writeHead(302, {'Location': '/'});
   res.end();
});

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use('/', ta03Routes);
   //.listen(PORT, () => console.log(`Listening on ${ PORT }`));

server.listen(PORT, () => {

});

io.on('connection', function(socket) {
   console.log("New User Connected =====");

   socket.on("disconnect", function(s) {
      console.log("User Disconnected =====");
   });
});

io.listen(3000);