// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {themeColors: true, width: 640, height: 917 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  async (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-shapes') {
  //   // This plugin creates rectangles on the screen.
  //   const numberOfRectangles = msg.count;

  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < numberOfRectangles; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  //This saves the api key from the settings form
  if (msg.type === 'save-api-key') {
    try {
      await figma.clientStorage.setAsync('oaiApiKey', msg.apiKey);
      
      //The below is just used for testing.
      //const saved = await figma.clientStorage.getAsync('oaiApiKey');
      //console.log("Saved key:", saved);
    } catch (err) {
      console.error("Storage error:", err);
    }
  }
  //This saves the DS Link from the settings form
  if (msg.type === 'save-ds-link') {
    try {
      await figma.clientStorage.setAsync('dsLink', msg.dsLink);
      
      //The below is just used for testing.
      //const saved = await figma.clientStorage.getAsync('oaiApiKey');
      //console.log("Saved key:", saved);
    } catch (err) {
      console.error("Storage error:", err);
    }
  }
  //To-Do: Add a save-model section here to save the selected model from the settings form.
  
  //This closes the plugin - Not currently used.
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

//this gets the api key, userName, and DS link when the plugin starts up.
//To-D-: Add the saved model to the information returned.
(async () => {
  //for testing clear the api key on open - remove before publishing.
  await figma.clientStorage.setAsync('oaiApiKey', "");

  //Get the variables saved in Figma
  const savedKey = await figma.clientStorage.getAsync('oaiApiKey');
  const savedDSLink = await figma.clientStorage.getAsync('dsLink');
  const userName = (figma.currentUser !== null ? figma.currentUser.name : 'Anonymous');

  // Send the saved key to the UI after loading
  figma.ui.postMessage({
    type: 'load-saved-data',
    apiKey: savedKey || '',
    dsLink: savedDSLink || '',
    user: userName,
  });
  console.log("saved key: " + savedKey);
  console.log("saved ds link: " + savedDSLink);
  console.log("user name: " + userName);
})();
