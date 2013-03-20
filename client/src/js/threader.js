// threader.js
//
// Periodically fetch entire threads and update tree view

/*global define:true */
define(['jquery', 'appnet', 'js/allPosts', 'js/Post'],
function ($, appnet, allPosts, Post) {
  'use strict';

  var threader = {
    timer: null,
    thread: null,
    stream: null
  };

  threader.update = function ()
  {
    clearTimeout(this.timer);
//    this.timer = setTimeout($.proxy(this.update, this), 30 * 1000);
    if (this.thread)
    {
      var options = {
        include_deleted: 0
      };
      var current = allPosts.get(this.thread);
      if (current)
      {
        if (current.since)
        {
          options.since_id = current.since;
        }
        appnet.api.getAllReplies(this.thread, options,
                                 $.proxy(this.completeUpdate, this),
                                 $.proxy(this.failUpdate, this));
      }
    }
  };

  threader.completeUpdate = function (response)
  {
    var root = allPosts.get(this.thread);
    if (response.meta.max_id)
    {
      root.since = response.meta.max_id;
    }
    var i = 0;
    var len = response.data.length;
    if (len > 0)
    {
      for (i = len - 1; i >= 0; i -= 1)
      {
        var current = allPosts.get(response.data[i].id);
        if (! current)
        {
          current = new Post(response.data[i]);
          allPosts.set(current);
          if (current.raw.reply_to)
          {
            var parent = allPosts.get(response.data[i].reply_to);
            if (parent)
            {
              parent.children.addPost(current);
            }
          }
        }
      }
      this.stream.updateRender();
    }
  };

  threader.failUpdate = function (meta)
  {
  };

  threader.changeThread = function (newThread, newStream)
  {
    this.stream = newStream;
    if (this.thread !== newThread)
    {
      this.thread = newThread;
      clearTimeout(this.timer);
      this.timer = setTimeout($.proxy(this.update, this), 500);
    }
  };

  return threader;
});
