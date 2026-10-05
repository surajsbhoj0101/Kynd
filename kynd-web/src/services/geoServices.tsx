export interface GeocodingResponse {
  type: "FeatureCollection";
  features: GeocodingFeature[];
}

export interface GeocodingFeature {
  id: string;
  type: "Feature";
  place_name: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export const getLocationsSuggestions = async (
  location: string,
): Promise<GeocodingResponse> => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location,
    )}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location suggestions");
    }
    const data: GeocodingResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return { type: "FeatureCollection", features: [] };
  }
};

export type GeocodedLocation = {
  label: string;
  longitude: number;
  latitude: number;
};

export const reverseGeocodeLocation = async (
  longitude: number,
  latitude: number,
): Promise<GeocodedLocation> => {
  const url =
    `https://api.mapbox.com/search/geocode/v6/reverse` +
    `?longitude=${longitude}&latitude=${latitude}&limit=1` +
    `&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to determine current location");
  }

  const data = (await response.json()) as {
    features?: Array<{
      properties?: { full_address?: string; name?: string };
      geometry?: { coordinates?: [number, number] };
    }>;
  };
  const feature = data.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  const label = feature?.properties?.full_address || feature?.properties?.name;

  if (!label || !coordinates) {
    throw new Error("Unable to determine a readable location");
  }

  return {
    label,
    longitude: coordinates[0],
    latitude: coordinates[1],
  };
};
