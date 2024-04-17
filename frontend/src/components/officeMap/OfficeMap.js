import React from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AddImageOverlay = ({ imageUrl, bounds }) => {
  const map = useMap();

  // Utilisez React.useEffect pour ajouter l'overlay après que la carte a été initialisée
  React.useEffect(() => {
    const overlay = L.imageOverlay(imageUrl, bounds, { opacity: 1 }).addTo(map);
    return () => {
      map.removeLayer(overlay); // Nettoyez en enlevant l'overlay lorsque le composant est démonté
    };
  }, [map, imageUrl, bounds]); // Dépendances de l'effet pour recharger l'overlay si nécessaire

  return null;
};

const OfficeMap = () => {
  const imageUrl = process.env.PUBLIC_URL + "/Plan1Bis.png"; // Chemin relatif vers votre image de plan
  const bounds = [
    [0, 0], // Coordonnée du coin supérieur gauche de l'image
    [100, 100], // Coordonnée du coin inférieur droit de l'image
  ];

  return (
    <div className="main">
      <h2>Pick a desk</h2>
      <MapContainer
        center={[50, 50]} // Centrez la carte au milieu de l'image
        zoom={3} // Niveau de zoom initial
        style={{ height: "100vh", width: "50%" }} // Hauteur et largeur de la carte
        crs={L.CRS.Simple} // Utilisation du système de coordonnées simplifié
      >
        <AddImageOverlay imageUrl={imageUrl} bounds={bounds} />
        {/* Pas besoin de TileLayer ici puisque vous n'utilisez pas de tuiles de carte géographique */}
      </MapContainer>
    </div>
  );
};

export default OfficeMap;
