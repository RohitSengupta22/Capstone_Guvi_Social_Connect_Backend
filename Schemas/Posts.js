const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username :{

    type: String

  },
  commentText: {
    type: String,
    required: true
  }
});

const postSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
initials : {
  type: String
},
username : {

  type: String

},
dateTime : {

  type: String
},
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likedby : [String]
  ,

  comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
