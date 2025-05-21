import { getProjectDetail } from "@/api/apiClient";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { useParams } from "react-router-dom";
import { divIcon, Map, point } from "leaflet";
import type { IssueDto } from "@/interfaces/Issue/IssueDto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
const { Meta } = Card;
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import ReactDOMServer from "react-dom/server";
import { Card } from "antd";
import dayjs from "dayjs";
// const risks = [
//   { id: 1, name: "Cháy nổ", lat: 21.03, lng: 105.85 },
//   { id: 2, name: "Ngập lụt", lat: 21.01, lng: 105.82 },
// ];

interface MarkercoutProps {
  issue: IssueDto;
}

const Markercount = ({ issue }: MarkercoutProps) => {
  const getColor = () => {
    if (issue.score == undefined) {
      return "rgb(45, 183, 245)";
    }
    if (issue.score > 15) {
      return "rgb(255, 85, 0)";
    }
    if (issue.score <= 12 && issue.score >= 8) {
      return "oklch(85.2% 0.199 91.936)";
    }
    if (issue.score <= 6 && issue.score >= 1) {
      return "oklch(72.3% 0.219 149.579)";
    }
  };
  return (
    <div>
      <Marker
        //ref={marker}
        icon={divIcon({
          html: ReactDOMServer.renderToString(
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              fontSize={30}
              color={getColor()}
            ></FontAwesomeIcon>
          ),
          className: "marker-p",
          iconSize: point(30, 30, false),
        })}
        position={[issue.lat, issue.long]}
      >
        <Tooltip className="">
          <Card
            style={{ width: 240 }}
            // cover={
            //   <img
            //     alt="example"
            //     src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            //   />
            // }
          >
            <div
              style={{
                maxHeight: "300px",
                width: "200px",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                overflow: "hidden",
              }}
            >
              <Meta
                title={
                  <div>
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      fontSize={20}
                      color={getColor()}
                    ></FontAwesomeIcon>
                    {" " + issue.issueName}
                  </div>
                }
                description={
                  dayjs(issue.startDated).format("DD/MM/YYYY") +
                  " - " +
                  dayjs(issue.endDate).format("DD/MM/YYYY")
                }
                style={{ marginBottom: "20px" }}
              />
              {parse(issue.riskDecriptions)}
            </div>
          </Card>
        </Tooltip>
      </Marker>
    </div>
  );
};

interface MapRiskProps {
  issues: IssueDto[];
}
const MapRisk: React.FC<MapRiskProps> = ({ issues }: MapRiskProps) => {
  console.log("xar", issues);
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const markerRef = useRef<Map | null>(null);
  useEffect(() => {
    fecthProject();
  }, []);
  const fecthProject = async () => {
    try {
      const result = await getProjectDetail(projectId);
      if (result.isSuccessded && result.data != null) {
        setProject(result.data);
        markerRef.current?.setView(
          [
            result.data?.lat ?? 21.03875771817923,
            result.data?.long ?? 105.83756276342699,
          ],
          10
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  // if (!center) return <p>Đang tải bản đồ...</p>;
  return (
    <MapContainer
      center={[21.03875771817923, 105.83756276342699]}
      zoom={8}
      ref={markerRef}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "500px" }}
      //ref={markerRef}
    >
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt1", "mt2", "mt3", "mt0"]}
      />
      {/* <GeoJSON
        key={v4()} // key mới mỗi khi jsonData thay đổi
        data={jsonData}
        style={geoJsonStyle}
        onEachFeature={onEachFeature}
      /> */}
      {issues.map((ele) => (
        <Markercount issue={ele} />
      ))}
    </MapContainer>
  );
};

export default MapRisk;
