import { Link, Meta, MetaProvider, Title } from '@solidjs/meta';
import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { AppStatus } from '../../shared/status/AppStatus.tsx';
import { ConfirmModal } from '../../shared/modal/ConfirmModal.tsx';
import { useApp } from '../../../app/appContext.tsx';

function Root(props: RouteSectionProps) {
  const app = useApp();
  app.setNavigator(useNavigate());
  return (
    <MetaProvider>
      <Meta charset={'UTF-8'} />
      <Link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, interactive-widget=resizes-content"
      />
      <Title>murky.dev</Title>
      {props.children}
      <AppStatus />
      <ConfirmModal />
    </MetaProvider>
  );
}

export { Root };
