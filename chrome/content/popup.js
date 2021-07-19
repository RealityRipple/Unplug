var unplug_popup = {
 nameList: [],
 init: function()
 {
  let s = window.arguments[0];
  const XUL_NS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
  let pLoc = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://unplug/locale/popup.properties');
  let locale = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://mozapps/locale/extensions/extensions.properties');
  let listing = document.getElementById('listing');
  for (let i = 0; i < s.length; i++)
  {
   let block = s[i].blocklistState;
   let fullName = s[i].name;
   let ver = s[i].version;
   let fileName = s[i].fullpath;
   let desc = s[i].description;
   let baseName = s[i].niceName;
   unplug_popup.nameList.push(baseName);
   let prefName = 'plugin.state.' + baseName;

   let locPath = pLoc.GetStringFromName('path.label');
   let locYes = document.getElementById('lclYes').getAttribute('data-value');
   let locYesTT = document.getElementById('lclYes').getAttribute('data-tooltip');
   let locAsk = document.getElementById('lclAsk').getAttribute('data-value');
   let locAskTT = document.getElementById('lclAsk').getAttribute('data-tooltip');
   let locNo = document.getElementById('lclNo').getAttribute('data-value');
   let locNoTT = document.getElementById('lclNo').getAttribute('data-tooltip');

   let oBox = document.createElementNS(XUL_NS, 'vbox');
   let oTitleLbl = document.createElementNS(XUL_NS, 'label');
   oTitleLbl.setAttribute('class', 'title');
   oTitleLbl.setAttribute('value', fullName);
   oBox.appendChild(oTitleLbl);
   let oTitleSpc = document.createElementNS(XUL_NS, 'spacer');
   oTitleSpc.setAttribute('flex', '1');
   oBox.appendChild(oTitleSpc);
   let oVerLbl = document.createElementNS(XUL_NS, 'label');
   oVerLbl.setAttribute('class', 'version');
   oVerLbl.setAttribute('value', 'v' + ver);
   oBox.appendChild(oVerLbl);
   let oVerSpc = document.createElementNS(XUL_NS, 'spacer');
   oVerSpc.setAttribute('flex', '2');
   oBox.appendChild(oVerSpc);
   let oDesc = document.createElementNS(XUL_NS, 'description');
   oDesc.textContent = desc;
   oBox.appendChild(oDesc);
   let oDescSpc = document.createElementNS(XUL_NS, 'spacer');
   oDescSpc.setAttribute('flex', '2');
   oBox.appendChild(oDescSpc);
   let oPathBox = document.createElementNS(XUL_NS, 'hbox');
   let oPathLbl = document.createElementNS(XUL_NS, 'label');
   oPathLbl.setAttribute('value', locPath);
   oPathBox.appendChild(oPathLbl);
   let oPathTxt = document.createElementNS(XUL_NS, 'textbox');
   oPathTxt.setAttribute('flex', '1');
   oPathTxt.setAttribute('readonly', 'true');
   oPathTxt.setAttribute('value', fileName);
   oPathBox.appendChild(oPathTxt);
   oBox.appendChild(oPathBox);
   let oPathSpc = document.createElementNS(XUL_NS, 'spacer');
   oPathSpc.setAttribute('flex', '1');
   oBox.appendChild(oPathSpc);
   let oActBox = document.createElementNS(XUL_NS, 'hbox');
   oActBox.setAttribute('align', 'right');
   let oActGrp = document.createElementNS(XUL_NS, 'radiogroup');
   oActGrp.setAttribute('id', 'grp' + baseName);
   oActGrp.setAttribute('orient', 'horizontal');
   let oDef = unplug_popup.getIntPref(prefName, -1);
   if (oDef === -1)
   {
    if (s[i].disabled)
     oDef = 0;
    else if (s[i].clicktoplay)
     oDef = 1;
    else
     oDef = 2;
   }
   if (block < 4)
   {
    let oYes = document.createElementNS(XUL_NS, 'radio');
    oYes.setAttribute('value', '2');
    oYes.setAttribute('label', locYes);
    oYes.setAttribute('tooltiptext', locYesTT);
    if (oDef === 2)
     oYes.setAttribute('selected', 'true');
    oActGrp.appendChild(oYes);
   }
   else
   {
    let oVuln = document.createElementNS(XUL_NS, 'label');
    let sPlg = pLoc.GetStringFromName('plugin.insert');
    if (block === 4)
     oVuln.setAttribute('value', locale.formatStringFromName('details.notification.vulnerableUpdatable', [sPlg], 1));
    else
     oVuln.setAttribute('value', locale.formatStringFromName('details.notification.vulnerableNoUpdate', [sPlg], 1));
    oBox.appendChild(oVuln);
   }
   let oAsk = document.createElementNS(XUL_NS, 'radio');
   oAsk.setAttribute('value', '1');
   oAsk.setAttribute('label', locAsk);
   oAsk.setAttribute('tooltiptext', locAskTT);
   if (oDef === 1)
    oAsk.setAttribute('selected', 'true');
   oActGrp.appendChild(oAsk);
   let oNo = document.createElementNS(XUL_NS, 'radio');
   oNo.setAttribute('value', '0');
   oNo.setAttribute('label', locNo);
   oNo.setAttribute('tooltiptext', locNoTT);
   if (oDef === 0)
    oNo.setAttribute('selected', 'true');
   oActGrp.appendChild(oNo);
   oActBox.appendChild(oActGrp);
   oBox.appendChild(oActBox);
   listing.appendChild(oBox);
   if (i < s.length - 1)
   {
    let oLineSpc1 = document.createElementNS(XUL_NS, 'spacer');
    oLineSpc1.setAttribute('flex', '1');
    listing.appendChild(oLineSpc1);
    let oLine = document.createElementNS('http://www.w3.org/1999/xhtml', 'hr');
    oLine.setAttribute('flex', '1');
    listing.appendChild(oLine);
    let oLineSpc2 = document.createElementNS(XUL_NS, 'spacer');
    oLineSpc2.setAttribute('flex', '1');
    listing.appendChild(oLineSpc2);
   }
  }
 },
 onOK: function()
 {
  for (let i = 0; i < unplug_popup.nameList.length; i++)
  {
   let baseName = unplug_popup.nameList[i];
   let prefName = 'plugin.state.' + baseName;
   let prefVal = document.getElementById('grp' + baseName).value;
   unplug_popup.setIntPref(prefName, prefVal);
   let prefShown = 'plugin.prompt.' + baseName;
   unplug_popup.setBoolPref(prefShown, true);
  }
 },
 onCancel: function()
 {
  for (let i = 0; i < unplug_popup.nameList.length; i++)
  {
   let prefShown = 'plugin.prompt.' + unplug_popup.nameList[i];
   unplug_popup.setBoolPref(prefShown, true);
  }
 },
 getIntPref: function(prefName, defVal)
 {
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.prefHasUserValue(prefName))
   return prefs.getIntPref(prefName);
  else
   return defVal;
 },
 setIntPref: function(prefName, prefVal)
 {
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefs.setIntPref(prefName, prefVal);
 },
 setBoolPref: function(prefName, prefVal)
 {
  let prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefs.setBoolPref(prefName, prefVal);
 }
};