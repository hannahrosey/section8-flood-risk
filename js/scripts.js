// Get data and load to map
mapboxgl.accessToken = "pk.eyJ1IjoiaGFubmFocm9zZXkiLCJhIjoiY2t6aG5ocmh0NDNvdzJvbmZxMG44czVyayJ9.GfvFPfGH_vdPxHOIGVGEPg"

// lngLat for New York City
var nyBounds = [[-74.333496,40.469935], [-73.653717,40.932190]]

$.getJSON('./data/hcv_dat.geojson', function(hcv_dat) {

  var map = new mapboxgl.Map({
    container: 'mapContainer', // HTML container id
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    bounds: nyBounds, // sets initial bounds instead of center + zoom
    maxBounds: nyBounds, // keep user from moving outside map area
    zoom: 9,
    });
  // initialize hover variable
  var hoveredPumaId = null;
  var selectedLayer = null;

  // add floodplain layers
  // 100 year floodplain
  var floodplain_100 = $.getJSON('./data/floodplain_100_dissolved.geojson', function(floodplain_100){
  // add data source
    map.addSource('floodplain_100', {
        type: 'geojson',
        data: floodplain_100,
        generateId: true
      });
    // add number reported fill layer
    map.addLayer({
        id: 'floodplain_100',
        type: 'fill',
        source: 'floodplain_100',
        paint: {
          'fill-opacity': .50,
          'fill-color': "#2b8cbe"
        },
        layout: {
          // Make the layer invisible by default.
          'visibility': 'visible'
        }
      });
    });

    // 500 year floodplain
    var floodplain_500 = $.getJSON('./data/floodplain_500_dissolved.geojson', function(floodplain_500){
    // add data source
      map.addSource('floodplain_500', {
          type: 'geojson',
          data: floodplain_500,
          generateId: true
        });
      // add number reported fill layer
      map.addLayer({
          id: 'floodplain_500',
          type: 'fill',
          source: 'floodplain_500',
          paint: {
            'fill-opacity': .50,
            'fill-color': "#2b8cbe"
          },
          layout: {
            // Make the layer invisible by default.
            'visibility': 'none'
          }
        });
      });

  // add data source
  map.on('load', function() {
    map.addSource('hcv_dat', {
        type: 'geojson',
        data: hcv_dat,
        generateId: true
      });
    // add number reported fill layer
    map.addLayer({
        id: 'reported_fill',
        type: 'fill',
        source: 'hcv_dat',
        paint: {
          'fill-opacity': [
            'case',
            ['boolean',
            ['feature-state', 'hover'], false],
            .95,
            0.5
          ],
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'number_reported'],
            0,
            "#edf8e9",
            500,
            "#c7e9c0",
            1500,
            "#a1d99b",
            3000,
            "#74c476",
            5000,
            "#31a354",
            8000,
            "#006d2c"
          ],
          'fill-outline-color':"#fff"
          }
        });

    // Add layer toggle functionality to radio buttons
    // Source: https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
    $('.layertoggle').on('click', function(e) {
      if (this.id == 100){
        var selectedLayer = "floodplain_100"
        var unselectedLayer = "floodplain_500"
        var unselectedId = "#500"
      } else if (this.id == 500){
        var selectedLayer = "floodplain_500"
        var unselectedLayer = "floodplain_100"
        var unselectedId = "#100"
      }

      // get and toggle radio button checked status for unselected layer
      $(unselectedId).prop('checked', false);

      // get and toggle visibility on for selected layer
      var visibility = map.getLayoutProperty(
        selectedLayer,'visibility'
      );

      if (visibility == 'none'){
        map.setLayoutProperty(selectedLayer, 'visibility', 'visible');
      };

      // get and toggle visibility off for unselected layer
      var visibility = map.getLayoutProperty(
        unselectedLayer,'visibility'
      );

      if (visibility != 'none'){
        map.setLayoutProperty(unselectedLayer, 'visibility', 'none');
      };
    });

    // highlight the PUMA user is hovering over
    // source: https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
    // add a popup with PUMA name only to help users know where to click
    var popup = new mapboxgl.Popup({
    className: "popup",
    closeButton: false,
    closeOnClick: false
    });

    map.on('mousemove', 'reported_fill', function(e) {
      // change the cursor style to pointer
      map.getCanvas().style.cursor = 'pointer';

      // highlight hovered over PUMA
      if (e.features.length > 0) {
        // un-highlight any previously highlighted PUMAs
        if (hoveredPumaId !== null) {
          map.setFeatureState(
            { source: 'hcv_dat', id: hoveredPumaId },
            { hover: false }
          );
        }

        // highlight currently hovered-over PUMA
        hoveredPumaId = e.features[0].id;
        map.setFeatureState(
          { source: 'hcv_dat', id: hoveredPumaId },
          { hover: true }
        );
      }

      // get data attributes for this feature to populate popup
      var neighb = e.features[0].properties.puma_name;
      var coordinates = e.features[0].geometry.coordinates[0][0];
      var pct = numeral(e.features[0].properties.pct_hh_in_any_fp).format('0%');
      // select first set of coordinates if many are visible
      if (coordinates.length > 2) {
        coordinates = coordinates[0]
      }

      // TODO: these popups are a little laggy--ask if there is a way to improve
      // set popup content to neighborhood name
      var popupContent = `
        <h5>${neighb}</h5>
        <p><strong>${pct}</strong> of voucher households in this PUMA are in a census tract in the 100- or 500-year floodplain</p>`

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
    });

    map.on('mouseleave', 'reported_fill', function() {
      // remove popup
      popup.remove();

      // unhighlight previously hovered-over PUMA
      if (hoveredPumaId !== null) {
        map.setFeatureState(
          { source: 'hcv_dat', id: hoveredPumaId },
          { hover: false }
        );
      }
      hoveredPumaId = null;
    });

    map.on('click','reported_fill', function(e) {
      // get properties
      var properties = e.features[0].properties;
      var number_reported = numeral(properties.number_reported).format('0,0');
      var est_total_occupied = numeral(properties.est_total_occupied).format('0,0');
      var people_total = numeral(properties.people_total).format('0,0');
      var est_people_total = numeral(properties.est_total_occupied*properties.avg_hh_size).format('0,0');

      // add table of reviews data to sidebar
      // TO DO format numbers
      $('#stat-table').html(`
          <table>
            <thead>
              <th colspan="3">${properties.puma_name}</td>
            </thead>
            <thead>
              <th></th>
              <th>Reported</th>
              <th>Estimated</th>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Households</strong></td>
                <td>${number_reported}</td>
                <td>${est_total_occupied}</td>
              </tr>
              <tr>
                <th scope="row">Individuals</td>
                <td>${people_total}</td>
                <td>${est_people_total}</td>
                <td></td>
              </tr>
              <tr>
                <th scope="row">Avg. Household Size</td>
                <td>${properties.avg_hh_size}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
            `);
          });
  });
});
