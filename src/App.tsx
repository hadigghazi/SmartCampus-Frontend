import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import PublicRoute from './components/ProtectedRoutes/PublicRoute';
import AuthCheckComponent from './components/AuthCheckComponent';
import PaymentRoute from './components/ProtectedRoutes/PaymentRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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

            if (route.path === '/registrations' || route.path === '/registrations/:id' || route.path === '/registrations-cart') {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PaymentRoute>
                      <Layout>
                        <Element />
                      </Layout>
                    </PaymentRoute>
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
