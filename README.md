Charmeur
========

Charmeur is a Feedback/Contact box for web applications. 

It's an extraction from our customer support tool Charm (http://charmhq.com/).

Charmeur is framework-agnostic and doesn't load in any external assets (unless you tell it to).

It's expected to work on any website or web app, regardless of which CSS or JavaScript frameworks
you use (or not use), with any browser that supports basic HTML and CSS positioning.

For more modern browsers, it includes a number of progressive enhancements like CSS animations.

You can configure Charmeur depending on what state your app is in (for example, set an
email address for your logged in user, so they don't have to enter it again), as well
as fully customize all labels and styling.

The project goal is to have the most beautiful, least annoying feedback box for users.

Usage
-----

```html
<script>
  __CHARM = {
    url: '/contact'
  }
</script>
<script src="charmeur.js" defer async></script>
```

`url` will be used both for `POST` for you to send your messages, and as well as a GET link the user can reach with right-click/open in new tab or as a bookmark when it's useful.

TODO: provide a better explanation above!
TODO: document manuel invocation
TODO: document label customization
TODO: document CSS customization

How to show the popup at page load
----------------------------------

```html
<script>
  __CHARM = {
    url: '/contact'
  }
</script>
<!-- note - no defer async here -->
<script src="charmeur.js"></script>
<script>
  __CHARM.show();
</script>
```

Alpha warning
-------------
Right now, Charmeur is an alpha state and lacks documentation, tests and demos, and
out of the box only works with Charm itself.

If you use it and improve it and then not send a pull request, a kitten dies!
Because of that, please do send pull requests!

Some things to do:

* Documentation!
* Demos
* Mobile/responsive layout
* Write tests

Charmeur is licensed under the terms of the MIT License.