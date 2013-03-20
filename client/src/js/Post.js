// Post.js
//
// A single app.net post

/*global define:true */
define(['js/PostList'],
function (PostList) {
  'use strict';

  function Post(raw)
  {
    this.raw = raw;
    this.id = raw.id;
    this.children = new PostList();
    this.parent = null;
    if (raw.reply_to)
    {
      this.parent = raw.reply_to;
    }
    this.since = null;
  }

  Post.prototype.isRoot = function ()
  {
    return this.parent === null;
  };

  return Post;
});
