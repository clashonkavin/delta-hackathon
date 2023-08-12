// import fs from "fs";
var domTree;
var level = 0;
var domTreeString;
const htmlFileInput = document.getElementById("htmlFileInput");
const graphContainer = document.getElementById("domTreeContainer");

htmlFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      displayDOM(fileContent);
    };
    reader.readAsText(file);
  }
});

function displayDOM(fileContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(fileContent, "text/html");
  domTree = doc.documentElement;
  console.log(domTree);
  console.log(typeof domTree);
  graphContainer.innerHTML = "";
  displayTree(domTree, graphContainer, level);
  domTreeString = new XMLSerializer().serializeToString(domTree);
  //   renderHTML(domTreeString);
}

function displayTree(node, container, level) {
  //     const nodeElementname = document.createElement("div");
  //   nodeElement.className = `treeNode level${level}`;
  const nodeElement = document.createElement("div");
  nodeElement.className = `treeNode level${level}`;
  const nameofnode = document.createElement("div");
  nameofnode.textContent = node.nodeName + ` - (Level ${level}) `;
  nodeElement.append(nameofnode);

  container.appendChild(nodeElement);
  if (node.id) {
    const idElement = document.createElement("span");
    idElement.textContent = " id = " + node.id;
    nodeElement.appendChild(idElement);
  }

  if (node.classList.length > 0) {
    const classElement = document.createElement("span");
    classElement.textContent =
      ", class = " + Array.from(node.classList).join(".");
    nodeElement.appendChild(classElement);
  }

  if (node.style.length >= 0) {
    const styleElement = document.createElement("div");
    styleElement.className = "treeNodeStyles";
    styleElement.style.display = "none";
    for (let i = 0; i < node.style.length; i++) {
      const styleProperty = node.style[i];
      const styleValue = node.style.getPropertyValue(styleProperty);
      if (styleValue == "none") {
        continue;
      }
      const stylePairElement = document.createElement("div");
      stylePairElement.style.display = "flex";
      if (node.style.length == 0) {
        styleElement.textContent = "No CSS property";
        styleElement.appendChild(stylePairElement);
      } else {
        const propertyInput = document.createElement("input");
        propertyInput.value = styleProperty;
        propertyInput.addEventListener("input", (event) => {
          event.stopPropagation();
          updateStyle(node, styleProperty, event.target.value, styleValue);
        });
        const valueInput = document.createElement("input");
        valueInput.value = styleValue;
        valueInput.addEventListener("input", (event) => {
          event.stopPropagation();
          updateStyle(node, styleProperty, styleProperty, event.target.value);
        });
        const stylePair = document.createElement("div");
        stylePair.appendChild(propertyInput);
        const colonText = document.createTextNode("  ::  ");
        stylePair.appendChild(colonText);
        stylePair.appendChild(valueInput);
        styleElement.appendChild(stylePair);
        stylePairElement.textContent = `${styleProperty}: ${styleValue}`;
      }
    }
    nodeElement.appendChild(styleElement);
    if (node.style.length == 0) {
      const stylePairElement = document.createElement("div");
      styleElement.textContent = "No CSS property";
      styleElement.appendChild(stylePairElement);
    }
    console.log(styleElement.parentNode);
    styleElement.parentNode.addEventListener("click", (event) => {
      event.stopPropagation();
      console.log("click detected");
      styleElement.style.display = "block";
    });
    document.addEventListener("click", (event) => {
      if (!styleElement.contains(event.target)) {
        styleElement.style.display = "none";
      }
    });
  }

  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      displayTree(childNode, nodeElement, level + 1);
    }
  }
}

function updateStyle(node, oldProperty, newProperty, newValue) {
  const oldStyles = node.getAttribute("style") || "";
  const stylesArray = oldStyles
    .split(";")
    .filter((style) => style.trim() !== "");

  const index = stylesArray.findIndex((style) =>
    style.includes(oldProperty + ":")
  );
  if (index !== -1) {
    stylesArray[index] = `${newProperty}:${newValue}`;
  } else {
    stylesArray.push(`${newProperty}:${newValue}`);
  }
  const updatedStyles = stylesArray.join(";");
  node.setAttribute("style", updatedStyles);
  console.log(node);
  domTreeString = new XMLSerializer().serializeToString(domTree);
  console.log(domTreeString);
}

function showContent() {
  const display = document.getElementById("Display");
  display.innerText = domTreeString;
}
