import React, { useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaMousePointer } from "react-icons/fa";
import locationService from "../../utils/locationService";
import { toast } from "react-hot-toast";

const LocationMap = ({
  pickupLocation,
  dropLocation,
  height = "300px",
  onLocationClick,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropMarkerRef = useRef(null);
  const tempMarkerRef = useRef(null);

  useEffect(() => {
    loadLeafletAndInitialize();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.L && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [pickupLocation, dropLocation]);

  const loadLeafletAndInitialize = async () => {
    try {
      if (window.L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        if (window.L && window.L.Icon && window.L.Icon.Default) {
          delete window.L.Icon.Default.prototype._getIconUrl;
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          });
        }
        initializeMap();
      };
      script.onerror = () => {
        console.error("Failed to load Leaflet");
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error loading Leaflet:", error);
    }
  };

  const initializeMap = () => {
    if (!window.L || mapInstanceRef.current || !mapRef.current) return;

    try {
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [20.5937, 78.9629],
        5
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add click handler for pinning locations
      if (onLocationClick) {
        mapInstanceRef.current.on("click", handleMapClick);
      }

      updateMarkers();
    } catch (error) {
      console.error("Failed to initialize map:", error);
    }
  };

  const handleMapClick = async (e) => {
    if (!onLocationClick) return;

    const { lat, lng } = e.latlng;

    try {
      // Show temporary marker immediately
      if (tempMarkerRef.current) {
        mapInstanceRef.current.removeLayer(tempMarkerRef.current);
      }

      const tempIcon = window.L.divIcon({
        html: `<div style="background-color: #6B7280; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">?</div>`,
        className: "temp-marker",
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
      });

      tempMarkerRef.current = window.L.marker([lat, lng], { icon: tempIcon })
        .bindPopup("Getting address...")
        .addTo(mapInstanceRef.current);

      // Get address for clicked location
      const locationData = await locationService.reverseGeocode(lat, lng);

      // Remove temporary marker
      if (tempMarkerRef.current) {
        mapInstanceRef.current.removeLayer(tempMarkerRef.current);
        tempMarkerRef.current = null;
      }

      // ✅ Create complete location object matching the expected structure
      const clickedLocationData = {
        address: locationData.address,
        coordinates: {
          latitude: Number(lat),
          longitude: Number(lng),
        },
        placeId: locationData.placeId,
        name: locationData.address.split(",")[0],
        source: "map_click",
        isCurrentLocation: false,
      };

      onLocationClick(clickedLocationData);

      toast.success(
        "Location pinned! Click 'Use for Pickup' or 'Use for Drop' above."
      );
    } catch (error) {
      console.error("Error getting address for clicked location:", error);

      // Remove temporary marker on error
      if (tempMarkerRef.current) {
        mapInstanceRef.current.removeLayer(tempMarkerRef.current);
        tempMarkerRef.current = null;
      }

      // ✅ Still allow manual pin with coordinates only
      const fallbackLocationData = {
        address: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        coordinates: {
          latitude: Number(lat),
          longitude: Number(lng),
        },
        placeId: null,
        name: "Pinned Location",
        source: "map_click",
        isCurrentLocation: false,
      };

      onLocationClick(fallbackLocationData);

      toast.success(
        "Location pinned! Click 'Use for Pickup' or 'Use for Drop' above."
      );
    }
  };

  const updateMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;

    try {
      // Clear existing markers
      [pickupMarkerRef, dropMarkerRef].forEach((markerRef) => {
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }
      });

      const markers = [];

      // Add pickup marker
      if (pickupLocation?.coordinates?.latitude) {
        const pickupIcon = window.L.divIcon({
          html: `<div style="background-color: #10B981; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">P</div>`,
          className: "pickup-marker",
          iconSize: [35, 35],
          iconAnchor: [17.5, 17.5],
        });

        pickupMarkerRef.current = window.L.marker(
          [
            pickupLocation.coordinates.latitude,
            pickupLocation.coordinates.longitude,
          ],
          { icon: pickupIcon }
        )
          .bindPopup(`<b>🚗 Pickup Location</b><br>${pickupLocation.address}`)
          .addTo(mapInstanceRef.current);

        markers.push([
          pickupLocation.coordinates.latitude,
          pickupLocation.coordinates.longitude,
        ]);
      }

      // Add drop marker
      if (dropLocation?.coordinates?.latitude) {
        const dropIcon = window.L.divIcon({
          html: `<div style="background-color: #EF4444; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">D</div>`,
          className: "drop-marker",
          iconSize: [35, 35],
          iconAnchor: [17.5, 17.5],
        });

        dropMarkerRef.current = window.L.marker(
          [
            dropLocation.coordinates.latitude,
            dropLocation.coordinates.longitude,
          ],
          { icon: dropIcon }
        )
          .bindPopup(`<b>🏁 Drop Location</b><br>${dropLocation.address}`)
          .addTo(mapInstanceRef.current);

        markers.push([
          dropLocation.coordinates.latitude,
          dropLocation.coordinates.longitude,
        ]);
      }

      // Fit bounds to show all markers
      if (markers.length > 0) {
        if (markers.length === 1) {
          mapInstanceRef.current.setView(markers[0], 12);
        } else {
          const bounds = window.L.latLngBounds(markers);
          mapInstanceRef.current.fitBounds(bounds.pad(0.1));
        }
      }
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  };

  // ✅ Always show the map
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          Interactive Map
        </h4>

        {/* Legend & Instructions */}
        <div className="flex items-center space-x-4 text-xs">
          {pickupLocation?.coordinates?.latitude && (
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-600">Pickup</span>
            </div>
          )}
          {dropLocation?.coordinates?.latitude && (
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-600">Drop</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-blue-600">
            <FaMousePointer />
            <span>Click to pin</span>
          </div>
        </div>
      </div>

      {/* ✅ Always render the map div */}
      <div
        ref={mapRef}
        className="w-full rounded-lg border border-gray-300 cursor-crosshair"
        style={{ height }}
      />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>© OpenStreetMap contributors</span>
        <span className="text-blue-600">
          {!pickupLocation?.coordinates?.latitude &&
          !dropLocation?.coordinates?.latitude
            ? "Click anywhere on the map to pin a location"
            : pickupLocation?.coordinates?.latitude &&
              dropLocation?.coordinates?.latitude &&
              pickupLocation.coordinates.latitude ===
                dropLocation.coordinates.latitude &&
              pickupLocation.coordinates.longitude ===
                dropLocation.coordinates.longitude
            ? "Same pickup & drop location ✓"
            : "Click map to add more locations"}
        </span>
      </div>
    </div>
  );
};

export default LocationMap;
