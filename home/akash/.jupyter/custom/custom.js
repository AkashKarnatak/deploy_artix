// leave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file.
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 *
 * The object available at load time depend on the version of IPython in use.
 * there is no guaranties of API stability.
 *
 * The example below explain the principle, and might not be valid.
 *
 * Instances are created after the loading of this file and might need to be accessed using events:
 *     define([
 *        'base/js/namespace',
 *        'base/js/events'
 *     ], function(IPython, events) {
 *         events.on("app_initialized.NotebookApp", function () {
 *             IPython.keyboard_manager....
 *         });
 *     });
 *
 * __Example 1:__
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    define([
 *        'base/js/namespace',
 *        'base/js/events'
 *    ], function(IPython, events) {
 *        events.on('app_initialized.NotebookApp', function(){
 *            IPython.toolbar.add_buttons_group([
 *                {
 *                    'label'   : 'run qtconsole',
 *                    'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                    'callback': function () {
 *                        IPython.notebook.kernel.execute('%qtconsole')
 *                    }
 *                }
 *                // add more button here if needed.
 *                ]);
 *        });
 *    });
 *
 * __Example 2:__
 *
 * At the completion of the dashboard loading, load an unofficial javascript extension
 * that is installed in profile/static/custom/
 *
 *    define([
 *        'base/js/events'
 *    ], function(events) {
 *        events.on('app_initialized.DashboardApp', function(){
 *            require(['custom/unofficial_extension.js'])
 *        });
 *    });
 *
 * __Example 3:__
 *
 *  Use `jQuery.getScript(url [, success(script, textStatus, jqXHR)] );`
 *  to load custom script into the notebook.
 *
 *    // to load the metadata ui extension example.
 *    $.getScript('/static/notebook/js/celltoolbarpresets/example.js');
 *    // or
 *    // to load the metadata ui extension to control slideshow mode / reveal js for nbconvert
 *    $.getScript('/static/notebook/js/celltoolbarpresets/slideshow.js');
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */
require([
  'nbextensions/vim_binding/vim_binding',
], function() {
  // Use Ctrl-h/l/j/k to move around in Insert mode
  CodeMirror.Vim.defineAction('[i]<C-h>', function(cm) {
    var head = cm.getCursor();
    CodeMirror.Vim.handleKey(cm, '<Esc>');
    if (head.ch <= 1) {
      CodeMirror.Vim.handleKey(cm, 'i');
    } else {
      CodeMirror.Vim.handleKey(cm, 'h');
      CodeMirror.Vim.handleKey(cm, 'a');
    }
  });
  CodeMirror.Vim.defineAction('[i]<C-l>', function(cm) {
    var head = cm.getCursor();
    CodeMirror.Vim.handleKey(cm, '<Esc>');
    if (head.ch === 0) {
      CodeMirror.Vim.handleKey(cm, 'a');
    } else {
      CodeMirror.Vim.handleKey(cm, 'l');
      CodeMirror.Vim.handleKey(cm, 'a');
    }
  });
  CodeMirror.Vim.mapCommand("<C-h>", "action", "[i]<C-h>", {}, { "context": "insert" });
  CodeMirror.Vim.mapCommand("<C-l>", "action", "[i]<C-l>", {}, { "context": "insert" });
  CodeMirror.Vim.map("<C-j>", "<Esc>ja", "insert");
  CodeMirror.Vim.map("<C-k>", "<Esc>ka", "insert");

  // Use Ctrl-h/l/j/k to move around in Normal mode
  // otherwise it would trigger browser shortcuts
  CodeMirror.Vim.map("<C-h>", "h", "normal");
  CodeMirror.Vim.map("<C-l>", "l", "normal");
  // Updated for v2.0.0
  // While jupyter-vim-binding use <C-j>/<C-k> to move around cell
  // The following key mappings should not be defined
  //CodeMirror.Vim.map("<C-j>", "j", "normal");
  //CodeMirror.Vim.map("<C-k>", "k", "normal");
  CodeMirror.Vim.map("0", "$", "normal");
  var rate = 0;
  // apply setting to  all current CodeMirror instances
  IPython.notebook.get_cells().map(
      function(c) {  return c.code_mirror.options.cursorBlinkRate=rate;  }
  );

  // make sure new CodeMirror instance also use this setting
  CodeMirror.defaults.cursorBlinkRate=rate;
});
