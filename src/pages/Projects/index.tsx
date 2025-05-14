import { useParams } from "react-router-dom";

const Projects = () => {
  const { projectId } = useParams();

  return <div>{projectId}</div>;
};

export default Projects;
