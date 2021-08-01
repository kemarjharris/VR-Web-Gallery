const typeDefs = `
    type User {
        _id: String!
    }

    type File {
        _id: String!
        date: String!
        roomId: String!
    }

    type Room {
        _id: String!
    }

    type Query {
        getGalleryOwners(page: Int, limit: Int): [User!]!
        getImages(roomId: String!): [File!]!
        getRoom(roomId: String!, next: Boolean!): Room! 
        getFirstRoom(galleryOwner: String!): Room!
        signOutUser: String!
    }
    
    type Mutation {
       signInUser(_id: String!, password: String!): User!
       signUpUser(_id: String!, password: String!): User!
       uploadImage(file: Upload!, roomId: String!): File
       addRoom: Room!
    }

    type Subscription {
        userAdded: User!
    }
`;

export { typeDefs };
