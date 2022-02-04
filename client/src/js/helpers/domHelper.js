
/**
 * Erzeugt neues Element, optional direkt mit Klassen, Styles oder sonstigen Attributen
 * @param {String} tagName Name des Element-Tags
 * @param {Object} attributes OPTIONAL z.B {class:"d-flex row",style:"backgroundColor:red;"}
 * @returns {Element} newElement Das neue Element
 */
function createElement (tagName, attributes) {
  const newElement = document.createElement(tagName);
  for (const prop in attributes) {
    switch (prop) {
      case 'class':
        for (const singleClass of attributes[prop].split(' ')) {
          addClass(newElement, singleClass);
        }
        break;
      case 'style':
        setStyle(newElement, attributes[prop]);
        break;
      case 'text':
        setText(newElement, attributes[prop]);
        break;
      default:
        setAttribute(newElement, prop, attributes[prop]);
    }
  }
  return newElement;
}

/**
 * Entfernt ein Element aus dem DOM-Baum
 * @param {Element} element Das zu löschende Element
 */
function removeElement (element) {
  element.parentElement.removeChild(element);
}

/**
 * Definiert Text innerhalb eines Elements
 * ACHTUNG:Nur für Elemente ohne Kinder verwenden
 * @param {Element} element Element in welches ein Text eingefügt wird
 * @param {String} text Text, welcher eingefügt wird
 */
function setText (element, text) {
  element.innerHTML = text;
}

/**
 * Definiert Style-Property für ein Element
 * @param {Element} element Element, für welches das Attribut "Style" definiert wird
 * @param {String} styleString String der Form "cssAttribute:value;cssAttribute:value;..."
 */
function setStyle (element, styleString) {
  element.style.cssText = styleString;
}

/**
 * Definiert beliebiges Attribut für ein Element.
 * Bereits bestehende Elemente werden überschrieben.
 * @param {Element} element Element, für welches das Attribut definiert wird
 * @param {String} key Attributname
 * @param {String} value Wert des Attributs
 */
function setAttribute (element, key, value = key) {
  element.setAttribute(key, value);
}

/**
 * Weißt einem Element eine Klasse zu
 * @param {Element} element Element, welchem die Klasse zugewiesen wird
 * @param {String} classString Klasse als String, welche hinzugefügt wird
 */
function addClass (element, classString) {
  element.classList.add(classString);
}

/**
 * Entfernt Klasse vom Element
 * @param {Element} element Element, von welchem die Klasse entfernt wird
 * @param {String} classString Klasse als String, welche entfernt wird
 */
function removeClass (element, classString) {
  element.classList.remove(classString);
}

/**
 * Fügt ein Element in ein anderes ein.
 * Optional lässt sich auch die Position festlegen
 * @param {Element} outer Element, in das eingefügt wird
 * @param {Element} inner Element, welches eingefügt wird
 * @param {Number} position OPTIONAL Position, an welcher eingefügt wird (0 = vorne)
 */
function addElement (outer, inner, position) {
  if (!outer.children || (position && outer.children.length <= position)) {
    outer.appendChild(inner);
  } else {
    outer.insertBefore(inner, outer.children[position]);
  }
}

/**
 * Fügt in ein Element ein Array aus Elementen ein.
 * Ganz analog zu addElement(), nur das mehrere Elemente gleichzeitig eingefügt werden können
 * @param {Element} outer  Element, in das eingefügt wird
 * @param {Array<Element>} arrayOfInner Array von Elementen die eingefügt werden
 */
function addElements (outer, arrayOfInner) {
  for (const inner of arrayOfInner) {
    addElement(outer, inner);
  }
}

module.exports = {
  createElement: createElement,
  removeElement: removeElement,
  addClass: addClass,
  setText: setText,
  removeClass: removeClass,
  addElement: addElement,
  addElements: addElements
};
