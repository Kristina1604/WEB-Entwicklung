const button = document.getElementById('buttonBetreiber');
button.addEventListener('click', loadOperator);


//GoogleÜbersetzer => Betreiber = Operator

/**
 * Wird aufgerufen, wenn Betreiberansicht geladen werden soll
 */
function loadOperator () {
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
  let id = attributes.id
  if (id) {
    newElement.setAttribute("id",id);
  }
  if (classString) {
    for (let singleClass of classString.split(" ")) {
      newElement.classList.add(singleClass)
    }
      
  }
  if (styleString) {
    newElement.style.cssText=styleString;
  }
  return newElement;
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
