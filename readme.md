# Idea Blog

AngularJS Practice App

The idea blog is a tumblr like clone that enables many people to 
register and posts to their own idea blog.  They will get their own 
url (www.ideablog.com/:username).

# Setup

* Install NodeJS (http://nodejs.org)
* Install CouchDb (http://couchdb.apache.org/)

> You will need a text editor, if you don't have one, I suggest
you try 

* Brackets (http://brackets.io/)

* Open Console

```
mkdir ideablog
cd ideablog
mkdir public
cd public
npm install bower -g
bower init
bower install jquery bootstrap.css angular --save
bower install codemirror font-awesome underscore --save
bower install moment markdown angular-bootstrap --save
bower install angular-ui-codemirror angular-http-auth --save
touch index.html
mkdir css
touch css/app.css

```

Open index.html in your editor and paste this html

``` html
<!doctype html>
<html ng-app="App">
  <head>
    <meta charset="utf-8">
    <title>IdeaLog</title>
    <link rel="stylesheet" href="/components/bootstrap/css/bootstrap.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <style>
      body {
        padding-top: 70px;
      }
    </style>
    <link rel="stylesheet" href="/components/bootstrap/css/bootstrap-responsive.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/components/font-awesome/css/font-awesome.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/components/codemirror/lib/codemirror.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/components/codemirror/theme/monokai.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="/css/app.css">
  </head>
  <body>
    <h1>Idea Blog</h1>
    <ng-view></ng-view>
    <script src="/components/jquery/jquery.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/underscore/underscore.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/moment/moment.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/markdown/lib/markdown.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/angular/angular.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/codemirror/lib/codemirror.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/codemirror/addon/edit/continuelist.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/codemirror/mode/markdown/markdown.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/codemirror/mode/xml/xml.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/codemirror/mode/htmlmixed/htmlmixed.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/angular-bootstrap/ui-bootstrap-tpls.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/angular-ui-codemirror/ui-codemirror.js" type="text/javascript" charset="utf-8"></script>
    <script src="/components/angular-http-auth/src/http-auth-interceptor.js" type="text/javascript" charset="utf-8"></script>
    <script src="/ng-app.js"></script>
  </body>
</html>
```

setup grunt

``` sh
npm install grunt-cli -g
npm init
touch Gruntfile.js
npm install grunt-contrib-concat grunt-contrib-jshint grunt-contrib-uglify grunt-contrib-watch --save-dev
```
Paste the following js in Gruntfile.js

``` js
var www = 'public';

var appFiles = [
www + '/app/app.js',
www + '/app/services/*.js',
www + '/app/filters/*.js',
www + '/app/directives/*.js',
www + '/app/controllers/*.js'
];

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: appFiles
    },
    concat: {
      app: {
        src: appFiles,
      dest: www + '/ng-app.js'
      }
    },
    uglify: {
      grxnet: {
        src: [ www + '/ng-app.js'],
        dest: www + '/ng-app.min.js'
      }
    },
    watch: {
      scripts: {
        files: www + '/app/**/*.js',
        tasks: ['jshint','concat'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', 'jshint concat uglify');

}

```

Setup Node Server

Open console to your project folder

``` sh
npm init
npm install nano express async --save
npm install grunt-contrib-concat grunt-contrib-jshint grunt-contrib-uglify grunt-contrib-watch --save-dev
npm install node-dev -g
```

app.js

``` sh
curl -O https://gist.github.com/twilson63/5515649/raw/89c2b5b2098fb8bdb0cbe046e9407abb5b198558/app.js
```

create config.js

``` sh
touch config.js

```

add the following to config.js

``` js
module.exports = {
  db: 'http://localhost:5984',
  secret: 'relax your blogging'
}
```
open console 1 and run `grunt concat` and `grunt watch`

open console 2 and run `node-dev app.js`

open a browser to http://localhost:3000

# Exercise 1

create app.js

``` sh
mkdir public/app
touch public/app/app.js
```

app.js

``` js
angular.module('App', ['ui.bootstrap', 'ui.codemirror', 'http-auth-interceptor'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { controller: 'SignupCtrl', templateUrl: '/app/templates/signup.html'})
      .when('/dashboard', { controller: 'DashboardCtrl', templateUrl: '/app/templates/dashboard.html'})
    ;
  })
```

create templates

``` sh
mkdir app/templates
touch app/templates/signup.html
```

``` html
<div class="container">
  <div class="hero-unit">
    <h1>
      <i class="icon-lightbulb"></i>
      Idea Blog
    </h1>
    <p>Zen and the art of blogging...</p>
  </div>
  <div class="span5 offset3">
    <form class="well" name="form">
      <legend>Register</legend>
      <p>Sign Up now and get started blogging...</p>
      <div class="control-group">
        <label class="control-label">Email</label>
        <div class="controls">
          <input class="span4" type="email" ng-model="user.email">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Username</label>
        <div class="controls">
          <input class="span4" type="text" ng-model="user.name">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Password</label>
        <div class="controls">
          <input class="span4" type="password" ng-model="user.password">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Confirm</label>
        <div class="controls">
          <input class="span4" type="password" ng-model="user.confirm_password">
        </div>
      </div>
      <div class="control-group">
        <div class="controls">
          <button class="btn btn-primary btn-large span2" ng-click="login()">Login</button>
          
          <button class="btn btn-primary btn-large span2" ng-disabled="form.$invalid" ng-click="register(user)">Sign up</button>
          <div class="clearfix"></div>
        </div>
      </div>
    </form> 
  </div>

</div>
```

create signup controller

``` js
angular.module('App').controller('SignupCtrl', function($scope) {
  
});
```

add signup function

``` js
angular.module('App').controller('SignupCtrl', function($scope, $http, $location) {

  $scope.register = function(user) {
    $http.post('/api/signup', user)
      .success(function(user) {
        $location.path('/dashboard');
      })
      .error(function(err) {
        // alert error
      });
  };
});
```

create dashboard template and controller

dashboard.html

``` html
<div class="navbar navbar-fixed-top navbar-inverse">
  <div class="navbar-inner">
    <div class="container">
      <a href="/dashboard" class="brand">Idea Blog</a>
      <ul class="pull-right">
        <li>
          <button class="btn" ng-click="logout()">Logout</button>
        </li>
      </ul>
    </div>
  </div>
</div>
<div class="container">
  <a class="pull-right btn" ng-href="/article/new">
    <i class="icon-plus"></i>
    New Article
  </a>
  <h2>Dashboard</h2>
  <ul style="list-style: none;">
    <li class="media" ng-repeat="article in articles | orderBy: 'publishedAt'">
      <a class="pull-right" ng-href="/article/{{article._id}}/edit">
        <i class="icon-pencil"></i>
        Edit
      </a>
      <a ng-href="/{{article.author}}/{{article.slug}}">{{article.title}}</a>
      <small>Published by {{article.author}} on {{article.publishedAt | date}}</small>
      <div ng-bind-html-unsafe="article.body | leader"></div>
    </li>
  </ul>
</div>
```

dashboard controller

``` js
app.controller('DashboardCtrl', function($scope, $http, 
  $location, $_) {
  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });
  $scope.logout = function() {
    $http.post('/api/logout').success(function(data) {
      //alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };
});
```

add underscore service

``` sh 
mkdir public/app/services
touch public/app/services/underscore.js
```

underscore.js

``` js
angular.module('App').value('$_', _);
```


add login function

``` js
angular.module('App').controller('SignupCtrl', function($scope, $http, 
  $location, $dialog) {

    $scope.login = function() {
      $dialog.dialog({
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        dialogFade: true})
        .open('/app/templates/login.html', 'LoginCtrl');
    };

  $scope.register = function(user) {
    $http.post('/api/signup', user)
      .success(function(user) {
        $location.path('/dashboard');
      })
      .error(function(err) {
        // alert error
      });
  };
});
```

add login dialog

``` html
<div class="modal-header">
  <h2>Login</h2>
</div>
<div class="modal-body">
  <form>
    <div class="control-group">
      <label class="control-label">Username</label>
      <div class="controls">
        <input type="text" ng-model="user.name">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label">Password</label>
      <div class="controls">
        <input type="password" ng-model="user.password">
      </div>
    </div>
  </form>
</div>
<div class="modal-footer">
  <button class="btn btn-primary" ng-click="login(user)">Login</button>
</div>
```

add login controller

``` js
app.controller('LoginCtrl', function($scope, $http, 
  $location, authService, dialog) {
  $scope.login = function(user) {
    $http.post('/api/login', user)
      .success(function(user) {
        dialog.close();
        //alerts.push({type: 'success', msg: 'Successfully logged in.'});
        authService.loginConfirmed();
      })
      .error(function(err) {
        // alert error
      });
  };
});
```

add the rest of the routes

app.js

``` js

angular.module('App', ['ui.bootstrap', 'ui.codemirror', 'http-auth-interceptor'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { controller: 'SignupCtrl', templateUrl: '/app/templates/signup.html'})
      .when('/dashboard', { controller: 'DashboardCtrl', templateUrl: '/app/templates/dashboard.html'})
      .when('/article/new', { controller: 'ArticleNewCtrl', templateUrl: '/app/templates/article-form.html'})
      .when('/:user', { controller: 'HomeCtrl', templateUrl: '/app/templates/home.html'})
      .when('/:user/:slug', { controller: 'ArticleCtrl', templateUrl: '/app/templates/article.html'})
      .when('/article/:id/edit', { controller: 'ArticleEditCtrl', templateUrl: '/app/templates/article-form.html'})
      ;
  })

```

add the rest of the templates

article-form.html

``` html
<div class="container">
  <form>
    <legend>{{mode}} Article</legend>
    <div class="control-group">
      <label class="control-label">Title</label>
      <div class="controls">
        <input class="span10 title" type="text" ng-model="article.title" required>
        <div>{{article.slug}}</div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label">Body</label>
      <div class="help-block">Separate Leader from rest of body using the <code>&lt;!-- more --&gt;</code> element</div>
      <div class="controls">
        <textarea class="body" ui-codemirror="{theme: 'monokai', mode: 'markdown'}" ng-model="article.body"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label">Published</label>
      <!-- list attachments doc name should be slug... -->
      <div class="controls">
        <input type="text" ui-date ng-model="article.publishedAt">
      </div>
    </div>
    <div class="control-group pull-right">
      <button class="btn btn-warning btn-large" ng-click="cancel()">Cancel</button>
      <button class="btn btn-primary btn-large" ng-click="save(article)">
        <i class="icon-cloud-upload"></i>
        Save
      </button>
    </div>
    
  </form>
</div>
```

home.html

``` html
<div class="container">
  <div class="hero-unit">
    <h1>{{user}}</h1>
  </div>
  <article class="offset1" ng-repeat="article in articles | orderBy: 'publishedAt' ">
    <header>
      <h2>{{article.title}}</h2>
    </header>
    <div ng-bind-html-unsafe="article.body | markdown"></div>
  </article>
</div>
```

article.html

``` html
<div class="container">
  <a class="pull-right" ng-href="/article/{{article._id}}/edit" ng-show="isAuthor()">
    <i class="icon-pencil"></i>
    Edit
  </a>
  <h2><a ng-href="/article/{{article.slug}}">{{article.title}}</a></h2>
  <p>Published by {{article.author}} on {{article.publishedAt | date}}</p>
  <div ng-bind-html-unsafe="article.html"></div>
</div>
```

alerts.html

``` html
<div class="container" ng-controller="AlertsCtrl">
  <alert ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">{{alert.msg}}</alert>
</div>
```

Add article new controller

article-new.js

``` js
angular.module('App').controller('ArticleNewCtrl', function($scope, $location, $http,  $moment) {
  
});
```

``` sh
touch public/services/moment.js
```

moment.js

``` js
angular.module('App').value('$moment', moment);
```

article-edit.js

``` js
angular.module('App').controller('ArticleEditCtrl', function($$scope, $http, $routeParams, $location) {
  
});
```

home.js

``` js
angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_) {
  
});
```

dashboard.js

get user nane

``` js
$scope.mode = 'New';
$http.get('/api/session').success(function(data) {
  $scope.article.author = data.user;
});

```

add save function

``` js
$scope.save = function(article) {
  article.type = 'article';
  article.slug = article.title.toLowerCase().replace(' ', '-');
  $http.post('/api/article', article)
    .success(function(article) {
      // alert success
      $location.path('/dashboard');
      //alerts.push({type: 'success', msg: 'Successfully added article!'});
    })
    .error(function(err) {
      // alert err
      //alerts.push({type: 'error', msg: 'Error: ' + err.error +'!'});
    });
};

```

cancel.js

``` js
$scope.cancel = function() {
  $location.path('/dashboard');
};
```

add alerts service

touch public/app/services/alerts.js

``` js
angular.module('App').value('alerts', []);
```

uncomment out alert notifications

add include

``` html
<div ng-include="'/templates/alerts.html'"></div>
```

article-edit.js

``` js
$scope.mode = 'Edit';

// get article to edit
$http.get('/api/article/' + $routeParams.id)
  .success(function(article) {
    $scope.article = article;
  })
  .error(function(err) {
    $location.path('/dashboard');
  });

```

save function

``` js
$scope.save = function(article) {
  $http.put('/api/article/' + $routeParams.id, article)
    .success(function(article) {
      $location.path('/dashboard');
    })
    .error(function(err) {
      // alert err
      
    });
```

cancel function

``` js
$scope.cancel = function() {
  $location.path('/dashboard');
};

```

article.js

``` js
$http.get('/api/article/' + $routeParams.user + '/' + $routeParams.slug)
  .success(function(data) {
    $scope.article = data.rows[0].value;
    $scope.article.html = $markdown.toHTML($scope.article.body);
  });

```

markdown service

``` js
angular.module('App').value('$markdown', markdown);
```

home.js

``` js

$scope.user = $routeParams.user;
$http.get('/api/article/' + $routeParams.user + '/all')
  .success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

```

add attachments

article-new.js

``` html
<div class="control-group">
  <label class="control-label">Attachments</label>
  <ul>
    <li ng-repeat="image in article.images">
      <code>{{image | mdImage}}</code>
    </li>
  </ul>
  <!-- list attachments doc name should be slug... -->
  <div class="controls">
    <upload-button 
      class="btn btn-large"
      action="/api/uploads" 
      complete="uploadComplete($data)">
      <i class="icon-picture"></i>
      Upload Image
    </upload-button>
  </div>
</div>
```

btnupload directive

``` sh
mkdir public/app/directives
touch public/app/directives/uploadbtn.js
```

uploadbtn.js

``` js
app.directive('uploadButton', function($parse, $compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<span class="upload-button {{class}}">' +
        '<span ng-transclude></span>' +
        '<input type="file">' +
      '</span>',
    link: function(scope, element, attrs) {
      element.find('input').bind('change', function() {
        var fd = new FormData();
        fd.append('uploadFile', this.files[0]);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(e) {
          var fn = $parse(attrs.complete);
          scope.$apply(function () {
            if(fn) { fn(scope, { $data: xhr.responseText, $status: xhr.status }); } 
          });
        }, false);
        xhr.open("POST", attrs.action);
        xhr.send(fd);
      });
    }
  };
});
```

md-image.js filter

``` js
app.filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});

```

app.css

``` css
app.filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});
```