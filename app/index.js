const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Hello World!2'));

if (!module.parent) {
    // eslint-disable-next-line no-console
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

module.exports = app;