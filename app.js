var config = require('./config');
var nano = require('nano')(config.db);
var express = require('express');
var async = require("async");
var app = express();

var modelDoc = {
  language: "javascript",
  views: {
    all: {
      map: "function(doc) {\n  emit(doc.type, doc);\n}"
    },
    get: {
      map: "function(doc) {\n  if (/_/.test(doc.type)) {\n    emit([\n      doc.type, \n      doc[doc.type.split('_')[0]]\n    ], doc);\n  } else {\n    emit([\n      doc.type,\n      doc._id\n    ], doc);\n  }\n}"
    }
  }
};

var articleDoc = {
  language: "javascript",
  views: {
    all: {
      map: "function(doc) {\n  if (doc.type === 'article') {\n    emit(doc._id, doc);\n  }\n}"
    },
    slug: {
      map: "function(doc) {\n  if (doc.type === 'article') {\n    emit(doc.slug, doc);\n  }\n}"
    }
  }
};

app.configure(function() {
  app.use(express.bodyParser({ 
    uploadDir: __dirname + '/uploads', 
    keepExtensions: true
  }));
  app.use(express.cookieParser(config.secret));
  app.use(express.session());
  //app.use();
  app.use(express.static(__dirname + '/public'));
});

// signup
app.post('/api/signup', function(req, res) {
  delete req.body.confirm_password;
  req.body.type = 'user';
  req.body.roles = [];
  // series async style
  async.series([
    function(cb) {
      // create user
      var users = nano.use('_users');
      users.insert(req.body, 'org.couchdb.user:' + req.body.name, cb);
    },
    function(cb) {
      // create blog db for user
      nano.db.create('relax_' + req.body.name, cb);
    },
    function(cb) {
      // setup security
      var blog = nano.use('relax_' + req.body.name);
      blog.insert({ 
        admins: {names: [], roles: []}, 
        readers: { names:[req.body.name], roles: [] }
      }, '_security', cb );
    },
    function(cb) {
      // create view for blog db
      var blog = nano.use('relax_' + req.body.name);
      blog.insert(modelDoc, '_design/model', cb);
    } ,
    function(cb) {
      // create view for blog db
      var blog = nano.use('relax_' + req.body.name);
      blog.insert(articleDoc, '_design/article', cb);
    }
  ], function(err, results) {
    if (err) { res.send(500, err); }
    // generate session...
    req.session.regenerate(function() {
      req.session.db = 'relax_' + req.body.name;
      res.send(200);
    });
  });
});

// login
app.post('/api/login', function(req, res) {
  // assign user database to session
  nano.auth(req.body.name, req.body.password, function(err, body, headers) {
    if (err) { return res.send(500, err); }
    req.session.regenerate(function() {
      req.session.user = req.body.name;
      req.session.db = 'relax_' + req.body.name;
      res.writeHead(200, { 'set-cookie': headers['set-cookie']});
      res.end();
    });
  });
});

// logout
app.post('/api/logout', restrict(), function(req, res) {
  nano.request({ method: 'DELETE', path: '_session'});
  res.writeHead(200, { 'set-cookie': ''});
  res.end();
});

app.get('/api/session', restrict(), function(req, res) {
  res.send({ user: req.session.user});
  //nano.request({ method: 'GET', path: '_session'}).pipe(res);
});

app.post('/api/uploads', restrict(), function(req, res) {
  var result = { 
    path: req.files.uploadFile.path.split('/').pop(),
    name: req.files.uploadFile.name,
    type: req.files.uploadFile.type 
  };
  res.send(result);
});

app.get('/uploads/:path', function(req, res) {
  res.sendfile(req.params.path, {root: __dirname + '/uploads'});
});

app.get('/api/article/:user/all', function(req, res) {
  req.db = nano.use('relax_' + req.params.user);
  req.db.view('article', 'all', {}).pipe(res);
});

app.get('/api/article/:user/:slug', function(req, res) {
  req.db = nano.use('relax_' + req.params.user);
  req.db.view('article', 'slug', { key: req.params.slug}).pipe(res);
});

// list/search
app.get('/api/:model', restrict(), function(req, res) {
  req.db.view('model', 'all', { key: req.params.model}).pipe(res);
  //req.db.list().pipe(res);
});

// add new
app.post('/api/:model', restrict(), function(req, res) {
  req.db.insert(req.body).pipe(res);
});

// get document
app.get('/api/:model/:id', restrict(), function(req, res) {
  req.db.get(req.params.id).pipe(res);
});

// update document
app.put('/api/:model/:id', restrict(), function(req, res) {
  req.db.insert(req.body, req.params.id).pipe(res);
});

// delete document
app.del('/api/:model/:id', restrict(), function(req, res) {
  req.db.destroy(req.params.id).pipe(res);
});

// add attachment
app.post('/api/:model/:id/attachment', restrict(), function(req, res) {
  var dbstream = req.db.attachment.insert(req.params.id, req.files[0].name, data, req.files[0].type);
  fs.createReadStream(req.files[0].path).pipe(dbstream);
  dbstream.pipe(res);
});

app.get('/api/:model/:id/attachment/:name', restrict(), function(req, res) {
  req.db.attachment.get(req.params.id, req.params.name).pipe(res);
});

app.del('/api/:model/:id/attachment/:name', restrict(), function(req, res) {
  
});

app.get(/^((?!\.)[\s\S])*$/, function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000);

function restrict() {
  return function(req, res, next) {
    if (req.session.db) {
      req.db = nano.use(req.session.db);
      next();      
    } else {
      res.send(401);
    }
  }
}