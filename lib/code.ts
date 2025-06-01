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
  if(msg.type === 'request-saved-data') {
    //FOR TESTING:
    //ClearTestData();

    try {
      // 1. Fetch all four keys in parallel
      const [
        rawApiKey,
        rawModel,
        rawDsLink,
        rawPrimaryColor,
      ] = await Promise.all([
        figma.clientStorage.getAsync('mn-oaiApiKey'),
        figma.clientStorage.getAsync('mn-oaiApiModel'),
        figma.clientStorage.getAsync('mn-dsLink'),
        figma.clientStorage.getAsync('mn-primaryColor'),
      ]);

      // 2. Figure out “is there actually something stored?” for each key
      const hasApiKey = rawApiKey !== undefined;
      const hasApiModel = rawModel !== undefined;
      const hasDsLink = rawDsLink !== undefined;
      const hasPrimaryColor = rawPrimaryColor !== undefined;

      // 3. If you want a single flag for “any data at all”
      const hasAnyData =
        hasApiKey || hasApiModel || hasDsLink || hasPrimaryColor;

      // 4. Normalize undefined → null (or leave undefined) so the UI can tell:
      const savedKey = hasApiKey ? (rawApiKey as string) : null;
      const savedModel = hasApiModel ? (rawModel as string) : null;
      const savedDsLink = hasDsLink ? (rawDsLink as string) : null;
      const savedPrimaryColor = hasPrimaryColor
        ? (rawPrimaryColor as string)
        : null;

      const userName = (figma.currentUser !== null ? figma.currentUser.name : 'Anonymous');

      // 5. Send everything—including “hasX” flags—back to the UI
      figma.ui.postMessage({
        type: 'load-saved-data',
        apiKey: savedKey,
        apiModel: savedModel,
        dsLink: savedDsLink,
        primaryColor: savedPrimaryColor,
        user: userName,
        // you can consume individual flags in the UI or use a single “hasAnyData”
        hasApiKey,
        hasApiModel,
        hasDsLink,
        hasPrimaryColor,
        hasAnyData,
      });
    } catch (err) {
      // 6. If something goes wrong, report it so the UI can show an error state
      figma.ui.postMessage({
        type: 'load-error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }


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
      await figma.clientStorage.setAsync('mn-oaiApiKey', msg.apiKey);
      await figma.clientStorage.setAsync('mn-oaiApiModel', msg.apiModel);
      await figma.clientStorage.setAsync('mn-primaryColor', msg.primaryColor);
      await figma.clientStorage.setAsync('mn-dsLink', msg.dsLink);

    } catch (err) {
      console.error("Storage error:", err);
    }
  }
  
  //This closes the plugin - Not currently used.
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

async function ClearTestData() {
  await figma.clientStorage.deleteAsync("mn-oaiApiKey");
  await figma.clientStorage.deleteAsync("mn-oaiApiModel");
  await figma.clientStorage.deleteAsync("mn-primaryColor");
  await figma.clientStorage.deleteAsync("mn-dsLink");
}