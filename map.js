mapboxgl.accessToken = 'pk.eyJ1IjoieWFuc3VuMjAyMCIsImEiOiJjazg4dmFsbGcwMGcwM2xxc2Zla21zZG91In0.Kkqjs0MWxmSEeqe7yO-k5g';
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/yansun2020/ck8ad7rpg0m9r1ipbqa4rgvk0',
        center: [118.9552402, 32.1160235],
        zoom: 14
      });

      map.on('load', function () {
        var filterHour = ['==', ['number', ['get', 'Hour']], 12];
       
        map.addLayer({
          id: 'collisions',
          type: 'circle',
          source: {
            type: 'geojson',
            data: 'data/research01.geojson' // replace this with the url of your own geojson
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['number', ['get', 'Num']],
              0,
              5,
              10,
              16
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['number', ['get', 'Num']],
              0,
              '#2DC4B2',
              2,
              '#3BB3C3',
              4,
              '#669EC4',
              6,
              '#8B88B6',
              8,
              '#A2719B',
              16,
              '#AA5E79'
            ],
            'circle-opacity': 0.8
          },
          'filter': ['all', filterHour]
        });

        // update hour filter when the slider is dragged
        document
          .getElementById('slider')
          .addEventListener('input', function (e) {
            var hour = parseInt(e.target.value);
            // update the map
            filterHour = ['==', ['number', ['get', 'Hour']], hour];
            map.setFilter('collisions', ['all', filterHour]);

            // converting 0-23 hour to AMPM format
            var ampm = hour >= 12 ? 'PM' : 'AM';
            var hour12 = hour % 12 ? hour % 12 : 12;

            // update text in the UI
            document.getElementById('active-hour').innerText = hour12 + ampm;
          });

        
      });