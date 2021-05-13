Go to `about:support` and search for `Profile Directory`.

Now vim into `<profile-directory>/chrome/userChrome.css` and paste the code below inside that file.

```css
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");
#navigator-toolbox[inFullscreen] #PersonalToolbar{
  visibility: visible !important;
}
```

Save and quit.

Now go to `about:config`, search for `toolkit.legacyUserProfileCustomizations.stylesheets` and set its value to `true`.

Restart firefox and enjoy!!
