System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "target": "es5",
    "module": "commonjs",
    "experimentalDecorators": true
  },
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },
  packages: {
    "app": {
      "defaultExtension": "ts"
    }
  },
  map: {
    "jquery": "npm:jquery@2.2.2",
    "rxjs": "npm:rxjs-es@5.0.0-beta.3",
    "typescript": "npm:typescript@1.8.9"
  }
});
