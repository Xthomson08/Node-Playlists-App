This is a Node.js Music Playlist app that utilizes Google OAuth 2.0 in order to login via a Google Account, made for my educational purposes. 

Allows a user to login using Google email, then create music playlists stored in a PostgreSQL database. These songs are simply added by use of a Youtube URL through Youtube API. Has essential music player features such as play/pause, next/prev, shuffle, and autoplay. 

This app was converted from originally utilizing the Sequelize library in Node.js to connect a PostgreSQL database to POST and GET the login information of the users.
This original method worked well as anyone could sign up with an email and password and then login after loading the page again, but I wanted to learn more about Google Cloud Platform, so I branched and changed main branch to Google OAuth 2.0.

There are 1-2 features in mind if I return to the project (issues 3 & 4), but would like to branch out my learning elsewhere at the moment.
