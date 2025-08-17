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

    const extractedData = await Promise.all([serializeNode(selection[0] as SceneNode)]);

    figma.ui.postMessage({
      type: "frame-data-response",
      data: JSON.stringify(extractedData),
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

// async function convertPaint(
//   paint: SolidPaint
// ): Promise<{ hex: string; alpha: string; variable?: string }> {
//   // 1. Build the hex + alphaPercent exactly as before
//   const { r, g, b } = paint.color;
//   const alphaExt = paint.opacity || 1;
//   const alpha = Math.round(alphaExt * 100);
//   const toHex = (n: number) =>
//     Math.round(n)
//       .toString(16)
//       .padStart(2, "0")
//       .toUpperCase();

//   const hex = `#${toHex(r * 255)}${toHex(g * 255)}${toHex(b * 255)}`;

//   // 2. If there's a bound color variable, look up its name
//   let variable: string | undefined;
//   const varRef = (paint as any).boundVariables.color;
//   if (varRef.id) {
//     const variableObj = await figma.variables.getVariableByIdAsync(varRef.id);
//     variable = variableObj !== null ? variableObj.name : undefined;
//   } 

//   return { hex, alpha: `${alpha}%`, variable };
// }

// // Serialize any node, capturing name, type, fills & typography, then recurse
// function serializeNodeOld(node: SceneNode): any {
//   // capture common info
//   const base: any = {
//     name: node.name,
//     type: node.type,
//   };

//   // if it has fills, capture those
//   if ("fills" in node && Array.isArray(node.fills)) {
//     base.fills = (node.fills as ReadonlyArray<Paint>)
//       .filter(p => p.type === 'SOLID')
//       .map(async p => await convertPaint(p as SolidPaint));
//   }

//   // if it's a text node, capture typography
//   if (node.type === "TEXT") {
//     const tn = node as TextNode;
//     const font = tn.fontName as FontName;
//     const lh = typeof tn.lineHeight === 'object'
//       ? tn.lineHeight
//       : (typeof tn.lineHeight === 'number' ? tn.lineHeight : null);
//     const ls = typeof tn.letterSpacing === 'object'
//       ? tn.letterSpacing.value
//       : (typeof tn.letterSpacing === 'number' ? tn.letterSpacing : null);

//     base.text = tn.characters;
//     base.typography = {
//       fontFamily: font.family,
//       fontStyle: font.style,
//       fontSize: tn.fontSize as number,
//       lineHeight: lh,
//       letterSpacing: ls,
//     };
//   }

//   // if instance, capture componentProperties
//   // if ("componentProperties" in node && node.componentProperties) {
//   //   base.componentProperties = { ...node.componentProperties };
//   // }

//   // recurse into children if any
//   if ("children" in node) {
//     base.children = node.children.map(child => serializeNode(child));
//   }

//   return base;
// }

async function paintToHexAndAlphaPercentWithVar(
  paint: SolidPaint | ColorStop
): Promise<{ hex: string; alpha: string; token: string | undefined }> {
  // 1. Build the hex + alphaPercent exactly as before
  const { r, g, b } = paint.color;
  var alpha = 1;
  if ("opacity" in paint && paint.opacity !== undefined) {
    alpha = paint.opacity;
  } else if ("a" in paint.color) {
    alpha = paint.color.a as number;
  }
  
  const toHex = (n: number) =>
    Math.round(n)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  const hex = `#${toHex(r * 255)}${toHex(g * 255)}${toHex(b * 255)}`;
  const alphaPercent = Math.round(alpha * 100);

  // 2. If there's a bound color variable, look up its name
  var variable: string | undefined = undefined;
  if (paint.boundVariables !== undefined && paint.boundVariables.color !== undefined) {
    variable = await getTokenName(paint.boundVariables.color.id);
  }
  
  return { hex, alpha: `${alphaPercent}%`, token: variable};
}

async function getTokenName(id: string) {
  const rawVariable = await figma.variables.getVariableByIdAsync(id);
  if (rawVariable !== null) {
    const rawCollection = await figma.variables.getVariableCollectionByIdAsync(
      rawVariable.variableCollectionId,
    );
    if (rawCollection !== null) {
      const fullVariable = (
        rawCollection.name +
        "." +
        rawVariable.name
      ).replace(/(\s•\s|\/)/g, ".");
      //var variableValuesPerMode = rawVariable.valuesByMode
      //To-Do: Show the value that the variable stands for per mode!
      return fullVariable;
    }
  }
  return rawVariable !== null ? rawVariable.name : undefined;
}

async function getStyleName(id: string) {
  const rawStyle = await figma.getStyleByIdAsync(id);
  if (rawStyle !== null) {
    const fullStyleName = rawStyle.name.replace(/(\s•\s|\/)/g, ".");
    return fullStyleName;
  } else {
    return undefined
  }
}

async function serializeNode(
  node: SceneNode
): Promise<any> {
  //project the node as an any for looping through more easily.
  const anyNode = node as any;

  // capture common info
  const base: any = {
    name: node.name,
    type: node.type,
  };
  
  // ── Locked ───────────────────────────────────────────────────────
  if ("locked" in node) {
    base.locked = node.locked;
  }

//Position
  base.position = {};
  // ── Rotation ───────────────────────────────────────────────────────
  if ("rotation" in node) {
    base.position.rotation = node.rotation;
  } 
  // ── X and Y ───────────────────────────────────────────────────────
  if ('x' in node) {
    base.position.x = node.x;
  }
  if ('y' in node) {
    base.position.y = node.y;
  }

//LAYOUT
  base.layout = {};
  // ── SIZE ────────────────────────────────────────────────────────────
  // if it has a height or width set, capture that information.
  if (typeof node.width === "number" &&  typeof node.height === "number") {
    for (const prop of ["height", "width", "minHeight", "maxHeight", "minWidth", "maxWidth"]) {
      if (anyNode.boundVariables !== undefined && anyNode.boundVariables[prop] !== undefined) {
        const variable = await getTokenName(anyNode.boundVariables[prop].id);
        base.layout[prop] = {value: `${anyNode[prop]}px`, token: `size.${variable}`};
      } else if (anyNode[prop] !== null){
        base.layout[prop] = {value: `${anyNode[prop]}px`, token: undefined};
      }
    }
  }

  // ── AUTO-LAYOUT / SPACING ────────────────────────────────────────
  // Only FrameNode/ComponentNode/InstanceNode support Auto-layout
  if ("layoutMode" in node && node.layoutMode !== "NONE") {
    for (const prop of ["itemSpacing", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight"]) {
      if (anyNode.boundVariables !== undefined && anyNode.boundVariables[prop] !== undefined) {
        const variable = await getTokenName(anyNode.boundVariables[prop].id);
        base.layout[prop] = {value: `${anyNode[prop]}px`, token: `size.${variable}`};
      } else if (anyNode[prop] !== null){
        base.layout[prop] = {value: `${anyNode[prop]}px`, token: undefined};
      }
    }
    base.layout.layoutMode = node.layoutMode;
    base.layout.primaryAxisSizingMode = node.primaryAxisSizingMode;
    base.layout.counterAxisSizingMode = node.counterAxisSizingMode;
    base.layout.primaryAxisAlignItems = node.primaryAxisAlignItems;
    base.layout.counterAxisAlignItems = node.counterAxisAlignItems;
  }

//APPEARANCE
  base.appearance = {};
  // ── Opacity ───────────────────────────────────────────────────────
  if ("opacity" in node) {
    if (node.boundVariables !== undefined && node.boundVariables.opacity !== undefined) {
      const opacityToken = await getTokenName(node.boundVariables.opacity.id);
      base.appearance.opacity = {
        value: `${node.opacity * 100}%`,
        token: opacityToken,
      }
    } else {
      base.appearance.opacity = {
        value: `${node.opacity * 100}%`,
        token: undefined,
      }
    }
  }

  // ── Blend Mode ───────────────────────────────────────────────────────
  if ("blendMode" in node) {
    base.appearance.blendMode = node.blendMode;
  }

  // ── Visibility ───────────────────────────────────────────────────────
  if ("visible" in node) {
    base.appearance.visible = node.visible;
  }

  // ── BORDER RADIUS ─────────────────────────────────────────────────────
  // Capture the border radius if it has uniform cornerRadius
  if ("cornerRadius" in node && typeof (node as any).cornerRadius === "number") {
    const radius = (node as any).cornerRadius as number;
    if (node.boundVariables !== undefined && node.boundVariables.topLeftRadius !== undefined) {
      let varName = await getTokenName(node.boundVariables.topLeftRadius.id);
      base.appearance.cornerRadius = {size: `${radius}px`, token: varName};
    } else {
      base.appearance.cornerRadius = {size: `${radius}px`, token: undefined};
    }
  } else {
    base.appearance.cornerRadius = {};
    for (const prop of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) { 
      if (anyNode.boundVariables !== undefined && anyNode.boundVariables[prop] !== undefined) {
        const varName = await getTokenName(anyNode.boundVariables[prop].id);
        base.appearance.cornerRadius[prop] = {size: `${anyNode[prop] as number}px`, token: varName};
      } else if (anyNode[prop] !== undefined) {
        base.appearance.cornerRadius[prop] = {size: `${anyNode[prop] as number}px`, token: undefined};
      }      
    };
  }
  
//FILLS
  // ── FILLS ────────────────────────────────────────────────────────────
  // if it has fills, capture those
  if ("fills" in node && Array.isArray(node.fills) && node.fills.length > 0) {
    base.fill = {};
    if ("fillStyleId" in node && typeof node.fillStyleId === "string") {
      base.fill.style = await getStyleName(node.fillStyleId);
    }
    if (node.fills.length > 1) {
      const fillLayers: any[] = [];
      (node.fills as ReadonlyArray<Paint>).forEach(async paint => {
        if (paint.type === 'SOLID') {
          var fill = await paintToHexAndAlphaPercentWithVar(paint as SolidPaint);
          fillLayers.push({
            type: paint.type,
            hex: fill.hex,
            alpha: fill.alpha,
            token: fill.token,
            blendMode: paint.blendMode,
          });
        } else if (paint.type === 'IMAGE' || paint.type === 'VIDEO'){
          fillLayers.push({
            type: paint.type,
            scaleMode: paint.scaleMode,
            opacity: paint.opacity !== undefined ? `${(paint.opacity*100)}%` : undefined,
            transform: paint.type === 'IMAGE' ? paint.imageTransform : paint.videoTransform,
            scalingFactor: paint.scalingFactor,
            rotation: paint.rotation,
            filters: paint.filters,
            blendMode: paint.blendMode,
          });
        } else if (paint.type === 'GRADIENT_RADIAL' || paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_DIAMOND' || paint.type === 'GRADIENT_ANGULAR'){
          const gradientPaint = paint as GradientPaint;
          const gradientStops: any[] = [];
          if (gradientPaint.gradientStops !== undefined) {
            gradientPaint.gradientStops.map(async stop => {
              var stopColor = await paintToHexAndAlphaPercentWithVar(stop);
              gradientStops.push({
                hex: stopColor.hex,
                alpha: stopColor.alpha,
                token: stopColor.token,
                position: `${(stop.position*100)}%`,
              });
            });
          }
          fillLayers.push({
            type: gradientPaint.type,
            gradientTransform: gradientPaint.gradientTransform,
            gradientStops: gradientStops,
            blendMode: paint.blendMode,
          });
        } else if (paint.type === 'PATTERN') {
          fillLayers.push({
            type: paint.type,
            tileType: paint.tileType,
            opacity: paint.opacity !== undefined ? `${(paint.opacity*100)}%` : undefined,
            scalingFactor: paint.scalingFactor,
            spacing: paint.spacing,
            horizontalAlignment: paint.horizontalAlignment,
            blendMode: paint.blendMode,
          });
        }
      });
      base.fill.fillLayers = fillLayers;
    } else {
      var singleFill = (node.fills as ReadonlyArray<Paint>)[0];
      if (singleFill !== undefined) {
        if (singleFill.type === "SOLID") {
          var singlePaint = await paintToHexAndAlphaPercentWithVar(singleFill as SolidPaint);
          base.fill.type = singleFill.type;
          base.fill.hex = singlePaint.hex;
          base.fill.alpha = singlePaint.alpha;
          base.fill.token = singlePaint.token;
          base.fill.blendMode = singleFill.blendMode;
        } else if (singleFill.type === 'IMAGE' || singleFill.type === 'VIDEO'){
          base.fill.type = singleFill.type;
          base.fill.scaleMode = singleFill.scaleMode;
          base.fill.opacity = singleFill.opacity !== undefined ? `${(singleFill.opacity*100)}%` : undefined;
          base.fill.transform = singleFill.type === 'IMAGE' ? singleFill.imageTransform : singleFill.videoTransform;
          base.fill.scalingFactor = singleFill.scalingFactor;
          base.fill.rotation = singleFill.rotation;
          base.fill.filters = singleFill.filters;
          base.fill.blendMode = singleFill.blendMode;
        } else if (singleFill.type === 'GRADIENT_RADIAL' || singleFill.type === 'GRADIENT_LINEAR' || singleFill.type === 'GRADIENT_DIAMOND' || singleFill.type === 'GRADIENT_ANGULAR'){
          const gradientPaint = singleFill as GradientPaint;
          const gradientStops: any[] = [];
          if (gradientPaint.gradientStops !== undefined) {
            gradientPaint.gradientStops.map(async stop => {
              var stopColor = await paintToHexAndAlphaPercentWithVar(stop);
              gradientStops.push({
                hex: stopColor.hex,
                alpha: stopColor.alpha,
                token: stopColor.token,
                position: `${(stop.position*100)}%`,
              });
            });
          }
          base.fill.type = gradientPaint.type;
          base.fill.gradientTransform = gradientPaint.gradientTransform;
          base.fill.gradientStops = gradientStops;
          base.fill.blendMode = singleFill.blendMode;
        } else if (singleFill.type === 'PATTERN') {
          base.fill.type = singleFill.type;
          base.fill.tileType = singleFill.tileType;
          base.fill.opacity = singleFill.opacity !== undefined ? `${(singleFill.opacity*100)}%` : undefined;
          base.fill.scalingFactor = singleFill.scalingFactor;
          base.fill.spacing = singleFill.spacing;
          base.fill.horizontalAlignment = singleFill.horizontalAlignment;
          base.fill.blendMode = singleFill.blendMode;
        }
      }
    }
  }

//STROKES
  // –– STROKES ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    // Set up the space for the info
    base.stroke = {};

    //capture the weight and alginment info.
    if (node.strokeWeight === figma.mixed) {
      if ("strokeTopWeight" in node) {
        const top: {size: string, token: string | undefined} = {size: `${node.strokeTopWeight}px`, token: undefined}
        if (node.boundVariables !== undefined && node.boundVariables.strokeTopWeight !== undefined) {
          top.token = await getTokenName(node.boundVariables.strokeTopWeight.id);
        }
        const bottom: {size: string, token: string | undefined} = {size: `${node.strokeBottomWeight}px`, token: undefined}
        if (node.boundVariables !== undefined && node.boundVariables.strokeBottomWeight !== undefined) {
          bottom.token = await getTokenName(node.boundVariables.strokeBottomWeight.id);
        }
        const left: {size: string, token: string | undefined} = {size: `${node.strokeLeftWeight}px`, token: undefined}
        if (node.boundVariables !== undefined && node.boundVariables.strokeLeftWeight !== undefined) {
          left.token = await getTokenName(node.boundVariables.strokeLeftWeight.id);
        }
        const right: {size: string, token: string | undefined} = {size: `${node.strokeRightWeight}px`, token: undefined}
        if (node.boundVariables !== undefined && node.boundVariables.strokeRightWeight !== undefined) {
          right.token = await getTokenName(node.boundVariables.strokeRightWeight.id);
        }
        base.stroke.weight = {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
          };
        base.stroke.position = node.strokeAlign;
      };
    } else {
      const weight: {size: string, token: string | undefined} = {size: `${node.strokeWeight}px`, token: undefined}
      if (node.boundVariables !== undefined && node.boundVariables.strokeWeight !== undefined) {
        weight.token = await getTokenName(node.boundVariables.strokeWeight.id);
      }
      base.stroke.weight = weight;
      base.stroke.position = node.strokeAlign;
    };

    if ("strokeStyleId" in node && node.strokeStyleId !== undefined) {
      base.stroke.style = await getStyleName(node.strokeStyleId);
    }

    if (node.strokes.length > 1) {
      const strokeLayers: any[] = [];
      (node.strokes as ReadonlyArray<Paint>).forEach(async sPaint => {
        if (sPaint.type === 'SOLID') {
          const strokePaint = await paintToHexAndAlphaPercentWithVar(sPaint as SolidPaint);
          strokeLayers.push({
            type: sPaint.type,
            hex: strokePaint.hex,
            alpha: strokePaint.alpha,
            token: strokePaint.token,
            blendMode: sPaint.blendMode,
          });
        } else if (sPaint.type === 'VIDEO' || sPaint.type === 'IMAGE') {
          strokeLayers.push({
            type: sPaint.type,
            scaleMode: sPaint.scaleMode,
            opacity: sPaint.opacity !== undefined ? `${(sPaint.opacity*100)}%` : undefined,
            transform: sPaint.type === 'IMAGE' ? sPaint.imageTransform : sPaint.videoTransform,
            scalingFactor: sPaint.scalingFactor,
            rotation: sPaint.rotation,
            filters: sPaint.filters,
            blendMode: sPaint.blendMode,
          });
        } else if (sPaint.type === 'PATTERN') {
          strokeLayers.push({
            type: sPaint.type,
            tileType: sPaint.tileType,
            opacity: sPaint.opacity !== undefined ? `${(sPaint.opacity*100)}%` : undefined,
            scalingFactor: sPaint.scalingFactor,
            spacing: sPaint.spacing,
            horizontalAlignment: sPaint.horizontalAlignment,
            blendMode: sPaint.blendMode,
          });
        } else if (sPaint.type === 'GRADIENT_ANGULAR' || sPaint.type === 'GRADIENT_DIAMOND' || sPaint.type === 'GRADIENT_LINEAR' || sPaint.type === 'GRADIENT_RADIAL') {
          const strokePaint = sPaint as GradientPaint;
          const gradientStops: any[] = [];
          if (strokePaint.gradientStops !== undefined) {
            strokePaint.gradientStops.map(async stop => {
              var stopColor = await paintToHexAndAlphaPercentWithVar(stop);
              gradientStops.push({
                hex: stopColor.hex,
                alpha: stopColor.alpha,
                token: stopColor.token,
                position: `${(stop.position*100)}%`,
              });
            });
          }
          strokeLayers.push({
            type: strokePaint.type,
            gradientTransform: strokePaint.gradientTransform,
            gradientStops: gradientStops,
            blendMode: sPaint.blendMode,
          });
        }
      });
      base.stroke.strokeLayers = strokeLayers;
    } else {
      var singleStroke = (node.strokes as ReadonlyArray<Paint>)[0];
      if (singleStroke !== undefined) {
        if (singleStroke.type === 'SOLID') {
          var singlePaint = await paintToHexAndAlphaPercentWithVar(singleStroke as SolidPaint);
          base.stroke.type = singleStroke.type;
          base.stroke.hex = singlePaint.hex;
          base.stroke.alpha = singlePaint.alpha;
          base.stroke.token = singlePaint.token;
          base.stroke.blendMode = singleStroke.blendMode;
        } else if (singleStroke.type === 'IMAGE' || singleStroke.type === 'VIDEO') {
          base.stroke.type = singleStroke.type;
          base.stroke.scaleMode = singleStroke.scaleMode;
          base.stroke.opacity = singleStroke.opacity !== undefined ? `${(singleStroke.opacity*100)}%` : undefined;
          base.stroke.transform = singleStroke.type === 'IMAGE' ? singleStroke.imageTransform : singleStroke.videoTransform;
          base.stroke.scalingFactor = singleStroke.scalingFactor;
          base.stroke.rotation = singleStroke.rotation;
          base.stroke.filters = singleStroke.filters;
          base.stroke.blendMode = singleStroke.blendMode;
        } else if (singleStroke.type === 'PATTERN') {
          base.stroke.type = singleStroke.type;
          base.stroke.tileType = singleStroke.tileType;
          base.stroke.opacity = singleStroke.opacity !== undefined ? `${(singleStroke.opacity*100)}%` : undefined;
          base.stroke.scalingFactor = singleStroke.scalingFactor;
          base.stroke.spacing = singleStroke.spacing;
          base.stroke.horizontalAlignment = singleStroke.horizontalAlignment;
          base.stroke.blendMode = singleStroke.blendMode;
        }  else if (singleStroke.type === 'GRADIENT_RADIAL' || singleStroke.type === 'GRADIENT_LINEAR' || singleStroke.type === 'GRADIENT_DIAMOND' || singleStroke.type === 'GRADIENT_ANGULAR'){
          var gradientPaint = singleStroke as GradientPaint;
          const gradientStops: any[] = [];
          if (gradientPaint.gradientStops !== undefined) {
            gradientPaint.gradientStops.map(async stop => {
              var stopColor = await paintToHexAndAlphaPercentWithVar(stop);
              gradientStops.push({
                hex: stopColor.hex,
                alpha: stopColor.alpha,
                token: stopColor.token,
                position: `${(stop.position*100)}%`,
              });
            });
          }
          base.stroke.type = gradientPaint.type;
          base.stroke.gradientTransform = gradientPaint.gradientTransform;
          base.stroke.gradientStops = gradientStops;
          base.stroke.blendMode = singleStroke.blendMode;
        }
      }
    }
  }

  // –– Effects ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  if ("effects" in node && Array.isArray(node.effects) && node.effects.length > 0) {
    var effectStyleName = undefined;
    if ("effectStyleId" in node) {
      try {
        const effectStyle = await getStyleName(node.effectStyleId);
        effectStyleName = effectStyle;
      } catch (error) {
        effectStyleName = undefined;
      }
    }

    base.effects = {
      layers: await Promise.all(node.effects.map(async effect => {
        const eEffect = effect as Effect;
        if (eEffect.type === "DROP_SHADOW" || eEffect.type === "INNER_SHADOW") {
          const color = await paintToHexAndAlphaPercentWithVar(effect as SolidPaint);
          if (eEffect.boundVariables !== undefined) {
            const offsetXToken = eEffect.boundVariables.offsetX !== undefined ? await getTokenName(eEffect.boundVariables.offsetX.id) : undefined;
            const offsetYToken = eEffect.boundVariables.offsetY !== undefined ? await getTokenName(eEffect.boundVariables.offsetY.id) : undefined;
            const radiusToken = eEffect.boundVariables.radius !== undefined ? await getTokenName(eEffect.boundVariables.radius.id) : undefined;
            const spreadToken = eEffect.boundVariables.spread !== undefined ? await getTokenName(eEffect.boundVariables.spread.id) : undefined;
            return {
              type: eEffect.type,
              visible: eEffect.visible,
              color: color,
              position: {x: offsetXToken !== undefined ? {value: `${eEffect.offset.x}px`, token: offsetXToken} : `${eEffect.offset.x}px`, y: offsetYToken !== undefined ? {value: `${eEffect.offset.y}px`, token: offsetYToken} : `${eEffect.offset.y}px`},
              blurRadius: radiusToken !== undefined ? {value: `${eEffect.radius}px`, token: radiusToken} : `${eEffect.radius}px`,
              spread: spreadToken !== undefined ? {value: `${eEffect.spread}px`, token: spreadToken} : `${eEffect.spread}px`,
              blendMode: eEffect.blendMode,
            }
          } else {
            return {
              type: eEffect.type,
              visible: eEffect.visible,
              color: color,
              position: eEffect.offset,
              blurRadius: eEffect.radius,
              spread: eEffect.spread,
              blendMode: eEffect.blendMode,
            }
          }
        } else if (effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR") {
          const blurEffect = effect as BlurEffect;
          const radiusToken = blurEffect.boundVariables !== undefined && blurEffect.boundVariables.radius ? await getTokenName(blurEffect.boundVariables.radius.id) : undefined;
          if (blurEffect.blurType === 'NORMAL'){
            return {
              type: eEffect.type,
              blurType: blurEffect.blurType,
              blurRadius: radiusToken !== undefined ? {value: `${blurEffect.radius}px`, token: radiusToken} : `${blurEffect.radius}px`,
              visible: blurEffect.visible,
            }
          } else {
            return {
              type: eEffect.type,
              blurType: blurEffect.blurType,
              blurRadius: { start: {blurRadius: `${blurEffect.startRadius}px`, position: blurEffect.startOffset} , end: {blurRadius: radiusToken !== undefined ? {value: `${blurEffect.radius}px`, token: radiusToken} : `${blurEffect.radius}px`, position: blurEffect.endOffset}},
              visible: blurEffect.visible,
            }
          }
        } //To-Do: Add noise, texture, and glass effect details in here.
        
      })),
      style: effectStyleName,
    }
  }


  // // ── TYPOGRAPHY ───────────────────────────────────────────────────────
  // // if it's a text node, capture typography
  // if (node.type === "TEXT") {
  //   const tn = node as TextNode;
  //   const font = tn.fontName as FontName;
  //   const lh = typeof tn.lineHeight === 'object'
  //     ? tn.lineHeight
  //     : (typeof tn.lineHeight === 'number' ? tn.lineHeight : null);
  //   const ls = typeof tn.letterSpacing === 'object'
  //     ? tn.letterSpacing.value
  //     : (typeof tn.letterSpacing === 'number' ? tn.letterSpacing : null);

  //   base.text = tn.characters;

  //   const styleId = tn.textStyleId;
  //   if (styleId !== figma.mixed) {
  //     try {
  //       // const textStyle = (await figma.getStyleByIdAsync(styleId.toString())) as TextStyle;
  //       // base.textStyleName = textStyle.name.replace(/(\s•\s|\/)/g, ".");
  //       //base.typography = {style: await getStyleName(styleId)};
  //       base.typography = {
  //         style: await getStyleName(styleId),
  //         fontFamily: font.family,
  //         fontStyle: font.style,
  //         fontSize: `${tn.fontSize as number}px`,
  //         lineHeight: lh,
  //         letterSpacing: ls,
  //       };
  //     } catch (error) {
  //       // base.typography = {style: undefined};
  //       base.typography = {
  //         style: undefined,
  //         fontFamily: font.family,
  //         fontStyle: font.style,
  //         fontSize: `${tn.fontSize as number}px`,
  //         lineHeight: lh,
  //         letterSpacing: ls,
  //       };
  //     }
  //   } else {
  //     //base.textStyleName = undefined;
  //     base.typography = {
  //       style: undefined,
  //       fontFamily: font.family,
  //       fontStyle: font.style,
  //       fontSize: `${tn.fontSize as number}px`,
  //       lineHeight: lh,
  //       letterSpacing: ls,
  //     };
  //   }
  // }

  

  // // ── PROPERTIES ────────────────────────────────────────────────────
  // // if instance, capture componentProperties
  // switch (node.type) {
  //   case 'INSTANCE':
  //     const mainComponent = await node.getMainComponentAsync();
  //     if (mainComponent !== null && mainComponent.parent !== null && mainComponent.parent.type === "COMPONENT_SET") {
  //       base.mainComponent = {
  //         name: mainComponent.parent.name,
  //         instanceProperties: node.componentProperties,
  //       };
  //     } else if(mainComponent !== null) {
  //       base.mainComponent = {
  //         name: mainComponent.name,
  //         instanceProperties: node.componentProperties,
  //       };
  //     }
  //     break;
  //   case 'COMPONENT_SET':
  //     const csNode = node as ComponentSetNode;
  //     base.componentSetProperties = csNode.componentPropertyDefinitions;
  //     break;
  //   case 'COMPONENT':
  //     const cNode = node as ComponentNode;
  //     if (!cNode.parent || cNode.parent.type !== 'COMPONENT_SET') {
  //       base.componentSetProperties = cNode.componentPropertyDefinitions;
  //     }
  //     break;
  //   default:
  //     break;
  // }

  // // Include what property is bound to which layer
  // if (
  //   'componentPropertyReferences' in node &&
  //   node.componentPropertyReferences
  // ) {
  //   const refs = node.componentPropertyReferences;
    
  //   if (refs.characters || refs.mainComponent || refs.visible) {
  //     base.boundProperties = {};
  //     if (refs.characters) {
  //       base.boundProperties.textProperty = refs.characters;
  //     }
  //     if (refs.visible) {
  //       base.boundProperties.booleanProperty = refs.visible;
  //     }
  //     if (refs.mainComponent) {
  //       base.boundProperties.instanceSwapProperty = refs.mainComponent;
  //     }
  //   }
  // }

  

  // ── CHILDREN ────────────────────────────────────────────────────────
  // recurse into children if any. Skips any subcomponents that do not start with "."
  if ("children" in node) {
    if (node.type !== 'INSTANCE') {
      base.children = await Promise.all(node.children.map(async child => await serializeNode(child)));
    } else {
      var SubComp = await node.getMainComponentAsync();
      if (SubComp !== null && SubComp.name.startsWith('.')) {
        base.children = await Promise.all(node.children.map(async child => await serializeNode(child)));
      }
      //base.children = await Promise.all(node.children.map(async child => await serializeNode(child)));
    }
  }

  return base;
}

async function ClearTestData() {
  await figma.clientStorage.deleteAsync("mn-oaiApiKey");
  await figma.clientStorage.deleteAsync("mn-oaiApiModel");
  await figma.clientStorage.deleteAsync("mn-primaryColor");
  await figma.clientStorage.deleteAsync("mn-dsLink");
}