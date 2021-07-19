Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('resource://gre/modules/AddonManager.jsm');
var newplugin =
{
 gPlugin: null,
 initialize: function()
 {
  let spec = document.location.href;
  let pos = spec.indexOf('?');
  let query = '';
  if (pos >= 0)
   query = spec.slice(pos + 1);
  let id = query.slice(3);
  if (!id)
  {
   window.location = 'about:blank';
   return;
  }

  let pluginHost = Components.classes['@mozilla.org/plugin/host;1'].getService(Components.interfaces.nsIPluginHost);
  let pluginTags = pluginHost.getPluginTags();
  let aPlugin = null;
  for (let i = 0; i < pluginTags.length; i++)
  {
   if (pluginTags[i].niceName === id)
   {
    aPlugin = pluginTags[i];
    break;
   }
  }
  if (aPlugin === null)
  {
   window.close()
   return;
  }
  if (aPlugin.blocklistState === 2)
  {
   window.close()
   return;
  }
  newplugin.gPlugin = aPlugin;

  let bundle = Services.strings.createBundle('chrome://mozapps/locale/extensions/newaddon.properties');
  let name = bundle.formatStringFromName('name', [aPlugin.name, aPlugin.version], 2);
  document.getElementById('name').value = name;
  
  if (aPlugin.creator)
  {
   let creator = bundle.formatStringFromName('author', [aPlugin.creator], 1);
   document.getElementById('author').value = creator;
  }
  else
   document.getElementById('author').hidden = true;

  if (aPlugin.fullpath)
  {
   let location = bundle.formatStringFromName('location', [aPlugin.fullpath], 1);
   document.getElementById('location').value = location;
   document.getElementById('location').setAttribute('tooltiptext', location);
  }
  else
   document.getElementById('location').hidden = true;

  if (aPlugin.description)
   document.getElementById('description').textContent = aPlugin.description;
  else
   document.getElementById('description').hidden = true;

  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefs.addObserver('plugin.prompt.' + aPlugin.niceName, newplugin.prefObserver, false);
  let oDef = -1;
  if (prefs.prefHasUserValue('plugin.state.' + aPlugin.niceName))
   oDef = prefs.getIntPref('plugin.state.' + aPlugin.niceName);
  if (oDef === -1)
  {
   if (aPlugin.disabled)
    oDef = 0;
   else if (aPlugin.clicktoplay)
    oDef = 1;
   else
    oDef = 2;
  }
  if (aPlugin.blocklistState > 3)
  {
   document.getElementById('activate_yes').hidden = true;
   if (oDef === 2)
    oDef = 1;
  }
  document.getElementById('activation').value = oDef;
 },
 unload: function()
 {
  let prefShown = 'plugin.prompt.' + newplugin.gPlugin.niceName;
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefs.setBoolPref(prefShown, true);
  prefs.removeObserver(prefShown, newplugin.prefObserver);
 },
 prefObserver: {
  observe: function(aSubject, aTopic, aData)
  {
   let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
   let prefPrompt = 'plugin.prompt.' + newplugin.gPlugin.niceName;
   if (prefs.prefHasUserValue(prefPrompt))
   {
    if (prefs.getBoolPref(prefPrompt))
     window.close();
   }
  }
 },
 continueClicked: function()
 {
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefs.removeObserver('plugin.prompt.' + newplugin.gPlugin.niceName, newplugin.prefObserver);
  let baseName = newplugin.gPlugin.niceName;
  let prefName = 'plugin.state.' + baseName;
  let prefVal = document.getElementById('activation').value;
  prefs.setIntPref(prefName, prefVal);
  let prefShown = 'plugin.prompt.' + baseName;
  prefs.setBoolPref(prefShown, true);
  window.close();
 }
};
