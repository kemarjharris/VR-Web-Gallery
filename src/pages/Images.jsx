import React from 'react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { useQuery } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo';
import { imagesQuery } from '../requests';
import * as queryString from 'query-string';
import validator from 'validator';

class Images extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPage: false
        };

        this.uploadLink = createUploadLink({
            uri: 'http://localhost:4000/graphql',
            credentials: 'include'
        })

        this.link = ApolloLink.from([this.terminatingLink]);
        this.apolloCache = new InMemoryCache();
        this.client = new ApolloClient({
            link: this.uploadLink,
            cache: this.apolloCache
        });

        this.fileUpload = ({ target: { files } }) => {
            return files[0]
        }
        this.GetImages = this.GetImages.bind(this);

        const parsed = queryString.parse(window.location.search);
        this.galleryOwner = parsed.galleryOwner;
        this.roomId = parsed.roomId;
        this.images = [];
    }

    GetImages({ roomId }) {

        const { loading, error, data } = useQuery(imagesQuery, {
            variables: { roomId },
            pollInterval: 500
        });
        if (error) return <p>Error: {error.message}</p>;
        if (loading) return <p>Loading...</p>;
        this.images = data.getImages;
        let i = 0;
        return data.getImages.map(image => {
            i++;
            return (<this.DrawImage key={image._id + i.toString()} id={image._id} i={i - 1} />);
        });
    }

    DrawImage({ id, i }) {
        if (!validator.isAlphanumeric(id)) return null;
        let position = "";
        let rotation = "";
        let wall = i % 4;
        if (wall === 0) {
            position = "5 1 0.01";
            rotation = "0 0 0";
        } else if (wall === 1) {
            position = "9.99 1 5.01";
            rotation = "0 -90 0";
        } else if (wall === 2) {

            position = "5 1 9.99";
            rotation = "0 -180 0";
        } else { // wall === 3
            position = "0.01 1 5.01";
            rotation = "0 -270 0";
        }

        let url = "src: https://cscc09-images.s3.us-east-2.amazonaws.com/" + id;

        return (
            <a-plane
                key={id}
                rotation={rotation}
                scale="1 1 1"
                position={position}
                material={url}>
            </a-plane>
        );
    }

    render() {
        return (
            <ApolloProvider client={this.client}>
                <this.GetImages roomId={this.roomId} />
            </ApolloProvider>
        );
    }
}

export default Images;
