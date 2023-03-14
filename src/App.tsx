import "./App.css";
import { NavbarRouter } from "./components/NavbarRouter";
import { useApp } from "./providers/AppProvider";

import Dashboard from "./pages/Dashboard";
import DataManagement from "./pages/DataManagement";
import Login from "./pages/Login";

import { RouteType } from "./types";

function App(): JSX.Element {
  const app = useApp();

  const routes: RouteType[] = [
    {
      title: "Dashboard",
      path: "dashboard",
      element: <Dashboard tests={app.tests || []} />,
    },
    { title: "Manage Data", path: "data", element: <DataManagement /> },
  ];

  if (!app.user) {
    return <Login />;
  }

  return (
    <div className="absolute inset-0 max-h-screen">
      <NavbarRouter navItems={routes} />
    </div>
  );
}

export default App;
