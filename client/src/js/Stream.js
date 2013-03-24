// Stream.js
//
// An app.net stream

/*global define:true */
define(['jquery', 'appnet', 'js/allPosts', 'js/threader',
        'js/PostList', 'js/Post',
        'jquery-mousewheel'],
function ($, appnet, allPosts, threader, PostList, Post)
{
  'use strict';

  function Stream(type, root)
  {
    console.log('In stream constructor, type: %s, root: %s\n', type, root);
    this.type = type;
    this.root = root;
    this.list = new PostList();
    this.timer = null;
    this.since = null;
    this.ancestors = [];
    this.center = this.list;

    this.update();
    $(document).mousewheel($.proxy(this.moveMousewheel, this));
    $(document).keydown($.proxy(this.keyDown, this));
  }

  Stream.prototype.update = function ()
  {
    console.log('In stream.prototype.update');
    clearTimeout(this.timer);
    this.timer = setTimeout($.proxy(this.update, this), 30 * 1000);
    var options = {
      count: 200,
      include_deleted: 0,
      include_directed_posts: 1
    };
    if (this.since)
    {
      options.since_id = this.since;
    }
    appnet.api.getMyUnified(options, $.proxy(this.completeUpdate, this),
                            $.proxy(this.failUpdate, this));
  };

  Stream.prototype.completeUpdate = function (response)
  {
    console.log('In stream.prototype.completeUpdate');
    if (response.meta.max_id)
    {
      this.since = response.meta.max_id;
    }
    var i = 0;
    var post;
    var len = response.data.length;
    if (len > 0)
    {
      for (i = len - 1; i >= 0; i -= 1)
      {
        if (! response.data[i].reply_to)
        {
          post = new Post(response.data[i]);
          allPosts.set(post);
          this.list.addPost(post);
        }
      }
      this.updateRender();
      var current = this.list.getCurrentPost();
      if (current)
      {
        threader.changeThread(current.raw.thread_id, this);
      }
    }
  };

  Stream.prototype.failUpdate = function (response)
  {
    console.log('In stream.prototype.failUpdate(%s)', response);
  };

  Stream.prototype.updateRender = function ()
  {
    var parent = null;
    console.log('In stream.prototype.updateRender');
    if (this.ancestors.length > 0)
    {
      parent = this.ancestors[this.ancestors.length - 1].getCurrentPost();
    }
    var current = this.center.getCurrentPost();
    var child = null;
    if (current)
    {
      child = current.children.getCurrentPost();
    }
    this.root.html(this.center.renderList(2, parent, child));
  };

  Stream.prototype.moveMousewheel = function (event, delta, deltaX, deltaY)
  {
    event.preventDefault();
    if (deltaY < 0)
    {
      this.down();
    }
    else
    {
      this.up();
    }
    return false;
  };

  Stream.prototype.keyDown = function (event)
  {
    console.log('\nKEY\n');
    if (event.which === 87 || event.which === 38 || // w UP
        event.which === 104 || event.which === 75)
    {
      this.up();
    }
    else if (event.which === 65 || event.which === 37 || // a LEFT
             event.which === 188 || event.which === 100 ||
             event.which === 72) // ,
    {
      this.left();
    }
    else if (event.which === 83 || event.which === 40 || // s DOWN
             event.which === 98 || event.which === 74)
    {
      this.down();
    }
    else if (event.which === 68 || event.which === 39 || // d RIGHT
             event.which === 190 || event.which === 102 ||
             event.which === 76) // .
    {
      this.right();
    }
    else
    {
      console.log( 'Got key: %d', event.which);
    }
  };

  Stream.prototype.down = function ()
  {
    console.log('In stream.prototype.down, this: %s', this);
    this.center.moveNext();
    this.updateRender();
    var current = this.list.getCurrentPost();
    if (current)
    {
      threader.changeThread(current.raw.thread_id, this);
    }
  };

  Stream.prototype.up = function ()
  {
    console.log('In stream.prototype.up, this: %s', this);
    this.center.movePrevious();
    this.updateRender();
    var current = this.list.getCurrentPost();
    if (current)
    {
      threader.changeThread(current.raw.thread_id, this);
    }
  };

  Stream.prototype.right = function ()
  {
    console.log('In stream.prototype.right, this: %s', this);
    var current = this.center.getCurrentPost();
    if (current)
    {
      var deeper = current.children.getCurrentPost();
      if (deeper)
      {
        this.ancestors.push(this.center);
        this.center = current.children;
        this.updateRender();
      }
    }
  };

  Stream.prototype.left = function ()
  {
    console.log('In stream.prototype.left, this: %s', this);
    if (this.ancestors.length > 0)
    {
      this.center = this.ancestors.pop();
      this.updateRender();
    }
  };

  return Stream;
});
