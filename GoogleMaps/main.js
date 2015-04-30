(function(Application, Window, GUI, Dialogs, Utils, API, VFS) {

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Main Window Constructor
   */
  var ApplicationMapWindow = function(app, metadata) {
    Window.apply(this, ['ApplicationMapWindow', {
      icon: metadata.icon,
      title: metadata.name,
      width: 640,
      height: 400,
      allow_resise: false,
      allow_restore: false,
      allow_maximize: false
    }, app]);

    this.iframeWindow = null;
  };

  ApplicationMapWindow.prototype = Object.create(Window.prototype);

  ApplicationMapWindow.prototype.init = function(wmRef, app) {
    var self = this;
    var root = Window.prototype.init.apply(this, arguments);
    var src = API.getApplicationResource(app, 'data/index.html');

    this._addGUIElement(new GUI.IFrame('MapIframe', {src: src}), root);
    return root;
  };

  ApplicationMapWindow.prototype._inited = function() {
    Window.prototype._inited.apply(this, arguments);
  };

  ApplicationMapWindow.prototype.destroy = function() {
    Window.prototype.destroy.apply(this, arguments);
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Application constructor
   */
  var ApplicationMap = function(args, metadata) {
    Application.apply(this, ['ApplicationMap', args, metadata]);
  };

  ApplicationMap.prototype = Object.create(Application.prototype);

  ApplicationMap.prototype.destroy = function() {
    return Application.prototype.destroy.apply(this, arguments);
  };

  ApplicationMap.prototype.init = function(settings, metadata) {
    Application.prototype.init.apply(this, arguments);
    var mainWindow = this._addWindow(new ApplicationMapWindow(this, metadata));
  };

  ApplicationMap.prototype._onMessage = function(obj, msg, args) {
    Application.prototype._onMessage.apply(this, arguments);
    if ( msg == 'destroyWindow' && obj._name === 'ApplicationMapWindow' ) {
      this.destroy();
    }
  };

  //
  // EXPORTS
  //
  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationMap = OSjs.Applications.ApplicationMap || {};
  OSjs.Applications.ApplicationMap.Class = ApplicationMap;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
