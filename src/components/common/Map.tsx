import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Định nghĩa types
interface MapPosition {
  lat: number;
  lng: number;
}

interface MarkerData {
  id: string;
  position: MapPosition;
  title: string;
  description?: string;
}

interface MapProps {
  center?: MapPosition;
  zoom?: number;
  markers?: MarkerData[];
  height?: string | number;
  width?: string | number;
  onMapClick?: (position: MapPosition) => void;
  onMarkerClick?: (marker: MarkerData) => void;
}

// Component để xử lý click event trên map
const MapClickHandler: React.FC<{
  onMapClick?: (position: MapPosition) => void;
}> = ({ onMapClick }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

// Main Map Component
const MapWrapper: React.FC<MapProps> = ({
  center = { lat: 21.0285, lng: 105.8542 }, // Mặc định là Hà Nội
  zoom = 13,
  markers = [],
  height = "400px",
  width = "100%",
  onMapClick,
  onMarkerClick,
}) => {
  return (
    <div style={{ height, width }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* Tile Layer - OpenStreetMap */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt1", "mt2", "mt3", "mt0"]}
        />

        {/* Map Click Handler */}
        <MapClickHandler onMapClick={onMapClick} />

        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            eventHandlers={{
              click: () => {
                onMarkerClick?.(marker);
              },
            }}
          >
            <Popup>
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                  {marker.title}
                </h3>
                {marker.description && (
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {marker.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Example usage component
export default function Map({ setCoordinates }) {
  const [clickedPosition, setClickedPosition] =
    React.useState<MapPosition | null>(null);

  const sampleMarkers: MarkerData[] = [
    {
      id: "1",
      position: { lat: 21.0285, lng: 105.8542 },
      title: "Hà Nội",
      description: "Thủ đô của Việt Nam",
    },
    {
      id: "2",
      position: { lat: 10.8231, lng: 106.6297 },
      title: "TP. Hồ Chí Minh",
      description: "Thành phố lớn nhất Việt Nam",
    },
    {
      id: "3",
      position: { lat: 16.0544, lng: 108.2022 },
      title: "Đà Nẵng",
      description: "Thành phố miền Trung",
    },
  ];

  const handleMapClick = (position: MapPosition) => {
    // setClickedPosition(position);
    // console.log("Clicked at:", position);
    setCoordinates({
      lat: position.lat.toFixed(6),
      lng: position.lng.toFixed(6),
    });
  };

  const handleMarkerClick = (marker: MarkerData) => {
    console.log("Marker clicked:", marker);
    // alert(`Bạn đã click vào: ${marker.title}`);
  };

  return (
    <div>
      <MapWrapper
        center={{ lat: 16.0544, lng: 108.2022 }}
        zoom={6}
        markers={sampleMarkers}
        height="600px"
        onMapClick={handleMapClick}
        onMarkerClick={handleMarkerClick}
      />
      <div className="mt-2">
        <p>
          <strong>Lưu ý: </strong>Click vào bản đồ để lấy tọa độ vị trí đã chọn
        </p>
      </div>
      {/* {clickedPosition && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <strong>Vị trí được click:</strong>
          <br />
          Latitude: {clickedPosition.lat.toFixed(6)}
          <br />
          Longitude: {clickedPosition.lng.toFixed(6)}
        </div>
      )} */}
    </div>
  );
}
