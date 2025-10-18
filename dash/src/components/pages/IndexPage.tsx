import { useNavigate } from '@solidjs/router';

function IndexPage() {
  const navigate = useNavigate();
  navigate('/notes', { replace: true });

  return '';
}

export { IndexPage };
