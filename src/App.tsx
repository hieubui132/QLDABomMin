import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "@/routes/allRoutes";
import DefaultLayout from "@/layouts/DefaultLayout";
import NonAuthLayout from "@/layouts/NonAuthLayout";

function App() {
  return (
    <Router>
      <Routes>
        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = route.layout ?? DefaultLayout;

          if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                // <AuthProtected>
                <Layout>
                  <Page />
                </Layout>
                // </AuthProtected>
              }
            />
          );
        })}

        {publicRoutes.map((route, idx) => {
          const Page = route.component;
          let Layout = route.layout ?? NonAuthLayout;

          if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
              key={idx}
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
