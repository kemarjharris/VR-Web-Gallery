import mongoose from 'mongoose';

const prod = 'mongodb+srv://dbUser:dbUserPassword@web-gallery-6fwvj.mongodb.net/gallery?retryWrites=true&w=majority';

mongoose.connect(prod, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error));

const userSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    password: {
        type: String
    }
});

const User = mongoose.model('users', userSchema);

const imageSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    date: {
        type: Date
    },
    roomId: {
        type: String
    }
});

const Image = mongoose.model('images', imageSchema);

const roomSchema = new mongoose.Schema({
    username: {
        type: String
    },
    date: {
        type: Date
    }
});

const Room = mongoose.model('rooms', roomSchema);

export { User, Image, Room };
