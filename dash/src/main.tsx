import {StrictMode} from 'react'
import './index.css'
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {createRoot} from "react-dom/client";
import {AuthProvider, useAuth} from "./context/AuthContext.tsx";
import {routeTree} from "./routeTree.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const router = createRouter({
    routeTree: routeTree,
    context: {
        auth: undefined!
    }
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <InnerApp/>
            </AuthProvider>
        </QueryClientProvider>
    )
}

function InnerApp() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{auth: auth}}/>
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
        <StrictMode>
            <App/>
        </StrictMode>,
    )
}