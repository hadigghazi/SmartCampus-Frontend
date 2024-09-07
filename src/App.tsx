import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import PublicRoute from './components/ProtectedRoutes/PublicRoute';
import AuthCheckComponent from './components/AuthCheckComponent';
import Spinner from './components/Spinner/Spinner';

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <AuthCheckComponent />
        <Routes>
          {routes.map((route, index) => {
            const Element = route.component;
            const Layout = route.layout || React.Fragment;

            if (route.path === '/login') {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PublicRoute>
                      <Layout>
                        <Element />
                      </Layout>
                    </PublicRoute>
                  }
                />
              );
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Element />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
