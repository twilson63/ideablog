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
