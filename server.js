const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chokidar = require('chokidar');

const app = express();

app.set('port', process.env.PORT || 4000);
app.use(logger('dev'));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/', express.static(__dirname + '/examples'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'examples', 'js', 'example1.html'));
});

const server = http.createServer(app);

reload(app)
  .then(function(reloadReturned) {
    // Reload started, start web server
    server.listen(app.get('port'), function() {
      console.log('Web server listening on port ' + app.get('port'));
    });

    // files to be watched
    const files = [__dirname + '/dist/examples/js', __dirname + '/examples/js/*.html'];

    // watch changes
    chokidar.watch(files, { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
      reloadReturned.reload();
    });
  })
  .catch(function(err) {
    console.error('Reload could not start, could not start server/sample app', err);
  });
