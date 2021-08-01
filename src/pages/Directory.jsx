import React from 'react';
import { ApolloProvider, useQuery, useSubscription } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { galleryOwnersQuery, galleryOwnerSubscription, getFirstRoomQuery } from '../requests';
import * as queryString from 'query-string';
import SignOut from '../components/SignOut';
import { Button } from '@material-ui/core';

class Directory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newOwner: false
    }

    const httpLink = new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    });

    const wsLink = new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true
      },
    });

    const terminatingLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
          kind === 'OperationDefinition' && operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );

    const link = ApolloLink.from([terminatingLink]);
    const cache = new InMemoryCache();
    this.client = new ApolloClient({ link, cache });
    this.updates = [];
    this.owners = [];
    this.page = 0;
    this.first = null;

    this.Update = this.Update.bind(this);
    this.GalleryOwners = this.GalleryOwners.bind(this);
    this.MultiRoomLinks = this.MultiRoomLinks.bind(this);
  }

  GalleryOwners() {
    let limit = 3;
    let { loading, data, error, fetchMore } = useQuery(galleryOwnersQuery,
      {
        variables: {
          page: this.page,
          limit: limit
        }
      }
    );

    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p>Loading...</p>;
    if (data) {
      if (!this.first) {
        this.first = data.getGalleryOwners;
        this.owners = this.first;
      }
      if (data.getGalleryOwners.length <= 0) {
        this.page = 0;
        this.owners = this.first;
      }
      return (
        <React-Fragment>
          <Button variant="contained" onClick={() => {
            this.page++;
            fetchMore({
              variables: {
                page: this.page
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                this.owners = fetchMoreResult.getGalleryOwners;
                this.setState({ newOwner: true });
              }
            })

          }}>
            Next
        </Button>
          <this.MultiRoomLinks owners={this.owners} />
        </React-Fragment>
      );
    }
  }

  MultiRoomLinks({ owners }) {
    let i = 0;
    for (i = 0; i < owners.length; i++) { }
    return owners.map(({ _id }) => (
      <div key={_id}>
        <this.RoomLinks galleryOwner={_id} />
      </div>
    ))
  }

  Update() {
    let { loading, data, error } = useSubscription(galleryOwnerSubscription);

    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p></p>;
    if (data) {
      if (!this.updates.includes(data.userAdded)) {
        this.updates.push(data.userAdded);
      }
      return this.updates.map(({ _id }) => (
        <div key={_id}>
          <this.RoomLinks galleryOwner={_id} />
        </div>
      ))
    }
  }

  RoomLinks({ galleryOwner }) {
    const { loading, error, data } = useQuery(getFirstRoomQuery, {
      variables: { galleryOwner },
    });
    if (error) return <p>Error: {error.message}</p>;
    if (loading) return <p>Loading...</p>;
    let roomId = data.getFirstRoom._id;

    const search = {
      galleryOwner: galleryOwner,
      roomId: roomId
    }
    let params = queryString.stringify(search);
    return (
      <div key={galleryOwner}>
        Gallery Owner: <Link to={`/gallery?${params}`}>
          {galleryOwner}
        </Link>
      </div>
    )
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <div>
          <SignOut />
          <h2> Directory </h2>
          <this.GalleryOwners />
          <h4> New User Updates </h4>
          <this.Update />
        </div>
      </ApolloProvider>
    );
  }
}

export default Directory;