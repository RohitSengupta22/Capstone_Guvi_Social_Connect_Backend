const mongoose = require('mongoose');
async function connect(){

   await mongoose.connect('mongodb+srv://chintsrsg:Bealive%405794@rohitblogapp.uiiqgld.mongodb.net/Social_Media')
.then(() => console.log("Successfully Connected"));

}

module.exports = connect;