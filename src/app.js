//required dependencies module to build the app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');//// get data from client
const { Client } = require('pg');
const SQL = require('sql-template-strings');

//path and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));

app.use(bodyParser.urlencoded({ extended: true }));

//setting up the client
const client = new Client({
	database: 'bulletinboard',
	host: 'localhost',
	user: process.env.POSTGRES_USER,
	// password: process.env.POSTGRES_PASSWORD
});
client.connect();

//render the homepage which is also the add messages form
app.get ('/', (req,res) => {
	res.render('index');
})

//post request to add new messages to the database 
app.post ('/submitMessage', (req,res) => {
	let newTitle = req.body.title;
	let newBody = req.body.body;
	client.query(SQL`insert into messages (title, body) values (${newTitle}, ${newBody})`, (err, result) => {
			console.log(err ? err.stack : 'New message has been added to the database')
	});
	res.redirect('/messages');
});

app.get ('/messages', (req,res) => {
	client.query('select * from messages', (err, result) => { // done it was because my table had a typo and there is data inside so i dont want to drop it. but i mange to rename the table without dropping which is good
		console.log(result.rows);
		if (err){
			throw err;
		}
		res.render('messages', {messages: result.rows});
	})
});

app.listen(3000, () => {
	console.log('Your Bulletin Board App is listening on port 3000!');
})
