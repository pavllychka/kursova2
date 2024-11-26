import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import { Project, ServerUser } from '@/types';
import { getProjects, getUsers } from '@/api';
import { FolderRootIcon, UserRoundIcon } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { useAuth } from '@/context/AuthContext';

const createLucideIconMarker = (): DivIcon => {
  const iconHTML = renderToString(
      <UserRoundIcon size={24} color="#007bff" />
  );
  return L.divIcon({
      html: iconHTML,
      className: 'custom-lucide-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
  });
};

const createLucideIconProjectMarker = (): DivIcon => {
  const iconHTML = renderToString(
      <FolderRootIcon size={24} color="#007bff" />
  );
  return L.divIcon({
      html: iconHTML,
      className: 'custom-lucide-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
  });
};

const MapComponent = () => {
  const [users, setUsers] = useState<ServerUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const { user: currentUser } = useAuth()
  console.log(users, projects)

  useEffect(() => {
    getProjects().then(setProjects)
    getUsers().then(setUsers)
  }, [])

  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {users.map(user => (
        <Marker key={`user-${user.id}`} position={[user.location.x, user.location.y]} icon={createLucideIconMarker()}>
          <Popup>
            <strong>User:</strong> {user.id === currentUser?.id ? `You (${user.name})` : user.name}
          </Popup>
        </Marker>
      ))}

      {projects.map(project => (
        <Marker key={`project-${project.id}`} position={[project.location.x, project.location.y]} icon={createLucideIconProjectMarker()}>
          <Popup>
            <strong>Project:</strong> {project.title}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
