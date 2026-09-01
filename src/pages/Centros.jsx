import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import L from 'leaflet';

import {
  Cross,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search
} from 'lucide-react';

import { centers } from '../data/centers';

import 'leaflet/dist/leaflet.css';


/* =========================================================
   DISTÂNCIA — HAVERSINE
   ========================================================= */

function distanceBetweenCoordinates(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    degrees * (Math.PI / 180);

  const deltaLat =
    toRadians(lat2 - lat1);

  const deltaLon =
    toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}


function formatDistance(distance) {
  if (distance === null) {
    return null;
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance
    .toFixed(1)
    .replace('.', ',')} km`;
}


/* =========================================================
   ÍCONE DOS CENTROS
   ========================================================= */

function createCenterIcon(isNearest = false) {
  return L.divIcon({
    className: '',

    html: `
      <div class="
        leaflet-sinta-center-marker
        ${isNearest
          ? 'leaflet-sinta-center-marker-nearest'
          : ''}
      ">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 5v14M5 12h14"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    `,

    iconSize: [42, 50],

    iconAnchor: [21, 48],

    popupAnchor: [0, -45]
  });
}


/* =========================================================
   PÁGINA
   ========================================================= */

export default function Centros() {

  const mapElementRef =
    useRef(null);

  const mapInstanceRef =
    useRef(null);

  const markersLayerRef =
    useRef(null);


  const [search, setSearch] =
    useState('');

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationStatus, setLocationStatus] =
    useState('idle');

  const [locationError, setLocationError] =
    useState('');


  /* =======================================================
     LOCALIZAÇÃO DO USUÁRIO
     ======================================================= */

  function handleUseLocation() {

    if (!navigator.geolocation) {

      setLocationStatus('error');

      setLocationError(
        'Seu navegador não oferece suporte à geolocalização.'
      );

      return;
    }


    setLocationStatus('loading');

    setLocationError('');


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude,
          longitude
        } = position.coords;

        setUserLocation({
          latitude,
          longitude
        });

        setLocationStatus('success');
      },


      (error) => {

        setLocationStatus('error');

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          setLocationError(
            'O acesso à localização foi bloqueado. Permita o uso da localização nas configurações do navegador.'
          );

          return;
        }


        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          setLocationError(
            'Não foi possível determinar sua localização neste momento.'
          );

          return;
        }


        if (
          error.code ===
          error.TIMEOUT
        ) {

          setLocationError(
            'A localização demorou mais que o esperado. Tente novamente.'
          );

          return;
        }


        setLocationError(
          'Não foi possível acessar sua localização.'
        );
      },


      {
        enableHighAccuracy: true,

        timeout: 12000,

        maximumAge: 30000
      }
    );
  }


  /* =======================================================
     CENTROS + DISTÂNCIA
     ======================================================= */

  const centersWithDistance =
    useMemo(() => {

      const result =
        centers.map((center) => {

          let distance = null;


          if (
            userLocation &&
            center.latitude !== null &&
            center.longitude !== null
          ) {

            distance =
              distanceBetweenCoordinates(
                userLocation.latitude,
                userLocation.longitude,
                center.latitude,
                center.longitude
              );
          }


          return {
            ...center,
            distance
          };
        });


      if (userLocation) {

        result.sort((a, b) => {

          if (a.distance === null) {
            return 1;
          }

          if (b.distance === null) {
            return -1;
          }

          return a.distance - b.distance;
        });
      }


      return result;

    }, [userLocation]);


  /* =======================================================
     PESQUISA
     ======================================================= */

  const filteredCenters =
    useMemo(() => {

      const normalized =
        search
          .trim()
          .toLowerCase();


      if (!normalized) {
        return centersWithDistance;
      }


      return centersWithDistance.filter(
        (center) => {

          const text = `
            ${center.name}
            ${center.city}
            ${center.address}
          `.toLowerCase();


          return text.includes(normalized);
        }
      );

    }, [
      search,
      centersWithDistance
    ]);


  /* =======================================================
     CRIA O MAPA
     ======================================================= */

  useEffect(() => {

    if (
      !mapElementRef.current ||
      mapInstanceRef.current
    ) {
      return;
    }


    const map =
      L.map(
        mapElementRef.current,
        {
          zoomControl: true,

          attributionControl: true
        }
      );


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,

        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);


    const layerGroup =
      L.layerGroup()
        .addTo(map);


    mapInstanceRef.current =
      map;

    markersLayerRef.current =
      layerGroup;


    /*
      Centro inicial aproximado da região
      Botucatu / Avaré / Bauru.
    */

    map.setView(
      [-22.65, -48.85],
      8
    );


    /*
      Muito importante quando o mapa nasce
      dentro de layouts responsivos.
    */

    setTimeout(() => {

      map.invalidateSize();

    }, 100);


    return () => {

      map.remove();

      mapInstanceRef.current = null;

      markersLayerRef.current = null;
    };

  }, []);


  /* =======================================================
     ATUALIZA CENTROS / USUÁRIO NO MAPA
     ======================================================= */

  useEffect(() => {

    const map =
      mapInstanceRef.current;

    const markersLayer =
      markersLayerRef.current;


    if (
      !map ||
      !markersLayer
    ) {
      return;
    }


    markersLayer.clearLayers();


    const bounds = [];


    filteredCenters.forEach(
      (center, index) => {

        if (
          center.latitude === null ||
          center.longitude === null
        ) {
          return;
        }


        const isNearest =
          Boolean(
            userLocation &&
            index === 0 &&
            center.distance !== null
          );


        const marker =
          L.marker(
            [
              center.latitude,
              center.longitude
            ],
            {
              icon:
                createCenterIcon(
                  isNearest
                )
            }
          );


        const distanceText =
          center.distance !== null
            ? `
                <div class="map-popup-distance">
                  ${formatDistance(
                    center.distance
                  )} de você
                </div>
              `
            : '';


        marker.bindPopup(`
          <div class="sinta-map-popup">

            ${
              isNearest
                ? `
                  <span class="map-popup-nearest">
                    Mais próximo
                  </span>
                `
                : ''
            }

            <strong>
              ${center.name}
            </strong>

            <span>
              ${center.city}
            </span>

            ${distanceText}

          </div>
        `);


        marker.addTo(
          markersLayer
        );


        bounds.push([
          center.latitude,
          center.longitude
        ]);
      }
    );


    /* =====================================================
       MARCADOR DO USUÁRIO
       ===================================================== */

    if (userLocation) {

      const userPoint =
        [
          userLocation.latitude,
          userLocation.longitude
        ];


      L.circleMarker(
        userPoint,
        {
          radius: 9,

          color: '#FFFFFF',

          weight: 3,

          fillColor: '#178A57',

          fillOpacity: 1
        }
      )
        .bindPopup(
          '<strong>Sua localização</strong>'
        )
        .addTo(
          markersLayer
        );


      L.circle(
        userPoint,
        {
          radius: 800,

          color: '#178A57',

          weight: 1,

          opacity: 0.22,

          fillColor: '#178A57',

          fillOpacity: 0.08
        }
      )
        .addTo(
          markersLayer
        );


      bounds.push(
        userPoint
      );
    }


    /* =====================================================
       ENQUADRAMENTO AUTOMÁTICO
       ===================================================== */

    if (userLocation) {
      map.setView(
        [
          userLocation.latitude,
          userLocation.longitude
        ],
        15,
        {
          animate: true
        }
      );
    }
    else if (bounds.length > 0) {
      map.fitBounds(
        bounds,
        {
          padding: [45, 45],
          maxZoom: 9
        }
      );
    }


    setTimeout(() => {

      map.invalidateSize();

    }, 80);


  }, [
    filteredCenters,
    userLocation
  ]);


  /* =======================================================
     ABRIR ROTA
     ======================================================= */

  function openDirections(center) {

    const destination =
      center.latitude !== null &&
      center.longitude !== null
        ? `${center.latitude},${center.longitude}`
        : `${center.name}, ${center.city}`;


    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${encodeURIComponent(
        destination
      )}`;


    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  }


  return (

    <div className="centers-page">


      {/* ===================================================
          CABEÇALHO
         =================================================== */}

      <section className="centers-heading">

        <h1 className="page-title">
          Centros de atendimento
        </h1>

        <p className="page-subtitle">
          Encontre unidades próximas preparadas
          para o atendimento de acidentes com serpentes.
        </p>

      </section>


      {/* ===================================================
          LOCALIZAÇÃO / BUSCA
         =================================================== */}

      <section className="centers-tools">

        <div className="centers-search">

          <Search
            size={20}
            strokeWidth={2}
          />

          <input
            type="search"
            placeholder="Pesquisar cidade ou unidade"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <button
          type="button"
          className="location-button"
          onClick={
            handleUseLocation
          }
          disabled={
            locationStatus ===
            'loading'
          }
        >

          <LocateFixed
            size={20}
            strokeWidth={2}
          />

          {locationStatus ===
          'loading'
            ? 'Obtendo localização...'
            : locationStatus ===
              'success'
            ? 'Localização atualizada'
            : 'Usar minha localização'}

        </button>

      </section>


      {locationStatus ===
        'success' && (

        <div className="location-success">

          <LocateFixed
            size={18}
          />

          <span>
            Localização obtida.
            Os centros foram ordenados
            pela distância até você.
          </span>

        </div>
      )}


      {locationStatus ===
        'error' && (

        <div className="location-error">

          <MapPin
            size={18}
          />

          <span>
            {locationError}
          </span>

        </div>
      )}


      {/* ===================================================
          MAPA REAL
         =================================================== */}

      <section className="centers-map-real">

        <div
          ref={mapElementRef}
          className="leaflet-sinta-map"
          aria-label="Mapa dos centros de atendimento"
        />

      </section>


      {/* ===================================================
          LISTA
         =================================================== */}

      <section className="centers-results">

        <div className="centers-results-header">

          <h2>
            Unidades de atendimento
          </h2>

          <span>
            {filteredCenters.length}
            {' '}
            {filteredCenters.length === 1
              ? 'unidade'
              : 'unidades'}
          </span>

        </div>


        <div className="centers-list">

          {filteredCenters.map(
            (center, index) => (

              <article
                key={center.id}
                className="center-card"
              >

                <div className="center-card-top">

                  <div className="center-icon">

                    <Cross
                      size={24}
                      strokeWidth={2.5}
                    />

                  </div>


                  <div className="center-main-info">


                    {userLocation &&
                      index === 0 &&
                      center.distance !== null && (

                        <span className="nearest-badge">
                          Mais próximo
                        </span>
                      )}


                    <h3>
                      {center.name}
                    </h3>


                    {center.distance !== null && (

                      <div className="center-distance">

                        <MapPin
                          size={15}
                        />

                        <strong>
                          {formatDistance(
                            center.distance
                          )}
                        </strong>

                      </div>
                    )}

                  </div>

                </div>


                <div className="center-details">


                  <div className="center-detail-row">

                    <MapPin
                      size={18}
                    />

                    <span>
                      {center.city}
                    </span>

                  </div>


                  {center.phone && (

                    <a
                      className="center-detail-row center-phone"
                      href={`tel:${center.phoneRaw}`}
                    >

                      <Phone
                        size={18}
                      />

                      <span>
                        {center.phone}
                      </span>

                    </a>
                  )}

                </div>


                {center.antivenoms?.length >
                  0 && (

                  <div className="center-antivenoms">

                    <span className="antivenom-label">
                      Soros disponíveis
                    </span>


                    <div className="antivenom-tags">

                      {center.antivenoms.map(
                        (antivenom) => (

                          <span
                            key={antivenom}
                            className="antivenom-tag"
                          >
                            {antivenom}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}


                <button
                  type="button"
                  className="directions-button"
                  onClick={() =>
                    openDirections(
                      center
                    )
                  }
                >

                  <Navigation
                    size={18}
                  />

                  Como chegar

                </button>

              </article>
            )
          )}

        </div>

      </section>

    </div>
  );
}