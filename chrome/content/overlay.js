var unplug =
{
 init: function()
 {
  window.setInterval(unplug.check, 10000);
  window.setTimeout(unplug.check, 1000);
 },
 check: function()
 {
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
  for (let i = 0; i < newPlugins.length; i++)
  {
   unplug.showPage('chrome://unplug/content/newplugin.xul?id=' + newPlugins[i].niceName);
  }
 },
 showPage: function(url)
 {
  let mdtr = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
  let brw = mdtr.getEnumerator('navigator:browser');
  while (brw.hasMoreElements())
  {
   let wnd = brw.getNext();
   let gw = wnd.gBrowser;
   for (let i = 0; i < gw.browsers.length; i++)
   {
    let bri = gw.getBrowserAtIndex(i);
    if (bri.currentURI.spec === url)
     return;
   }
  }
  let rwnd = mdtr.getMostRecentWindow('navigator:browser');
  if (rwnd)
  {
   let nw = rwnd.gBrowser.addTab(url, null, null, null, null, null);
   rwnd.gBrowser.selectedTab = nw;
   return;
  }
  window.open(url);
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
