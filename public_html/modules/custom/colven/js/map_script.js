(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.colvenMap = {
    attach: function (context, settings) {
      if ($('#map', context).once('colvenMap').length) {
        var mapSettings = {
          latitude: -34.603722,
          longitude: -58.381592,
          zoom: 12,
        };

        if (Drupal.behaviors.colvenMap.map) {
          Drupal.behaviors.colvenMap.map.remove();
        }

        var map = L.map('map').setView([mapSettings.latitude, mapSettings.longitude], mapSettings.zoom);
        Drupal.behaviors.colvenMap.map = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '',
          detectRetina: true,
        }).addTo(map);

        // Esto elimina el logotipo de Leaflet
        map.attributionControl.setPrefix('');

        var bounds = L.latLngBounds();
        var allStores = [];

        function populateSelect(selectId, options) {
          var select = $(selectId);
          select.empty();
          select.append('<option value="">Seleccione una opción</option>');
          options.forEach(function (option) {
            select.append('<option value="' + option + '">' + option + '</option>');
          });
        }

        function filterAndDrawMap() {
          var selectedCountry = $('#country-select').val();
          var selectedState = $('#state-select').val();
          var selectedCity = $('#city-select').val();

          map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });

          bounds = L.latLngBounds();

          $.each(allStores, function (index, store) {
            if ((selectedCountry === '' || store.country === selectedCountry) &&
                (selectedState === '' || store.state === selectedState) &&
                (selectedCity === '' || store.city === selectedCity)) {

              if (typeof store.location === 'string') {
                var locationParts = store.location.split(', ');
                store.location = {
                  lat: parseFloat(locationParts[0]),
                  long: parseFloat(locationParts[1])
                };
              }

              if (typeof store.location.lat === 'undefined' || typeof store.location.long === 'undefined') {
                return;
              }

              // Asegurarse de que store.brands sea un array
              var brands = store.brands;
              if (typeof brands === 'string') {
                try {
                  brands = JSON.parse(brands);
                } catch (e) {
                  brands = brands.split(',');
                }
              }

              // Determinar el icono a utilizar
              var iconUrl;
              if (brands.length === 1) {
                iconUrl = drupalSettings.colven.modulePath + '/img/' + brands[0].toLowerCase().trim() + '-icon.png';
              } else {
                iconUrl = drupalSettings.colven.modulePath + '/img/colven-icon.png';
              }

              // Crear el icono personalizado
              var customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [39, 49], // Tamaño del icono
                iconAnchor: [19.5, 49], // Punto de anclaje del icono (en el centro inferior)
                popupAnchor: [0, -49] // Anclaje del popup (directamente encima del icono)
              });

              // Crear el marcador con el icono personalizado
              var marker = L.marker([store.location.lat, store.location.long], { icon: customIcon }).addTo(map);

              // Crear contenido del marcador con la información del store
              var popupContent = '<strong>' + store.name + '</strong><br>' +
                'Dirección: ' + store.address + '<br>' +
                'Ciudad: ' + store.city + '<br>' +
                'Provincia: ' + store.state + '<br>' +
                'Email: ' + store.email + '<br>' +
                'Teléfono: ' + store.phone + '<br>' +
                '<a href="https://www.google.com/maps?q=' + store.location.lat + ',' + store.location.long + '" target="_blank">Ver en Google Maps</a>';
              marker.bindPopup(popupContent);

              // Agregar la coordenada del marcador a bounds
              bounds.extend(marker.getLatLng());
            }
          });

          // Ajustar la vista del mapa para mostrar todos los marcadores filtrados
          if (bounds.getNorthEast() !== undefined) {
            map.fitBounds(bounds);
          }
        }

        function updateStateOptions() {
          var selectedCountry = $('#country-select').val();
          var states = [...new Set(allStores.filter(store => store.country === selectedCountry).map(store => store.state))];
          populateSelect('#state-select', states);
          $('#city-select').empty().append('<option value="">Seleccione una ciudad</option>'); // Resetear las ciudades
        }

        function updateCityOptions() {
          var selectedState = $('#state-select').val();
          var cities = [...new Set(allStores.filter(store => store.state === selectedState).map(store => store.city))];
          populateSelect('#city-select', cities);
        }

        // Obtener los datos de /json/stores
        $.getJSON('/json/stores', function (data) {
          allStores = data;

          // Llenar el campo de selección de países con opciones únicas
          var countries = [...new Set(data.map(store => store.country))];
          populateSelect('#country-select', countries);

          // Manejar los cambios en los campos de selección
          $('#country-select').change(function () {
            updateStateOptions();
            filterAndDrawMap();
          });
          $('#state-select').change(function () {
            updateCityOptions();
            filterAndDrawMap();
          });
          $('#city-select').change(filterAndDrawMap);

          // Dibujar el mapa inicialmente con todos los stores
          filterAndDrawMap();
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
