const express = require('express');
const bodyParser = require('body-parser');
var _ = require('underscore');
const mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


const Schema = new mongoose.Schema({
	author: String,
	title: String,
	url: String
});

const Blog = mongoose.model('Blog', Schema);



// ROUTES

app.get('/api/blogs', async(req, res) => {
	try {
		const items = await Blog.find();
		items.forEach((item) => {
		  console.log("Received a GET request for _id: " + item._id);
		});
		res.send(items);
	  } catch (err) {
		console.error(err);
		res.status(500).send(err); // Handle errors appropriately
	  }
	});

app.post('/api/blogs', async(req, res) => {
	console.log('Received a POST request:')
	console.log(req.body)
	const blog = new Blog(req.body);
	await blog.save();
});

app.delete('/api/blogs/:id', async (req, res)=> {
	console.log('Received a DELETE request for _id: ' + req.params.id);
	try{
	const result = await Blog.deleteOne({_id: req.params.id});
		if(result.deletedCount == 1){
			res.send({_id: req.params.id});
		}else{
			res.status(404).send('blog not found');
		}
	}catch(err){
		console.error(err);
		res.status(500).send(err);
	}
});

app.put('/api/blogs/:id', (req, res) => {
	console.log('Received an UPDATE request for _id: ' + req.params.id);
	Blog.updateOne({ _id: req.params.id }, req.body, (err)=> {
		if(err){
			console.error(err);
			res.status(500).send(err);
		}else{
		res.send({_id: req.params.id});
		}
	});
});

const port = 3000;


mongoose.connect('mongodb://localhost/blogroll', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log('Server is running on port ' + port);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });