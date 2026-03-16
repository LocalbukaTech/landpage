"use client";

import { useState, useEffect } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  permissionStatus: PermissionState | "unknown";
}

const DEFAULT_LAT = 6.5244; // Lagos
const DEFAULT_LNG = 3.3792; // Lagos

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
    permissionStatus: "unknown",
  });

  const getPosition = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser.",
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
          permissionStatus: "granted",
        });
      },
      (error) => {
        let errorMessage = "An unknown error occurred while retrieving location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
        }

        setState({
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
          loading: false,
          error: errorMessage,
          permissionStatus: "denied",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Check permission status if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setState((prev) => ({ ...prev, permissionStatus: result.state }));
        
        // Listen for changes
        result.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: result.state }));
          if (result.state === "granted") {
            getPosition();
          }
        };
      });
    }

    getPosition();
  }, []);

  return state;
}
