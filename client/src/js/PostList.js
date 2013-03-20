// PostList.js
//
// A list of posts and code for rendering them.

/*global define:true */
define(['jquery', 'js/allPosts',
        'text!template/post.html'],
function ($, allPosts, postString) {
  'use strict';

  var postTemplate = $(postString);

  function PostList()
  {
    this.posts = [];
    this.current = null;
  }

  PostList.prototype.addPost = function (post)
  {
    this.posts.push(post.id);
  };

  PostList.prototype.initCurrent = function ()
  {
    if (this.current === null && this.posts.length > 0)
    {
      this.current = this.posts.length - 1;
    }
  };

  PostList.prototype.getCurrentPost = function ()
  {
    this.initCurrent();
    var result = null;
    if (this.current !== null)
    {
      result = allPosts.get(this.posts[this.current]);
    }
    return result;
  };

  PostList.prototype.moveNext = function ()
  {
    this.initCurrent();
    if (this.current !== null && this.current > 0)
    {
      this.current -= 1;
    }
  };

  PostList.prototype.movePrevious = function ()
  {
    this.initCurrent();
    if (this.current !== null && this.current < this.posts.length - 1)
    {
      this.current += 1;
    }
  };

  PostList.prototype.renderList = function (count, parent, child)
  {
    this.initCurrent();
    var i = 0;
    var post;
    var result = $('<div/>');
    if (this.current !== null)
    {
      for (i = count; i > 0; i -= 1)
      {
        post = this.renderSmallPost(this.current + i);
        result.append(post);
      }
      post = this.renderBigPost(this.current, parent, child);
      result.append(post);
      for (i = 1; i <= count; i += 1)
      {
        post = this.renderSmallPost(this.current - i);
        result.append(post);
      }
    }
    return result;
  };

  PostList.prototype.renderSmallPost = function (index)
  {
    var post = this.renderPost(index);
    post.find('.post-wrapper').addClass('small-post');
    post.find('.parent-wrapper').addClass('no-border');
    post.find('.child-wrapper').addClass('no-border');
    return post;
  };

  PostList.prototype.renderBigPost = function (index, parent, child)
  {
    var post = this.renderPost(index);
    var current = allPosts.get(this.posts[index]);
    if (current)
    {
      var thread = allPosts.get(current.raw.thread_id);
      if (thread && ! thread.since)
      {
        post.find('.child-author').html('Loading...');
      }
    }
    post.find('.post-wrapper').addClass('big-post');
    post.find('.post-wrapper').addClass('center-post');
    if (parent)
    {
      post.find('.parent-wrapper').addClass('big-post');
      post.find('.parent-wrapper').addClass('small-post');
      post.find('.parent-author').html('@' + parent.raw.user.username);
      post.find('.parent-contents').html(parent.raw.html);
    }
    else
    {
      post.find('.parent-wrapper').addClass('no-border');
    }
    if (child)
    {
      post.find('.child-wrapper').addClass('big-post');
      post.find('.child-wrapper').addClass('small-post');
      post.find('.child-author').html('@' + child.raw.user.username);
      post.find('.child-contents').html(child.raw.html);
    }
    else
    {
      post.find('.child-wrapper').addClass('no-border');
    }
    return post;
  };

  PostList.prototype.renderPost = function (index)
  {
    var post = postTemplate.clone();
    if (index >= 0 && index < this.posts.length)
    {
      var current = allPosts.get(this.posts[index]);
      if (current !== null)
      {
        post.find('.post-author').html('@' + current.raw.user.username);
        post.find('.post-contents').html(current.raw.html);
      }
    }
    return post;
  };

  return PostList;
});
