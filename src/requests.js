import gql from 'graphql-tag';

export const signInMutation = `mutation($_id: String!, $password: String!) { 
    signInUser(_id: $_id, password: $password) { 
        _id 
    }
}`;

export const signUpMutation = `mutation($_id: String!, $password: String!) { 
    signUpUser(_id: $_id, password: $password) {
         _id 
    }
}`;

export const signOutQuery = `query {
  signOutUser
}
`;

export const galleryOwnersQuery = gql`query($page: Int, $limit: Int) {
    getGalleryOwners(page: $page, limit: $limit) {
        _id
    }
  }
`;

export const galleryOwnerSubscription = gql`subscription {
    userAdded {
        _id
    }
  }
`;

export const uploadImageMutation = gql`mutation ($file: Upload!, $roomId: String!) {
    uploadImage(file: $file, roomId: $roomId) {
      _id
    }
  }
`;

export const addRoomMutation = gql`mutation {
  addRoom {
    _id
  }
}
`;

export const getRoomQuery = gql`query($roomId: String!, $next: Boolean!) {
  getRoom(roomId: $roomId, next: $next) {
    _id
  }
}
`;

export const getFirstRoomQuery = gql`query($galleryOwner: String!) {
  getFirstRoom(galleryOwner: $galleryOwner) {
    _id
  }

}`

export const imagesQuery = gql`query($roomId: String!) {
    getImages(roomId: $roomId) {
      _id
  }
}
`;
