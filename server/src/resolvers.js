import { PubSub } from 'apollo-server-express';
import validator from 'validator';
import { isAuthenticated } from './auth';
import { User, Image, Room } from './schemas';
import { mongo } from 'mongoose';
import cookie from 'cookie';
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const pubSub = new PubSub();

const NEW_USER = 'NEW_USER';

// source: https://medium.com/@enespalaz/file-upload-with-graphql-9a4927775ef7
async function upload(id, args) {
    const { createReadStream, mimetype } = await args.file;
    if (!mimetype.includes('image')) throw new Error("File is not a valid image.");
    const fileStream = createReadStream();
    let uploadParams = {
        Bucket: 'cscc09-images',
        Key: id,
        Body: fileStream,
        ContentType: mimetype
    };
    try {
        await s3.upload(uploadParams).promise();
        return;
    } catch (err) {
        throw new Error("Server error.");
    }
}

const resolvers = {
    Query: {
        signOutUser: isAuthenticated((_, __, { req, res }) => {
            return new Promise(function (resolve, reject) {
                let username = req.session.username;
                req.session.destroy(function (err) {
                    if (err) return reject(new Error("Server error."));
                    res.setHeader('Set-Cookie', cookie.serialize('username', '', { path: '/', maxAge: 0 }));
                    return resolve(username);
                });
            });
        }),

        getGalleryOwners: isAuthenticated((_, { page, limit }) => {
            return new Promise(function (resolve, reject) {
                //if (!validator.isNumeric(page) || !validator.isNumeric(limit)) return reject(new Error("Bad user input."));
                User.find({}).sort({ _id: 1 }).skip(page * limit).limit(limit).exec(function (err, users) {
                    if (err) return reject(new Error("Server error."));
                    return resolve(users);
                });
            });
        }),

        getImages: isAuthenticated((_, { roomId }) => {
            return new Promise(function (resolve, reject) {
                if (!validator.isAlphanumeric(roomId)) return reject(new Error("Bad user input."));
                Room.findOne({ _id: roomId }).exec(function (err, room) {
                    if (err) return reject(new Error("Server error."));
                    if (!room) return reject(new Error("Room does not exist."));
                    Image.find({ roomId: roomId }).sort({ date: 1 }).limit(4).exec(function (err, images) {
                        if (err) return reject(new Error("Server error."));
                        return resolve(images);
                    });
                });
            });
        }),

        getFirstRoom: isAuthenticated((_, { galleryOwner }) => {
            return new Promise(function (resolve, reject) {
                if (!validator.isAlphanumeric(galleryOwner)) return reject(new Error("Bad user input."));
                Room.find({ username: galleryOwner }).sort({ date: 1 }).limit(1).exec(function (err, rooms) {
                    if (err) return reject(new Error("Server error."));
                    // A room is created when the user signs up.
                    if (rooms.length < 1) return reject(new Error("Gallery owner does not exist."));
                    return resolve(rooms[0]);
                });
            });
        }),

        getRoom: isAuthenticated((_, { roomId, next }) => {
            return new Promise(function (resolve, reject) {
                if (!validator.isAlphanumeric(roomId) || (next != true && next != false))
                    return reject(new Error("Bad user input."));

                Room.findOne({ _id: roomId }).exec(function (err, room) {
                    if (err) return reject(new Error("Server error."));
                    if (!room) return reject(new Error("Room does not exist."));
                    let retrieveRoom = function (err, rooms) {
                        if (err) return reject(new Error("Server error."));
                        if (rooms.length < 1) return reject(new Error("No content."));
                        return resolve(rooms[0]);
                    };

                    if (!next) Room.find({ date: { $lt: room.date }, username: room.username }).sort({ date: -1 }).limit(1).exec(retrieveRoom);
                    else Room.find({ date: { $gt: room.date }, username: room.username }).sort({ date: 1 }).limit(1).exec(retrieveRoom);
                });
            });
        }),
    },

    Mutation: {
        signUpUser: ((_, { _id, password }) => {
            return new Promise(function (resolve, reject) {
                if (!validator.isAlphanumeric(_id) || validator.isEmpty(password))
                    return reject(new Error("Bad input."));

                User.findOne({ _id }, function (err, user) {
                    if (err) return reject(new Error("Server error."));
                    if (user) return reject(new Error("Username has already been taken."));
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) return reject(new Error("Server error."));
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) return reject(new Error("Server error."));

                            let newUser = new User({
                                _id: _id,
                                password: hash
                            });
                            newUser.save(function (err) {
                                if (err) return reject(new Error("Server error."));
                                pubSub.publish(NEW_USER, { userAdded: newUser });

                                let room = new Room({
                                    username: newUser,
                                    date: new Date()
                                });
                                room.save(function (err) {
                                    if (err) return reject(new Error("Server error."));
                                    else return resolve(newUser);
                                });
                            });
                        });
                    });
                });
            });
        }),

        signInUser: ((_, { _id, password }, { req, res }) => {
            return new Promise(function (resolve, reject) {
                if (!validator.isAlphanumeric(_id) || validator.isEmpty(password))
                    return reject(new Error("Bad user input."));

                User.findOne({ _id }, function (err, user) {
                    if (err) return reject(new Error("Server error."));
                    if (!user) return reject(new Error("Username does not exist."));
                    bcrypt.compare(password, user.password, function (err, valid) {
                        if (err) return reject(new Error("Server error."));
                        if (!valid) return reject(new Error("Access denied."));
                        req.session.username = _id;
                        res.setHeader('Set-Cookie', cookie.serialize('username', req.session.username, {
                            path: '/',
                            maxAge: 60 * 60 * 24  // 1 day in number of seconds
                        }));
                        return resolve(user);
                    });
                });
            });
        }),

        addRoom: isAuthenticated((_, __, { req }) => {
            return new Promise(function (resolve, reject) {
                let room = new Room({
                    username: req.session.username,
                    date: new Date()
                });
                room.save(function (err) {
                    if (err) return reject(new Error("Server error."));
                    else return resolve(room);
                });
            });
        }),

        uploadImage: isAuthenticated((_, args, { req }) => {
            return new Promise(function (resolve, reject) {
                let roomId = args.roomId;
                if (!validator.isAlphanumeric(roomId)) return reject(new Error("Bad user input."));
                let id = mongo.ObjectId().toString();

                Room.findOne({ _id: roomId }).exec(function (err, room) {
                    if (err) return reject(new Error("Server error."));
                    if (!room) if (err) return reject(new Error("Room does not exist."));
                    if (room.username !== req.session.username) return reject(new Error("User is not permitted to upload an image in this room."));
                    Image.find({ roomId: roomId }).countDocuments().exec(function (err, count) {
                        if (err) return reject(new Error("Server error."));
                        if (count >= 4) return reject(new Error("Bad user input."));

                        upload(id, args).then(function () {
                            let image = new Image({
                                _id: id,
                                roomId: roomId,
                                date: new Date()
                            })
                            image.save(function (err) {
                                if (err) return reject(new Error("Server error."));
                                else {
                                    return resolve(image);
                                }
                            });
                        }).catch(function (error) {
                            return reject(error);
                        });
                    });
                });
            })
        })
    },

    Subscription: {
        userAdded: {
            subscribe: (_, __, { connection }) => {
                if (!connection.context.req.session.username) throw new Error('User is not authenticated.');
                else return pubSub.asyncIterator([NEW_USER]);
            }
        },
    }
};

export { resolvers };