# web

To run server

 1. Create `.env` file.
 2. Add a line `MONGODB_CONNECTION_STRING=` follow by your MongoDB connection string. *Example: MONGODB_CONNECTION_STRING=mongodb://localhost:12345*
 3. Run `npm install` and `npm run startDev`
 4. In the browser, visit http://localhost:3000

### Version 1.0
When pressing the update button on the browser, the visitor count of the event updates. Since the person detection algorithm still needs improvement, the displayed visitor count will be a lot larger than the actual count.