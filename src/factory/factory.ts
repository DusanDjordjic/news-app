import { DomElement } from "../models/dom-element.interface";

export function factory(domElemnet: DomElement) {
  return generateDomTree(domElemnet, null);
}
function generateDomTree(
  domElement: DomElement,
  currentNode: HTMLElement | null
) {
  const element = document.createElement(domElement.tag);
  if (domElement.classes) {
    element.classList.add(...domElement.classes);
  }
  if (domElement.attributes) {
    domElement.attributes.forEach((att) => {
      element.setAttribute(att.attName, att.attValue);
    });
  }
  if (domElement.textContent) {
    element.textContent = domElement.textContent;
  }
  if (domElement.events) {
    domElement.events.forEach((event) => {
      element.addEventListener(event.eventName, event.callback);
    });
  }
  if (currentNode !== null) {
    currentNode.appendChild(element);
  }
  if (domElement.children) {
    domElement.children.forEach((child) => {
      generateDomTree(child, element);
    });
  }
  return element;
}
