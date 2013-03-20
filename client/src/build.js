({
  appDir: ".",
  baseUrl: ".",
  dir: "../../out",

//  optimize: "uglify2",
//  generateSourceMaps: true,
//  preserveLicenseComments: false,

  optimize: "none",
  useSourceUrl: true,

  fileExclusionRegExp: /(^\.)|(~$)/,
  findNestedDependencies: true,
  optimizeAllPluginResources: true,

  text: {
    env: "node"
  },

  paths: {
    "jquery": "../../lib/require-jquery",
    "jquery-caret": "../../lib/jquery.caret.min",
    "jquery-cookie": "../../lib/jquery.cookie",
    "jquery-desknoty": "../../lib/jquery.desknoty",
    "jquery-easydate": "../../lib/jquery.easydate-0.2.4.min",
    "jquery-mousewheel": "../../lib/jquery.mousewheel",
    "jquery-titlealert": "../../lib/jquery.titlealert.min",
    "bootstrap": "../../lib/bootstrap.min",
    "util": "../../../patter/git/src/js/util",
    "appnet": "../../../patter/git/src/js/appnet",
    "appnet-api": "../../../patter/git/src/js/appnet-api",
    "appnet-note": "../../../patter/git/src/js/appnet-note"
  },

  shim: {
    "bootstrap": ["jquery"],
    "jquery-caret": ["jquery"],
    "jquery-cookie": ["jquery"],
    "jquery-desknoty": ["jquery"],
    "jquery-easydate": ["jquery"],
    "jquery-mousewheel": ["jquery"],
    "jquery-titlealert": ["jquery"]
  },

  modules: [
    //Optimize the application files. jQuery is not 
    //included since it is already in require-jquery.js
    {
      name: "js/weft",
      exclude: ["jquery"]
    },
  ]
})
