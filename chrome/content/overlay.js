Components.utils.import('resource://unplug/activity.jsm');
var unplug =
{
 init: function()
 {
  window.setInterval(unplug.check, 10000);
 },
 check: function()
 {
  if (unplug_activity.popup)
   return;
  let pluginHost = Components.classes["@mozilla.org/plugin/host;1"].getService(Components.interfaces.nsIPluginHost);
  let pluginTags = pluginHost.getPluginTags();
  let newPlugins = [];
  for (let i = 0; i < pluginTags.length; i++)
  {
   let block = pluginTags[i].blocklistState;
   if (block === 2)
    continue;
   let prefShown = 'plugin.prompt.' + pluginTags[i].niceName;
   if (unplug.getBoolPref(prefShown, false))
    continue;
   newPlugins.push(pluginTags[i]);
  }
  if (newPlugins.length === 0)
   return;
  unplug_activity.popup = true;
  unplug.showDialog(newPlugins);
 },
 showDialog: function(newPlugins)
 {
  let pHeight = 180;
  if (newPlugins.length > 1)
   pHeight = 340;
  window.openDialog('chrome://unplug/content/popup.xul', 'unplugPopup', 'chrome,dialog,resizable=no,scrollbars=no,top=120,left=120,innerWidth=480,innerHeight=' + pHeight + ',alwaysRaised', newPlugins);
  unplug_activity.popup = false;
 },
 getBoolPref: function(prefName, defVal)
 {
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.prefHasUserValue(prefName))
   return prefs.getBoolPref(prefName);
  else
   return defVal;
 }
};

window.addEventListener('load', unplug.init, false);
