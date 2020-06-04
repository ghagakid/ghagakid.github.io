var map, featureList, boroughSearch = [], pendidikanSearch = [], kesehatanSearch = [], pertanianSearch=[], bangunanSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();

  /* Feature list Pendidikan */
  pendidikans.eachLayer(function (layer) {
    if (map.hasLayer(pendidikanLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-graduation-cap" aria-hidden="true"></i></td><td class="feature-name">' + layer.feature.properties.JDL + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Feature list Kesehatan */
  kesehatans.eachLayer(function (layer) {
    if (map.hasLayer(kesehatanLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square" aria-hidden="true"></i></td><td class="feature-name">' + layer.feature.properties.JDL + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Feature list Pertanian */
  pertanians.eachLayer(function (layer) {
    if (map.hasLayer(pertanianLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-leaf" aria-hidden="true"></i></td><td class="feature-name">' + layer.feature.properties.JDL + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Feature list Bangunan Lainnya */
  bangunans.eachLayer(function (layer) {
    if (map.hasLayer(bangunanLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-institution" aria-hidden="true"></i></td><td class="feature-name">' + layer.feature.properties.JDL + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var OSM = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var MSS = L.tileLayer("https://api.mapbox.com/styles/v1/ardhayosef/cj5jod8vk0tg22rqy1pbxd22h/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJkaGF5b3NlZiIsImEiOiJjajJuenNrZW4wMXdyMnFzM3VkNzdtd3oyIn0.IzmQJPmuD4igVsAOt-U9BQ", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      stroke: false,
      fill: true,
      fillColor: "black",
      fillOpacity: 0.2,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/geojson/polygon.geojson", function (data) {
  boroughs.addData(data);
});

//Create a color dictionary based off of subway route_id
var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
    "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
    "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
    "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
    "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
    "Q":"#ffff00", "R":"#ffff00" };

var subwayLines = L.geoJson(null, {
  style: function (feature) {
      return {
        color: subwayColors[feature.properties.route_id],
        weight: 3,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16,
});

/* Layer Pendidikan */
var pendidikanLayer = L.geoJson(null);
var pendidikans = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties.JDL,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<ul class='nav nav-tabs'>" + "<li class='active'><a href='#modalTechnical' data-toggle='tab'><i class='fa fa-check-square-o'></i> Profil Aset</a></li>" + "<li><a href='#modalPicture' data-toggle='tab'><i class='fa fa-picture-o'></i> Foto Udara</a></li>" + "<li class='dropdown'> <a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'><i class='fa fa-map'></i> Peta <span class='caret'></span></a><ul class='dropdown-menu'>" + "<li><a href='#modalBasicMap' data-toggle='tab'>Peta Bidang Tanah</a></li>" + "<li><a href='#modalMapImagery' data-toggle='tab'>Peta Foto Udara</a></li></ul></li></ul>" + "<div class= 'tab-content'><div class='tab-pane fade active in' id='modalTechnical'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nama Aset</th><td>" + feature.properties.JDL + "</td></tr>" + "<tr><th>Jenis Aset</th><td>" + feature.properties.JNS + "</td></tr>" + "<tr><th>Desa</th><td>" + feature.properties.DES + "</td></tr>" + "<tr><th>Kecamatan</th><td>" + feature.properties.KEC + "</td></tr>" + "<tr><th>Luas</th><td>" + feature.properties.LUS + " m2 </td></tr>" + "<tr><th>Tahun Pengadaan</th><td>" + feature.properties.THN + "</td></tr>" + "<tr><th>Hak Pakai Tanah No</th><td>" + feature.properties.HAK + "</td></tr>" + "<tr><th>Tanggal Sertifikat Tanah</th><td>" + feature.properties.TST + "</td></tr>" + "<tr><th>Nomor Sertifikat Tanah</th><td>" + feature.properties.NST + "</td></tr>" + "<tr><th>Asal Usul Aset</th><td>" + feature.properties.ASU + "</td></tr>" + "<tr><th>SKPD</th><td>" + feature.properties.SKD + "</td></tr>" + "<tr><th>Penggunaan Aset</th><td>" + feature.properties.PGN + "</td></tr>" + "</table></div>" + "<div class='tab-pane fade' id='modalPicture'><img class='img-responsive' src=" + feature.properties.DRO +"></div>" + "<div class='tab-pane fade' id='modalBasicMap'><img class='img-responsive' src=" + feature.properties.PBD +"></div>" + "<div class='tab-pane fade' id='modalMapImagery'><img class='img-responsive' src=" + feature.properties.PUD +"></div></div>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.JDL);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-graduation-cap" aria-hidden="true"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      pendidikanSearch.push({
        name: layer.feature.properties.JDL,
        address: layer.feature.properties.DES,
        source: "Pendidikan",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/pendidikan.geojson", function (data) {
  pendidikans.addData(data);
  map.addLayer(pendidikanLayer);
});

/* Layer Kesehatan */
var kesehatanLayer = L.geoJson(null);
var kesehatans = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties.JDL,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<ul class='nav nav-tabs'>" + "<li class='active'><a href='#modalTechnical' data-toggle='tab'><i class='fa fa-check-square-o'></i> Profil Aset</a></li>" + "<li><a href='#modalPicture' data-toggle='tab'><i class='fa fa-picture-o'></i> Foto Udara</a></li>" + "<li class='dropdown'> <a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'><i class='fa fa-map'></i> Peta <span class='caret'></span></a><ul class='dropdown-menu'>" + "<li><a href='#modalBasicMap' data-toggle='tab'>Peta Bidang Tanah</a></li>" + "<li><a href='#modalMapImagery' data-toggle='tab'>Peta Foto Udara</a></li></ul></li></ul>" + "<div class= 'tab-content'><div class='tab-pane fade active in' id='modalTechnical'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nama Aset</th><td>" + feature.properties.JDL + "</td></tr>" + "<tr><th>Jenis Aset</th><td>" + feature.properties.JNS + "</td></tr>" + "<tr><th>Desa</th><td>" + feature.properties.DES + "</td></tr>" + "<tr><th>Kecamatan</th><td>" + feature.properties.KEC + "</td></tr>" + "<tr><th>Luas</th><td>" + feature.properties.LUS + " m2 </td></tr>" + "<tr><th>Tahun Pengadaan</th><td>" + feature.properties.THN + "</td></tr>" + "<tr><th>Hak Pakai Tanah No</th><td>" + feature.properties.HAK + "</td></tr>" + "<tr><th>Tanggal Sertifikat Tanah</th><td>" + feature.properties.TST + "</td></tr>" + "<tr><th>Nomor Sertifikat Tanah</th><td>" + feature.properties.NST + "</td></tr>" + "<tr><th>Asal Usul Aset</th><td>" + feature.properties.ASU + "</td></tr>" + "<tr><th>SKPD</th><td>" + feature.properties.SKD + "</td></tr>" + "<tr><th>Penggunaan Aset</th><td>" + feature.properties.PGN + "</td></tr>" + "</table></div>" + "<div class='tab-pane fade' id='modalPicture'><img class='img-responsive' src=" + feature.properties.DRO +"></div>" + "<div class='tab-pane fade' id='modalBasicMap'><img class='img-responsive' src=" + feature.properties.PBD +"></div>" + "<div class='tab-pane fade' id='modalMapImagery'><img class='img-responsive' src=" + feature.properties.PUD +"></div></div>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.JDL);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square" aria-hidden="true"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      kesehatanSearch.push({
        name: layer.feature.properties.JDL,
        address: layer.feature.properties.DES,
        source: "Kesehatan",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/kesehatan.geojson", function (data) {
  kesehatans.addData(data);
  map.addLayer(kesehatanLayer);
});

/* Layer Pertanian */
var pertanianLayer = L.geoJson(null);
var pertanians = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties.JDL,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<ul class='nav nav-tabs'>" + "<li class='active'><a href='#modalTechnical' data-toggle='tab'><i class='fa fa-check-square-o'></i> Profil Aset</a></li>" + "<li><a href='#modalPicture' data-toggle='tab'><i class='fa fa-picture-o'></i> Foto Udara</a></li>" + "<li class='dropdown'> <a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'><i class='fa fa-map'></i> Peta <span class='caret'></span></a><ul class='dropdown-menu'>" + "<li><a href='#modalBasicMap' data-toggle='tab'>Peta Bidang Tanah</a></li>" + "<li><a href='#modalMapImagery' data-toggle='tab'>Peta Foto Udara</a></li></ul></li></ul>" + "<div class= 'tab-content'><div class='tab-pane fade active in' id='modalTechnical'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nama Aset</th><td>" + feature.properties.JDL + "</td></tr>" + "<tr><th>Jenis Aset</th><td>" + feature.properties.JNS + "</td></tr>" + "<tr><th>Desa</th><td>" + feature.properties.DES + "</td></tr>" + "<tr><th>Kecamatan</th><td>" + feature.properties.KEC + "</td></tr>" + "<tr><th>Luas</th><td>" + feature.properties.LUS + " m2 </td></tr>" + "<tr><th>Tahun Pengadaan</th><td>" + feature.properties.THN + "</td></tr>" + "<tr><th>Hak Pakai Tanah No</th><td>" + feature.properties.HAK + "</td></tr>" + "<tr><th>Tanggal Sertifikat Tanah</th><td>" + feature.properties.TST + "</td></tr>" + "<tr><th>Nomor Sertifikat Tanah</th><td>" + feature.properties.NST + "</td></tr>" + "<tr><th>Asal Usul Aset</th><td>" + feature.properties.ASU + "</td></tr>" + "<tr><th>SKPD</th><td>" + feature.properties.SKD + "</td></tr>" + "<tr><th>Penggunaan Aset</th><td>" + feature.properties.PGN + "</td></tr>" + "</table></div>" + "<div class='tab-pane fade' id='modalPicture'><img class='img-responsive' src=" + feature.properties.DRO +"></div>" + "<div class='tab-pane fade' id='modalBasicMap'><img class='img-responsive' src=" + feature.properties.PBD +"></div>" + "<div class='tab-pane fade' id='modalMapImagery'><img class='img-responsive' src=" + feature.properties.PUD +"></div></div>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.JDL);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-leaf" aria-hidden="true"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      pertanianSearch.push({
        name: layer.feature.properties.JDL,
        address: layer.feature.properties.DES,
        source: "Pertanian",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/pertanian.geojson", function (data) {
  pertanians.addData(data);
  map.addLayer(pertanianLayer);
});

/* Layer Bangunan Lainnya */
var bangunanLayer = L.geoJson(null);
var bangunans = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties.JDL,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<ul class='nav nav-tabs'>" + "<li class='active'><a href='#modalTechnical' data-toggle='tab'><i class='fa fa-check-square-o'></i> Profil Aset</a></li>" + "<li><a href='#modalPicture' data-toggle='tab'><i class='fa fa-picture-o'></i> Foto Udara</a></li>" + "<li class='dropdown'> <a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'><i class='fa fa-map'></i> Peta <span class='caret'></span></a><ul class='dropdown-menu'>" + "<li><a href='#modalBasicMap' data-toggle='tab'>Peta Bidang Tanah</a></li>" + "<li><a href='#modalMapImagery' data-toggle='tab'>Peta Foto Udara</a></li></ul></li></ul>" + "<div class= 'tab-content'><div class='tab-pane fade active in' id='modalTechnical'><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nama Aset</th><td>" + feature.properties.JDL + "</td></tr>" + "<tr><th>Jenis Aset</th><td>" + feature.properties.JNS + "</td></tr>" + "<tr><th>Desa</th><td>" + feature.properties.DES + "</td></tr>" + "<tr><th>Kecamatan</th><td>" + feature.properties.KEC + "</td></tr>" + "<tr><th>Luas</th><td>" + feature.properties.LUS + " m2 </td></tr>" + "<tr><th>Tahun Pengadaan</th><td>" + feature.properties.THN + "</td></tr>" + "<tr><th>Hak Pakai Tanah No</th><td>" + feature.properties.HAK + "</td></tr>" + "<tr><th>Tanggal Sertifikat Tanah</th><td>" + feature.properties.TST + "</td></tr>" + "<tr><th>Nomor Sertifikat Tanah</th><td>" + feature.properties.NST + "</td></tr>" + "<tr><th>Asal Usul Aset</th><td>" + feature.properties.ASU + "</td></tr>" + "<tr><th>SKPD</th><td>" + feature.properties.SKD + "</td></tr>" + "<tr><th>Penggunaan Aset</th><td>" + feature.properties.PGN + "</td></tr>" + "</table></div>" + "<div class='tab-pane fade' id='modalPicture'><img class='img-responsive' src=" + feature.properties.DRO +"></div>" + "<div class='tab-pane fade' id='modalBasicMap'><img class='img-responsive' src=" + feature.properties.PBD +"></div>" + "<div class='tab-pane fade' id='modalMapImagery'><img class='img-responsive' src=" + feature.properties.PUD +"></div></div>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.JDL);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-institution" aria-hidden="true"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      bangunanSearch.push({
        name: layer.feature.properties.JDL,
        address: layer.feature.properties.DES,
        source: "Bangunan",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/bangunan.geojson", function (data) {
  bangunans.addData(data);
  map.addLayer(bangunanLayer);
});


map = L.map("map", {
  center: [-6.7, 111],
  zoom: 10,
  layers: [OSM, markerClusters],
  zoomControl: false,
  attributionControl: false,
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
   if (e.layer === pendidikanLayer) {
    markerClusters.addLayer(pendidikans);
    syncSidebar();
  }
  if (e.layer === kesehatanLayer) {
    markerClusters.addLayer(kesehatans);
    syncSidebar();
  }
    if (e.layer === pertanianLayer) {
    markerClusters.addLayer(pertanians);
    syncSidebar();
  }
  if (e.layer === bangunanLayer) {
    markerClusters.addLayer(bangunans);
    syncSidebar();
  }      
 });

map.on("overlayremove", function(e) {
  if (e.layer === pendidikanLayer) {
    markerClusters.removeLayer(pendidikans);
    syncSidebar();
  }
  if (e.layer === kesehatanLayer) {
    markerClusters.removeLayer(kesehatans);
    syncSidebar();
  }
  if (e.layer === pertanianLayer) {
    markerClusters.removeLayer(pertanians);
    syncSidebar();
  }
  if (e.layer === bangunanLayer) {
    markerClusters.removeLayer(bangunans);
    syncSidebar();
  }    
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed for <a href='http://http://bpkad.jeparakab.go.id'>BPKAD Pemkab Jepara</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

var scaleControl = L.control.scale({
  position: "bottomleft"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Peta Jalan": OSM,
  "Citra Satelit": MSS
};

var groupedOverlays = {
  "Kategori": {
    "Pendidikan": pendidikanLayer,
    "Kesehatan" : kesehatanLayer,
    "Pertanian" : pertanianLayer,
    "Aset Lainnya": bangunanLayer,
   },
  "Layer": {
    "Bidang Aset": boroughs,
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var pendidikanBH = new Bloodhound({
    name: "Pendidikan",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: pendidikanSearch,
    limit: 10
  })

  var kesehatanBH = new Bloodhound({
    name: "Kesehatan",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: kesehatanSearch,
    limit: 10
  });

  var pertanianBH = new Bloodhound({
    name: "Pertanian",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: pertanianSearch,
    limit: 10
  })

  var bangunanBH = new Bloodhound({
    name: "Bangunan",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: bangunanSearch,
    limit: 10
  });

  pendidikanBH.initialize();
  kesehatanBH.initialize();
  pertanianBH.initialize();
  bangunanBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Pendidikan",
    displayKey: "name",
    source: pendidikanBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-graduation-cap' aria-hidden='true'>&nbsp;Pendidikan</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Kesehatan",
    displayKey: "name",
    source: kesehatanBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-plus-square' aria-hidden='true'>&nbsp;Kesehatan</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Pertanian",
    displayKey: "name",
    source: pertanianBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-leaf' aria-hidden='true'>&nbsp;Pertanian</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }   
  }, {
    name: "Bangunan",
    displayKey: "name",
    source: bangunanBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-institution' aria-hidden='true'>&nbsp;Bangunan Lainnya</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }
  ).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Pendidikan"){
      if (!map.hasLayer(pendidikanLayer)) {
        map.addLayer(pendidikanLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Bangunan") {
      if (!map.hasLayer(bangunanLayer)) {
        map.addLayer(bangunanLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Pertanian"){
      if (!map.hasLayer(pertanianLayer)) {
        map.addLayer(pertanianLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Kesehatan") {
      if (!map.hasLayer(kesehatanLayer)) {
        map.addLayer(kesehatanLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
