import {createRootRouteWithContext, createRoute, Navigate, Outlet, redirect} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {LoginPage} from "./pages/LoginPage.tsx";
import {type} from "arktype";
import type {AuthContext} from "./context/AuthContext.tsx";
import {NotesBasePage} from "./pages/notes/NotesBasePage.tsx";
import {OpenNotesPage} from "./pages/notes/OpenNotesPage.tsx";
import {getProjectList} from "./api/project.tsx";

interface MyRouterContext {
    auth: AuthContext
}

const __root = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>
            <Outlet/>
            <TanStackRouterDevtools position={'bottom-right'}/>
        </>
    ),
})

const login = createRoute({
    getParentRoute: () => __root,
    path: '/login',
    validateSearch: type({
        redirect: 'string?',
    }),
    beforeLoad: ({context, search}) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: search.redirect || index.to,
                replace: true
            })
        }
    },
    component: LoginPage,
})

const _auth = createRoute({
    getParentRoute: () => __root,
    id: '/_auth',
    beforeLoad: ({context, location}) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href
                }
            })
        }
    }
})

const index = createRoute({
    getParentRoute: () => _auth,
    path: '/',
    component: () => <Navigate to={notes.to} replace={true}/>
})

const notes = createRoute({
    getParentRoute: () => _auth,
    path: '/notes',
    loader: async ({location}) => {
        if (location.pathname === '/notes') {
            try {
                const projects = await getProjectList();
                const lastOpenProjectSlug = localStorage.getItem("lastOpenProjectSlug");
                const found = projects.find(p => p.slug === lastOpenProjectSlug)

                if (found) {
                    return redirect({to: '/notes/$slug', params: {slug: lastOpenProjectSlug}});
                }

                if (projects.length > 0) {
                    return redirect({to: '/notes/$slug', params: {slug: projects[0].slug}})
                }

                return {initialProjects: projects};
            } catch (err) {
                return {initialProjects: []};
            }
        }
        return {initialProjects: []};
    },
    component: NotesBasePage
})

const notesEditor = createRoute({
    getParentRoute: () => notes,
    path: '/$slug',
    component: OpenNotesPage
})

const routeTree = __root.addChildren([
    login,
    _auth.addChildren([
        index,
        notes.addChildren([
            notesEditor
        ])
    ]),
])

export {routeTree}