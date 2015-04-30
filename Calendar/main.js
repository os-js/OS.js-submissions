(function(Application, Window, GUI, Dialogs, Utils, API, VFS) {

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Main Window Constructor
   */
  var ApplicationCalendarWindow = function(app, metadata) {
    Window.apply(this, ['Calendar', {
      icon: metadata.icon,
      title: metadata.name,
      width: 230,
      height: 236,
      allow_resize: false,
      allow_restore: false,
      allow_maximize: false
    }, app]);

    this.iframeWindow = null;
  };

  ApplicationCalendarWindow.prototype = Object.create(Window.prototype);

  ApplicationCalendarWindow.prototype.init = function(wmRef, app) {
    var self = this;
    var root = Window.prototype.init.apply(this, arguments);
    var src = API.getApplicationResource(app, 'data/index.html');
    this._addGUIElement(new GUI.IFrame('CalendarIframe', {src: src}), root);
    return root;
  };

  ApplicationCalendarWindow.prototype._inited = function() {
    Window.prototype._inited.apply(this, arguments);
  };

  ApplicationCalendarWindow.prototype.destroy = function() {
    Window.prototype.destroy.apply(this, arguments);
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Application constructor
   */
  var ApplicationCalendar = function(args, metadata) {
    Application.apply(this, ['ApplicationCalendar', args, metadata]);
  };

  ApplicationCalendar.prototype = Object.create(Application.prototype);

  ApplicationCalendar.prototype.destroy = function() {
    return Application.prototype.destroy.apply(this, arguments);
  };

  ApplicationCalendar.prototype.init = function(settings, metadata) {
    var self = this;

    Application.prototype.init.apply(this, arguments);

    // Create your main window
    var mainWindow = this._addWindow(new ApplicationCalendarWindow(this, metadata));
  };

  ApplicationCalendar.prototype._onMessage = function(obj, msg, args) {
    Application.prototype._onMessage.apply(this, arguments);

    // Make sure we kill our application if main window was closed
    if ( msg == 'destroyWindow' && obj._name === 'ApplicationCalendarWindow' ) {
      this.destroy();
    }
  };

  //
  // EXPORTS
  //
  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationCalendar = OSjs.Applications.ApplicationCalendar || {};
  OSjs.Applications.ApplicationCalendar.Class = ApplicationCalendar;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
