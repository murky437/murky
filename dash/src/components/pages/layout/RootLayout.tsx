import type {RouteSectionProps} from '@solidjs/router';
import {Link, Meta, MetaProvider, Title} from "@solidjs/meta";

function RootLayout(props: RouteSectionProps) {
    return (
        <MetaProvider>
            <Meta charset={"UTF-8"}/>
            <Link rel="icon" type="image/svg+xml" href="/vite.svg"/>
            <Meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <Title>murky.dev</Title>
            {props.children}
        </MetaProvider>
    );
}

export {RootLayout};
