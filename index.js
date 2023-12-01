require('dotenv').config();
const connect = require('./DB/Connection.js')
const express = require('express')
const cors = require('cors');
const Post = require('./Schemas/Posts.js')

const UserRouter = require('./Router/UserRoutes.js')
const PostRouter = require('./Router/PostRoutes.js')
const app = express()
const port = process.env.PORT || 3002

connect();




app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.use('/users',UserRouter);
app.use('/posts',PostRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})