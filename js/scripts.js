// Get data and load to map
mapboxgl.accessToken = "pk.eyJ1IjoiaGFubmFocm9zZXkiLCJhIjoiY2t6aG5ocmh0NDNvdzJvbmZxMG44czVyayJ9.GfvFPfGH_vdPxHOIGVGEPg"

// lngLat for New York City
var nyBounds = [[-74.333496,40.469935], [-73.653717,40.932190]]

$.getJSON('./data/hcv_dat_slim.geojson', function(hcv_dat) {

  /*console.log(hcv_dat);*/

  var map = new mapboxgl.Map({
    container: 'mapContainer', // HTML container id
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    bounds: nyBounds, // sets initial bounds instead of center + zoom
    maxBounds: nyBounds, // keep user from moving outside map area
    zoom: 9,
    });

  var hoveredPumaId = null;
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
            .85,
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

    // TODO: Add sea level rise layer

    // TODO: add estimated total households layer
    // TODO: add total people layer
    // TODO: add variable toggle
    // TODO: add code to change legend color, labels on toggle

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
      // select first set of coordinates if many are visible
      if (coordinates.length > 2) {
        coordinates = coordinates[0]
      }

      // TODO: these popups are a little laggy--ask if there is a way to improve
      // set popup content to neighborhood name
      var popupContent = `
        <h5>${neighb}</h5>`

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

      // add table of reviews data to sidebar
      $('.stat-table').html(`
          <h5>Neighborhood: <i>${properties.puma_name}</i><h5>
          <table>
            <tr>
              <th>Number of Reported Households</th>
              <th>Number of Reported Individuals</th>
              <th>Average Voucher Household Size</th>
              <th>Total Estimated Households</th>
            </tr>
            <tr>
              <td>${properties.number_reported}</td>
              <td>${properties.people_total}</td>
              <td>${properties.avg_hh_size}</td>
              <td>${properties.est_total_occupied}</td>
            </tr>
          </table>
            `);
          });
  });
    // TODO: add data table to sidebar PUMA  HCV info when clicked
});
