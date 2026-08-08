import { Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "@/components/RequireAuth"
import { RequireTrainer } from "@/components/RequireTrainer"
import { LoginPage } from "@/pages/LoginPage"
import { LoginVerifyPage } from "@/pages/LoginVerifyPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { TrainerClientsPage } from "@/pages/TrainerClientsPage"
import { TrainerClientDetailPage } from "@/pages/TrainerClientDetailPage"
import { RoutineEditorPage } from "@/pages/RoutineEditorPage"
import { WorkoutPrecheckPage } from "@/pages/WorkoutPrecheckPage"
import { WorkoutSessionPage } from "@/pages/WorkoutSessionPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/verify" element={<LoginVerifyPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/workout/precheck"
        element={
          <RequireAuth>
            <WorkoutPrecheckPage />
          </RequireAuth>
        }
      />
      <Route
        path="/workout/session/:sessionId"
        element={
          <RequireAuth>
            <WorkoutSessionPage />
          </RequireAuth>
        }
      />
      <Route
        path="/trainer"
        element={
          <RequireAuth>
            <RequireTrainer>
              <TrainerClientsPage />
            </RequireTrainer>
          </RequireAuth>
        }
      />
      <Route
        path="/trainer/clients/:trainerClientId"
        element={
          <RequireAuth>
            <RequireTrainer>
              <TrainerClientDetailPage />
            </RequireTrainer>
          </RequireAuth>
        }
      />
      <Route
        path="/trainer/clients/:trainerClientId/routine/new"
        element={
          <RequireAuth>
            <RequireTrainer>
              <RoutineEditorPage />
            </RequireTrainer>
          </RequireAuth>
        }
      />
      <Route
        path="/trainer/routines/:routineId/edit"
        element={
          <RequireAuth>
            <RequireTrainer>
              <RoutineEditorPage />
            </RequireTrainer>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
