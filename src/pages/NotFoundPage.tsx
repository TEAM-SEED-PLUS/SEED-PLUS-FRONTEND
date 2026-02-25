import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <div>
        <h1>404</h1>
        <p>Page Not Found</p>
        <Link to="/">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
