import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const DebugApp = () => {
  const { user, profileExists, restaurantData, loading } = useAuth();
  const location = useLocation();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Debug App</h3>
      <div className="text-xs space-y-1">
        <div><strong>Path:</strong> {location.pathname}</div>
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? 'Presente' : 'Ausente'}</div>
        <div><strong>Profile Exists:</strong> {profileExists === null ? 'null' : profileExists ? 'true' : 'false'}</div>
        <div><strong>Restaurant Data:</strong> {restaurantData ? 'Presente' : 'Ausente'}</div>
        {user && (
          <div><strong>User ID:</strong> {user.id}</div>
        )}
        {restaurantData && (
          <div><strong>Restaurant:</strong> {restaurantData.name}</div>
        )}
      </div>
    </div>
  );
};

export default DebugApp; 