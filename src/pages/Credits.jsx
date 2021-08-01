import React from 'react';
import '../style/Credits.css';
import { Typography, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  Credits: {
    color: "black"
  },
  h1Style: {
    fontStyle: "normal",
    color: "Black",
    fontSize: "30px",
    gutterBotton: true
  },
  h2Style: {
    fontSize: "15px"
  },
  buttonStyles: {
    borderRadius: 1,
    borderColor: "black",
    color: 'black'
  },
  links: {
    borderSpacing: 2,
    alignContent: 'center',
    color: "purple"
  },
  container: {
    textAlign: 'center',
    alignContent: 'center',
    spacing: 10
  }
}));

export default function Credits() {
  const classes = useStyles();
  return (
    <div className="Credits">
      <Typography className={classes.h1Style} variant="h1" >Credits Page</Typography>
      <Typography>This page contains the list of resources used for project.</Typography>

      <Grid className={classes.container} >
        <Link className={classes.links} href="https://s3bubble.com/setting-free-ssl-letsencrypt-certificate-lightsail-renewing/">Setting up a Free SSL LetsEncrypt Certificate for Lightsail and renewing/updating - Amazon Web Services</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://pm2.keymetrics.io/docs/usage/quick-start/">PM2 - Quick Start</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.apollographql.com/docs/react/">Apollo GraphQL (Client)- Introduction</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.apollographql.com/docs/apollo-server/">Introduction to Apollo Server</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.reddit.com/r/node/comments/7phg1w/express_socketio_and_heroku_question/">Reddit - Express, socket.io and Heroku question</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.youtube.com/watch?v=EuaVr7vFF5E">YouTube - How to add Authentication to your GraphQL Subscriptions</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://frontendmasters.com/">Frontend Masters — Learn JavaScript, React, Vue, and Angular from Masters of Front-End Development! (Courses by Scott Moss)</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://jquery.com/">jQuery: The Write Less, Do More, JavaScript Library</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://medium.com/@enespalaz/file-upload-with-graphql-9a4927775ef7">File Upload With GraphQL</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.youtube.com/watch?v=upZOhKhefAs">YouTube - Deploying a WordPress Instance on Amazon Lightsail</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-quick-start-guide-nodejs">Quick start guide: Node.js on Amazon Lightsail</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://nodejs.org/api/https.html">Node.js v13.12.0 Documentation</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://socket.io/">Socket.io 2.0</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://glitch.com/edit/#!/networked-aframe?path=server.js:1:0">Networked A-Frame Example on Glitch.com</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.npmjs.com/package/react-app-rewire-multiple-entry">react-app-rewire-multiple-entry</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.npmjs.com/package/query-string">query-string</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://material-ui.com/">Material-UI: A popular React UI framework</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.youtube.com/watch?v=PWadEeOuv5o">YouTube - Getting Started With Material-UI For React (Material Design for React)</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.youtube.com/watch?v=pHclLuRolzE">YouTube - React + Material UI Introduction - 2020 Edition</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://medium.com/@bretdoucette/understanding-this-setstate-name-value-a5ef7b4ea2b4">Understanding this.setState()</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://spectrum.chat/apollo/general/axios-and-graphql-query~ca4fe6bb-7475-4378-8a28-4cf94f6b1ce8">Axios and GraphQL query · Apollo</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://socket.io/docs/server-api/">Socket.IO  —  Server API</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in">Sign-in Template From Material UI</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.npmjs.com/package/aframe-room-component">Room component for A-Frame environment</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://gist.github.com/rendro/525bbbf85e84fa9042c2">Retrieving cookie value</Link>
      </Grid>
      <Grid className={classes.container} >
        <Link className={classes.links} href="https://www.namecheap.com/">Namecheap</Link>
      </Grid>
    </div>
  )
}
