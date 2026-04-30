import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function getRiskColor(score) {
  const value = Number(score);

  if (value >= 0.4) return "#ef4444"; // rouge
  if (value >= 0.2) return "#f59e0b"; // orange
  return "#22c55e"; // vert
}

function getRiskLabel(score) {
  const value = Number(score);

  if (value >= 0.4) return "Risque élevé";
  if (value >= 0.2) return "Risque modéré";
  return "Normal";
}

function getChartColor(name) {
  if (name === "Normal") return "#22c55e";
  if (name === "Modéré") return "#f59e0b";
  return "#ef4444";
}

export default function App() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/data/Senegal_Regions_Risk_GeoJSON_V3.geojson")
      .then((res) => res.json())
      .then((geo) => setGeoData(geo))
      .catch((error) => {
        console.error("Erreur chargement GeoJSON :", error);
      });
  }, []);

  const regions =
    geoData?.features.map((feature) => {
      const name = feature.properties.ADM1_NAME;
      const score = Number(feature.properties.mean || 0);
      const label = getRiskLabel(score);

      return { name, score, label };
    }) || [];

  const normalCount = regions.filter((r) => r.label === "Normal").length;
  const moderateCount = regions.filter(
    (r) => r.label === "Risque modéré"
  ).length;
  const highCount = regions.filter((r) => r.label === "Risque élevé").length;

  const chartData = [
    { name: "Normal", value: normalCount },
    { name: "Modéré", value: moderateCount },
    { name: "Élevé", value: highCount },
  ];

  const priorityRegions = regions
    .filter((r) => r.label !== "Normal")
    .sort((a, b) => b.score - a.score);

  function exportReport() {
    const date = new Date().toLocaleDateString();

    let report = `
GeoAgri Sénégal - Rapport de Risque Agricole
Date : ${date}

Résumé :
- Régions normales : ${normalCount}
- Régions à risque modéré : ${moderateCount}
- Régions à risque élevé : ${highCount}

Régions prioritaires :
`;

    if (priorityRegions.length === 0) {
      report += "Aucune région critique détectée.\n";
    } else {
      priorityRegions.forEach((region) => {
        report += `- ${region.name} : ${region.score.toFixed(2)} (${region.label})\n`;
      });
    }

    const blob = new Blob([report], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "GeoAgri_Rapport_Senegal.txt";
    link.click();
  }

  function styleRegion(feature) {
    const score = Number(feature.properties.mean || 0);

    return {
      color: "#1d4ed8",
      weight: 2,
      fillColor: getRiskColor(score),
      fillOpacity: 0.65,
    };
  }

  function onEachRegion(feature, layer) {
    const name = feature.properties.ADM1_NAME;
    const score = Number(feature.properties.mean || 0);
    const label = getRiskLabel(score);

    layer.bindPopup(`
      <strong>${name}</strong><br/>
      Score risque : ${score.toFixed(2)}<br/>
      Niveau : ${label}
    `);
  }

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1000,
          background: "white",
          padding: "14px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          width: "300px",
          fontFamily: "Arial, sans-serif",
          fontSize: "13px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0" }}>
          GeoAgri Sénégal – Système d’alerte sécheresse
        </h3>

        <p style={{ margin: "0 0 10px 0", color: "#555" }}>
          Système d’alerte précoce sécheresse et mauvaises récoltes
        </p>

        <hr />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>🟢 Normal</span>
          <strong>{normalCount}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>🟠 Risque modéré</span>
          <strong>{moderateCount}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>🔴 Risque élevé</span>
          <strong>{highCount}</strong>
        </div>

        <div style={{ height: "150px", marginTop: "10px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <hr />

        <strong>Régions prioritaires</strong>

        {priorityRegions.length === 0 ? (
          <p>Aucune région critique détectée.</p>
        ) : (
          <ul style={{ paddingLeft: "0", listStyle: "none" }}>
            {priorityRegions.map((region) => (
              <li
                key={region.name}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    background: getRiskColor(region.score),
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    marginRight: "8px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    minWidth: "95px",
                    textAlign: "center",
                  }}
                >
                  {region.label}
                </span>
                {region.name} — {region.score.toFixed(2)}
              </li>
            ))}
          </ul>
        )}

        <hr />

        <button
          onClick={exportReport}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "8px",
            background: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          📄 Exporter le rapport
        </button>
      </div>

      <MapContainer
        center={[14.5, -14.5]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            style={styleRegion}
            onEachFeature={onEachRegion}
          />
        )}
      </MapContainer>
    </div>
  );
}