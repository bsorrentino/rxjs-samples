var join = require('path').join;

module.exports = {
  dest: {
    all: '/',
    dev: {
      all: 'dist/dev',
      lib: 'dist/dev/lib'
    },
    test: {
      all: 'test'
    },
    prod: {
      all: 'dist/prod',
      lib: 'dist/prod/lib'
    }
  },
  src: {
    app: {
      all: ['./app/**/*.ts'],
      dev: ['./app/**/*.ts', '!./app/**/*.spec.ts'],
      test: ['./app/**/*.ts', '!./app/init.ts']
    },
    // Order is quite important here for the HTML tag injection.
    lib: {
      js: [
        './node_modules/es6-module-loader/dist/es6-module-loader.js',
        './node_modules/es6-module-loader/dist/es6-module-loader.js.map',
        './node_modules/systemjs/dist/system.src.js',
        './node_modules/rxjs-es/**/*.js',
        './node_modules/jquery/dist/jquery.js'
      ],
      css: [
         './node_modules/bootstrap/dist/css/bootstrap.min.css' 
      ]
    },
    html: {
      all: ['./app/**/*.html']
    }
  }
};
