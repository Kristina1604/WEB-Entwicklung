//Dateiname betreiber.js ist nicht mehr ganz passend...


//Eventlistener für die Hauptbuttons in der Navbar
let primaryButtons = document.getElementsByClassName('primaryButton');
for (let i = 0; i < primaryButtons.length ; i++) {
  primaryButtons.item(i).addEventListener('click', toggleMenu)
}

//Eventlistener für Unterbuttons in der Navbar
let subButtons = document.getElementsByClassName('subButton');
for (let i = 0; i < subButtons.length ; i++) {
  subButtons.item(i).addEventListener('click', switchSide)
}


/* 
 * --------------------------------------------------------------- 
 * -----------------------Globale Variablen-----------------------
 * ---------------------------------------------------------------
 */

//Variablen, die den aktuellen Zustand der beiden 'Dropdowns' erfassen
// c = customer
// o = operator
let O_OPEN = false;
let C_OPEN = false;

//Objekt um Enumwerte für currentSide zu imitieren
//Werte müssen den zugehörigen IDs der Buttons in der NavBar entsprechen 
const SITE = {
  EMPTY: "leer",
  VORSTELLUNG_ANLEGEN: "vorstellungAnlegen",
  KINOSAAL_ANLEGEN: "kinosaalAnlegen",
  TICKETS_RESERVIEREN: "ticketsReservieren"
}
Object.freeze(SITE);
//Variable für aktuell geöffnete Seite
let CURRENTSIDE = SITE.EMPTY;

//Daten zum Laden eines Formulars. Property-Keys müssen IDs der zugehörgen Buttons / Enumvariable SITE entsprechen 
const FORMULAR_TEMPLATES = {
  ticketsReservieren : {
    buttonId: "ticketsReservieren",
    inputs: [
      {
        description : "Name",
        placeholder:"Geben Sie ihren vollen Namen ein",
        type : "text"
      },
      {
        description: "Vorstellung",
        placeholder:"Wählen Sie eine Vorstellung",
        type: "select",
        options: ["Alladin 5", "Batman vs KingKong "]
      },
      {
        description:"Anzahl Tickets",
        placeholder:"Wie viele Tickets wollen Sie bestellen?",
        type:"number"
      },
  
    ]
  },
  kinosaalAnlegen : {
    buttonId: "kinosaalAnlegen",
    inputs: [
      {
        description : "Name",
        placeholder:"Geben Sie den Namen des Kinosaals ein",
        type : "text"
      },
      {
        description: "Anzahl Reihen",
        placeholder:"Wählen Sie die Anzahl der Reihen",
        type: "number"
      },
      {
        description:"Anzahl Sitze pro Reihe",
        placeholder:"Wählen Sie die Anzahl der Sitze pro Reihe",
        type:"number"
      },
  
    ]
  },
  vorstellungAnlegen : {
    buttonId: "vorstellungAnlegen",
    inputs: [
      {
        description : "Name",
        placeholder:"Geben Sie den Namen der Vorstellung ein",
        type : "text"
      },
      {
        description: "Irgendwelche anderen Eigenschaften",
        placeholder:"Gucke die Tage mal nochmal über die Aufgabenstellung drüber",
        type: "text"
      },
  
    ]
  }
} 

/* 
 * --------------------------------------------------------------- 
 * -------------------------Seiten-Events--------------------------
 * ---------------------------------------------------------------
 */

/**
 * Öffnet und schließt die beiden Dropdowns in der Navleiste
 * @param {Event} event Event welches Informationen über den 'Klick' des Benutzers enthält
 */
function toggleMenu(event) {
  let c_or_o = event.target.id.charAt(0); // Evaluiert zu 'c' bei Klick auf Kunde, und zu 'o' bei Klick auf Betreiber
  let open = c_or_o == "c" ? C_OPEN : O_OPEN; //Übernimmt Booleanwert (auf=true,zu=false) des entsprechenden Dropdowns
  let subButtons = document.getElementsByClassName(`${c_or_o}SubButton`) //HTMLCollection aller Dropdownitems des entsprechenden Dropdownmenüs

  //HTMLCollection erlaubt kein forEach(), deshalb wandle ich es in ein normales Array um
  let subButtonsArray = [];
  for (let i = 0 ; i < subButtons.length ; i++) {
    subButtonsArray.push(subButtons.item(i))
  }

  if (open) {
    //Das angeklickte Menü ist offen => Menü schließen
    subButtonsArray.forEach(i => {
      removeClass(i,"active")
      addClass(i,"inactive")
    })
  } else {
    //Das angeklickte Menü ist geschlossen => Menü öffnen
    subButtonsArray.forEach(i => {
      removeClass(i,"inactive")
      addClass(i,"active")
    })
  }

  //Die richtige Booleanvariable muss noch geflipt werden
  c_or_o == "c" ? C_OPEN = !C_OPEN : O_OPEN = !O_OPEN;

  //Ein geöffneter Hauptbutton soll etwas heller als ein geschlossener sein
  let primaryButton = document.getElementById(c_or_o == "c" ? "customerButton" : "operatorButton");
   open ? removeClass(primaryButton,"openPrimaryButton") :  addClass(primaryButton,"openPrimaryButton"); 
}

