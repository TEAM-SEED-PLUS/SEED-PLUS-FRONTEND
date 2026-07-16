import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks';

const NotFoundPage = () => {
  useDocumentTitle('페이지를 찾을 수 없습니다');

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
