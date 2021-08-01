import React from 'react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import { ApolloProvider, Mutation } from 'react-apollo';
import { uploadImageMutation, imagesQuery, addRoomMutation, getRoomQuery } from '../requests';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as queryString from 'query-string';
import SignOut from '../components/SignOut';
import { Button } from '@material-ui/core';

class Gallery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPage: false
        };

        this.uploadLink = createUploadLink({
            uri: 'http://localhost:4000/graphql',
            credentials: 'include'
        })

        this.apolloCache = new InMemoryCache();
        this.client = new ApolloClient({
            link: this.uploadLink,
            cache: this.apolloCache
        });

        this.fileUpload = ({ target: { files } }) => {
            return files[0]
        }
        this.GetRoom = this.GetRoom.bind(this);
        this.UploadImage = this.UploadImage.bind(this);
        this.AddRoom = this.AddRoom.bind(this);

        const parsed = queryString.parse(window.location.search);
        this.galleryOwner = parsed.galleryOwner;
        this.roomId = parsed.roomId;
        this.imageCount = 0;
        this.updates = [];
        this.images = [];
    }

    componentDidUpdate() {
        document.querySelector("#fey").addEventListener("loaded", function () {
            const parsed = queryString.parse(window.location.search);
            document.querySelector("#fey").setAttribute("networked-scene", "room: " + parsed.roomId);
            window.AFRAME.scenes[0].emit("connect");
        });
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    GetUsername() {

        // https://gist.github.com/rendro/525bbbf85e84fa9042c2https://gist.github.com/rendro/525bbbf85e84fa9042c2
        let entries = Object.fromEntries(document.cookie.split(/; */).map(c => {
            const [key, ...v] = c.split('=');
            return [key, decodeURIComponent(v.join('='))];
        }));
        return entries.username.replace(/\W/g, '');
    }

    GetRoom({ roomId, next, label }) {
        if (!roomId) return null;
        const { loading, error, data } = useQuery(getRoomQuery, {
            variables: { roomId, next },
            pollInterval: 500
        });
        if (error) return null
        if (loading) return <p>Loading...</p>;
        let destinationId = data.getRoom._id;
        const params = {
            galleryOwner: this.galleryOwner,
            roomId: destinationId
        }
        let query = queryString.stringify(params);

        return (
            <div>
                <Button variant="contained" onClick={() => {
                    window.location.replace(`/gallery?${query}`);
                }}>
                    {label}
                </Button>
            </div>
        )
    }

    AddRoom() {
        if (this.galleryOwner !== this.GetUsername()) return null;
        return (
            <Mutation mutation={addRoomMutation}>
                {
                    (addRoom) => {
                        return (
                            <Button variant="contained" onClick={addRoom}>Add Room</Button>
                        )
                    }
                }
            </Mutation>
        )
    }

    UploadImage() {
        if (!this.roomId) return null;
        if (this.GetUsername() !== this.galleryOwner) return null;
        let roomId = this.roomId;
        const { loading, error, data } = useQuery(imagesQuery, {
            variables: { roomId },
        });
        if (error) return <p>Error: {error.message}</p>;
        if (loading) return <p>Loading...</p>;
        if (data) {
            if (data.getImages.length >= 4) return null;
            if (this.images.length + this.updates.length >= 4) return null;
            return (
                <Mutation mutation={uploadImageMutation}>
                    {
                        (uploadFile, { data, loading }) => {
                            return (
                                <form onSubmit={this.fileUpload} encType={'multipart/form-data'}>
                                    <input name={'document'} type={'file'}
                                        onChange={({ target: { files } }) => {
                                            const file = files[0]
                                            file && uploadFile({ variables: { file: file, roomId: this.roomId } })
                                            if (loading) return;
                                            this.forceUpdate();
                                        }}
                                    />
                                    {loading && <p>Loading.....</p>}
                                </form>
                            )
                        }
                    }
                </Mutation>
            )
        }
    }

    render() {
        return (
            <React-Fragment>
                <Button variant="contained" onClick={() => {
                    window.location.replace("http://localhost:3000/directory");
                }}>
                    Back To Directory
                </Button>
                <ApolloProvider client={this.client}>
                    <SignOut />
                    <Router>
                        <Route to="/gallery" />
                        <this.GetRoom roomId={this.roomId} next={false} label={"Previous Room"} />
                        <this.GetRoom roomId={this.roomId} next={true} label={"Next Room"} />
                    </Router>
                    <this.AddRoom />
                    <this.UploadImage />
                </ApolloProvider>
            </React-Fragment>
        );
    }
}

export default Gallery;