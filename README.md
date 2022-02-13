# WEB-Entwicklung

Von Kristina Heinz und Oscar Schwarz

__________________________________________________________________

Installation

git clone https://github.com/Kristina1604/WEB-Entwicklung.git

npm install && npm run build && npm start

__________________________________________________________________

API

--- Vorstellungen/Kinosäle für die Drop-Down Menüs anfordern ---
/api/loadShows
/api/loadCinemas

--- Alle Kinosäle sowie alle Vorstellungen anfordern ---
/api/getCinemas
/api/getShows

--- Restplätze updaten ---
/api/restplaetze/:showId

--- Formulardaten senden ---
/addCinemaRoom
/addPresentation
/addReservation

--- Paginierung von Vorstellungen ---
/api/presentation/large/:page
/api/presentation/medium/:page
/api/presentation/small/:page

--- Paginierung von Kinosälen --- 
/api/cinemaRoom/large/:page
/api/cinemaRoom/medium/:page
/api/cinemaRoom/small/:page

__________________________________________________________________


Nach dem Start ist die Anwendung ist unter folgendem Link erreichbar

http://localhost:8080/