/**
 * Koordiniert "Seitenwechsel" (Richtiges Formular laden)
 * @param {Event} event  Event beim Klick auf Unterbutton in der Navbar
 * @returns 
 */
function switchSide(event) {
  //Seite, die angeklickt wurde
  let newSite = event.target.id;

  //Klick auf Seite, die bereits offen ist, hat keine Wirkung
  if (newSite == CURRENTSIDE){
    return;
  }

  let formularWrapper = document.getElementById("formular");
  //Alte Seite entfernen
  if (CURRENTSIDE != SITE.EMPTY) {
    formularWrapper.innerHTML = '';
  }

  //Neuer Seitenwert in globalen Variablen hinterlegen
  CURRENTSIDE = newSite;

  //Passendes Formular laden
  addElement(formularWrapper,createFormFromJSON(FORMULAR_TEMPLATES[newSite]))
}


/**
 * Erstellt <form>-Element aus Datenobjekt
 * @param {Object} json Object mit allen Informationen, um daraus eine <form> zu generieren
 * @returns {HTMLElement}
 */
 function createFormFromJSON (json) {
  let idCounter = 0; //Zählvariable, um eindeutige IDs generieren zu können
  //Erstellt einzelnen Inputabschnitt (Beschreibung des Inputs und Input selbst)
  let createFormElement = function (inputJSON) {
    const inputID = `input-${idCounter}`

    let wrapper = createElement("div",{class:"form-group"});
    let label = createElement("label",{for:inputID, text:inputJSON.description});
    let input;
    switch (inputJSON.type) {
      case "text":
        input = createElement("input",{class:"form-control inputField", type:"text", id:inputID, placeholder:inputJSON.placeholder});
        break;
      case "select":
        input = createElement("select",{class:"form-control inputField", id:inputID});
        inputJSON.options.forEach(option => addElement(input,createElement("option",{text:option})))
        break;
      case "number":
        input = createElement("input",{class:"form-control inputField",type:"number",id:inputID});
        break;
    }
    idCounter++;
    addElement(wrapper,label);
    addElement(wrapper,input);
    return wrapper;

  }
  //<form>-Element erstellen und füllen
  let form = createElement("form",{class:"p-4",id:"form"});
  for (let inputJSON of json.inputs) {
    addElement(form,createFormElement(inputJSON));
  }
  let submitButton = createElement("button", {text:"Absenden", type:'button', id:`submitButton-${json.buttonId}`});
  addElement(form,submitButton)
  return form;
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
 * Erzeugt neues Element, optional direkt mit Klassen, Styles oder sonstigen Attributen
 * @param {String} tagName Name des Element-Tags
 * @param {Object} attributes OPTIONAL z.B {class:"d-flex row",style:"backgroundColor:red;"}
 * @returns {Element} newElement Das neue Element
 */
function createElement (tagName,attributes) {
  let newElement = document.createElement(tagName);
  for (let prop in attributes) {
    switch (prop) {
      case "class":
        for (let singleClass of attributes[prop].split(" ")) {
          addClass(newElement,singleClass)
        }
        break;
      case "style":
        setStyle(newElement,attributes[prop])
        break;
      case "text":
        setText(newElement,attributes[prop])
        break;
      default:
        setAttribute(newElement, prop, attributes[prop]);
    }
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
function setAttribute (element, key, value = key) {
  element.setAttribute(key,value);
}

/**
 * Entfernt beliebiges Attribut für ein Element.
 * @param {Element} element Element, für welches das Attribut entfernt wird
 * @param {String} key Attributname
 */
 function removeAttribute (element, key) {
  element.removeAttribute(key);
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
