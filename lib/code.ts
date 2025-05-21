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

  if (msg.type === "get-frame-data") {
    const selection = figma.currentPage.selection;

    // error checks
    if (selection.length === 0) {
      figma.ui.postMessage({
        type: "frame-data-error",
        message: "Please select a frame and try again!",
      });
      return;
    }
    if (selection.length > 1) {
      figma.ui.postMessage({
        type: "frame-data-error",
        message: "One frame at a time please!",
      });
      return;
    }

    const frame = selection[0] as FrameNode;
    const nodes = frame.findAll();

    // helper to turn a SolidPaint into rgba()
    function paintToRGBA(paint: SolidPaint): string {
      const { r, g, b } = paint.color;
      const a = paint.opacity !== undefined ? paint.opacity : 1;
      return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }

    const extracted = nodes.map((node) => {
      // get bounding box data
      const box = node.absoluteBoundingBox!;
      const fills = ('fills' in node && Array.isArray(node.fills))
        ? (node.fills as ReadonlyArray<Paint>)
        : [];

      // collect only solid fills as CSS strings
      const backgroundColors = fills
        .filter((p) => p.type === "SOLID")
        .map((p) => paintToRGBA(p as SolidPaint));

      const item: any = {
        type: node.type,
        name: node.name,
        position: { x: box.x, y: box.y },
        size: { width: box.width, height: box.height },
        fills: backgroundColors,
      };

      // text-specific props
      if ("characters" in node) {
        item.text = node.characters;
        item.fontSize = node.fontSize;
      }

      // corner radius (if any)
      if ("cornerRadius" in node) {
        item.cornerRadius = node.cornerRadius;
      }

      return item;
    });

    figma.ui.postMessage({
      type: "frame-data-response",
      data: JSON.stringify(extracted),
    });
  }

  //This saves the api key from the settings form
  if (msg.type === 'save-settings') {
    try {
      await figma.clientStorage.setAsync('oaiApiKey', msg.apiKey);
      await figma.clientStorage.setAsync('oaiApiModel', msg.apiModel);
      
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
  // await figma.clientStorage.setAsync('oaiApiKey', undefined);
  // await figma.clientStorage.setAsync('oaiApiModel', undefined);

  //Get the variables saved in Figma
  const savedKey = await figma.clientStorage.getAsync('oaiApiKey');
  const savedModel = await figma.clientStorage.getAsync('oaiApiModel');
  const savedDSLink = await figma.clientStorage.getAsync('dsLink');
  const userName = (figma.currentUser !== null ? figma.currentUser.name : 'Anonymous');

  // Send the saved key to the UI after loading
  figma.ui.postMessage({
    type: 'load-saved-data',
    apiKey: savedKey || '',
    apiModel: savedModel || '',
    dsLink: savedDSLink || '',
    user: userName,
  });
  // console.log("saved key: " + savedKey);
  // console.log("saved model: " + savedModel);
  // console.log("saved ds link: " + savedDSLink);
  // console.log("user name: " + userName);
})();
