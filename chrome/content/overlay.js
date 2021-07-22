var unplug =
{
 init: function()
 {
  AboutNewPluginService.register();
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
   unplug.showPage('about:newplugin?id=' + newPlugins[i].niceName);
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

var AboutNewPluginService = {
 impl:
 {
  ioService: null,
  newChannel: function(aURI, aLoadInfo)
  {
   if (!AboutNewPluginService.ioService)
    AboutNewPluginService.ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
   let uri = AboutNewPluginService.ioService.newURI('chrome://unplug/content/newplugin.xul', null, null);
   let chan = AboutNewPluginService.ioService.newChannelFromURIWithLoadInfo(uri, aLoadInfo);
   chan.originalURI = aURI;
   return chan;
  },
  QueryInterface: function(iid)
  {
   if (!iid.equals(Components.interfaces.nsISupports) && !iid.equals(Components.interfaces.nsIAboutModule))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
  },
  getURIFlags: function(aURI)
  {
   return Components.interfaces.nsIAboutModule.ALLOW_SCRIPT | Components.interfaces.nsIAboutModule.HIDE_FROM_ABOUTABOUT;
  }
 },
 factory:
 {
  createInstance: function(outer, iid)
  {
   if (outer !== null)
    throw Components.results.NS_ERROR_NO_AGGREGATION;
   if (!iid.equals(Components.interfaces.nsIAboutModule) && !iid.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_INVALID_ARG;
   return AboutNewPluginService.impl.QueryInterface(iid);
  }
 },
 register: function()
 {
  let compman = Components.manager;
  compman.QueryInterface(Components.interfaces.nsIComponentRegistrar);
  let cid = Components.ID('{88A17F3D-2B10-5F12-8ED8-0C9DC7EC3784}');
  let contractid = '@mozilla.org/network/protocol/about;1?what=newplugin';
  if (!compman.isCIDRegistered(cid))
   compman.registerFactory(cid, 'AboutNewPluginService', contractid, AboutNewPluginService.factory);
 }
};

window.addEventListener('load', unplug.init, false);
