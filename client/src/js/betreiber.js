const button = document.getElementById('buttonBetreiber');
button.addEventListener('click', loadOperator);



/**
 * Wird aufgerufen, wenn Betreiberansicht geladen werden soll
 */
function loadOperator () {
  //GoogleÜbersetzer => Betreiber = Operator
  loadEmptyLayout();
}

/**
 * Läd leeres Seitenlayout
 */
function loadEmptyLayout () {
  
  //Seite komplett leeren
  let body = document.getElementById("body");
  clearElement(body)

  //Neue Elemente erzeugen
  let wrapper = createElement('div',{id:"wrapper",class:"justify-content-center"})
  let ueberschrift = createElement('div',{id:"ueberschrift"});
  let inhalt = createElement('div',{id:"inhalt"})
  let navleiste = createElement('div',{id:"navleiste"});
  let formular = createElement('div',{id:"formular"});

  //und zusammenstecken
  addElement(inhalt,navleiste);
  addElement(inhalt,formular);
  addElement(wrapper,ueberschrift);
  addElement(wrapper,inhalt);
  //Am Ende alles zum body hinzufügen
  addElement(body,wrapper);
}

















/* 
 * --------------------------------------------------------------- 
 * -------------------------Hilfsmethoden-------------------------
 * ---------------------------------------------------------------
 */


/** 
 *Entfernt den kompletten Inhalt des übergebenen Elements 
 * @param {Element} element Das zu leerende Element
 */
function clearElement (element) {
  //Entfernt kompletten Inhalt des übergebenen Elements
  element.innerHTML = "";
}


/**
 * Erzeugt neues Element, optional direkt mit Klassen, Styles und sonstigen Attributen
 * @param {String} tagName Name des Element-Tags
 * @param {Object} attributes OPTIONAL z.B {class:"d-flex row",style:"backgroundColor:red;"}
 * @returns {Element} newElement Das neue Element
 */
function createElement (tagName,attributes ) {
  let newElement = document.createElement(tagName);
  let classString = attributes.class;
  let styleString = attributes.style;
  let text = attributes.text;
  let id = attributes.id
  if (id) {
    setAttribute(newElement, "id", id);
  }
  if (classString) {
    for (let singleClass of classString.split(" ")) {
      addClass(newElement,singleClass)
    }
      
  }
  if (styleString) {
    setStyle(newElement,styleString)
  }
  if(text) {
    setText(newElement,text)
  }
  return newElement;
}

/**
 * Definiert Text innerhalb eines Elements
 * ACHTUNG:Nur für Elemente ohne Kinder verwenden
 * @param {Element} element Element in welches ein Text eingefügt wird
 * @param {String} text Text, welcher eingefügt wird
 */
function setText(element, text) {
  element.innerHTML = text
}

/**
 * Definiert Style-Property für ein Element
 * @param {Element} element Element, für welches das Attribut "Style" definiert wird
 * @param {String} styleString String der Form "cssAttribute:Vvlue;cssAttribute:value;..."
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
function setAttribute (element, key, value) {
  element.setAttribute(key,value);
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
  if (!outer.children || (position && outer.children.length <= position) ) {
    outer.appendChild(inner);
  } else {
    outer.insertBefore(inner,outer.children[position]);
  }
}
