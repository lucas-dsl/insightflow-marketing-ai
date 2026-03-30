import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "@/app/AppStateContext";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { InsightsPage } from "@/pages/InsightsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { TrendsPage } from "@/pages/TrendsPage";
import { UploadPage } from "@/pages/UploadPage";

const App = () => (
  <BrowserRouter>
    <AppStateProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </AppStateProvider>
  </BrowserRouter>
);

export default App;
