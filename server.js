const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const publicPath = path.join(__dirname, 'build')
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.resolve(__dirname, "build"))); // path.resolve was missing here
app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "build", "index.html"))
);

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});