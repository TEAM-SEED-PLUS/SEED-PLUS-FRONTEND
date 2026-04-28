const HomePage = () => {
  const appName = import.meta.env.VITE_APP_NAME;
  const apiUrl = import.meta.env.VITE_API_URL;
  const appVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{appName ?? 'SEED PLUS'}</h1>
        <p className="text-lg">Welcome to SEED-PLUS!</p>
        <p>API URL: {apiUrl}</p>
        <p>Version: {appVersion}</p>
      </div>
    </div>
  );
};

export default HomePage;
