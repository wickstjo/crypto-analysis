// TRIGGERS FOR SETTINGS
$(document).on('keyup', (evt) => {

   // WHEN 'ESC' OR 'S' IS PRESSED
   if (evt.keyCode == 27 || evt.keyCode == 87) {

      // MAKE SURE SETTINGS WINDOW IS OPEN
      if ($("#settings").css('display') == 'table') {

         // IF 'W' WAS PRESSED
         if (evt.keyCode == 87) {

            // BIND QUERY ITEMS
            var from = $('#from').val();
            var to = $('#to').val();
            var limit = $('#limit').val();

            // FIGURE OUT APPROX QUERY LIMIT
            limit = new Date(limit).getTime() / 1000
            var now = Math.ceil(new Date().getTime() / 1000);
            limit = Math.ceil((now - limit) / 86400);

            // CHECK FOR DATE ISSUES
            if (isNaN(limit) == false) {

               // CHECK FOR INCORRECT CURRENCY COMBOS
               if (from != to || to != from) {

                  // FADE OUT
                  $('#innerbody').css('opacity', 0);

                  // WAIT 200 MS
                  sleep(200).then(() => {

                     // GENERATE CHARTS
                     charts(from, to, limit);

                     // WAIT 200 MS & FADE IN
                     sleep(200).then(() => { $('#innerbody').css('opacity', 1); });
                  });

               // CURRENCY ERROR
               } else { log('Error - Bad currency combo!'); }

            // DATE ERROR
            } else { log('Error - Bad date!') }
         }

         // FADINGLY TURN OFF OPACITY
         $("#settings").css('opacity', 0);

         // AFTERWARDS, RENDER OUT SETTINGS WINDOW
         sleep(200).then(() => { $("#settings").css('display', 'none'); });
      }
   
   }

   // WHEN 'Q' IS PRESSED
   if (evt.keyCode == 81) {

      // MAKE SURE SETTINGS WINDOW IS CLOSED
      if ($("#settings").css('display') == 'none') {

         // DISPLAY SELECTOR AS TABLE
         $("#settings").css('display', 'table');

         // FADINGLY TURN ON OPACITY
         sleep(100).then(() => { $("#settings").css('opacity', 1) });
      }
   
   }

});