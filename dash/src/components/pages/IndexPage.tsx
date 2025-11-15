import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';

const IndexPage: Component = () => {
  const navigate = useNavigate();
  navigate('/apps', { replace: true });

  return 'Hello, world';
};

export { IndexPage };
