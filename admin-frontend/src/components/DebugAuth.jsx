import { useAuth } from '../hooks/useAuth';

const DebugAuth = () => {
  const { user, profileExists, restaurantData, loading } = useAuth();

  const getProfileExistsText = () => {
    if (profileExists === null) return 'null (no verificado)';
    if (profileExists === true) return 'true';
    if (profileExists === false) return 'false';
    return 'undefined';
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Debug Auth</h3>
      <div className="text-xs space-y-1">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? 'Presente' : 'Ausente'}</div>
        <div><strong>Profile Exists:</strong> {getProfileExistsText()}</div>
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

export default DebugAuth; 