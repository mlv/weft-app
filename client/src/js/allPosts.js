// allPosts.js
//
// A vault containing all posts ever fetched.

/*global define:true */
define(['jquery'],
function ($) {
  'use strict';

  var allPosts = {
    posts: {}
  };

  allPosts.get = function (id)
  {
    var result = null;
    if (this.posts[id])
    {
      result = this.posts[id];
    }
    return result;
  };

  allPosts.set = function (post)
  {
    if (! this.posts[post.id])
    {
      this.posts[post.id] = post;
    }
  };

  return allPosts;
});
