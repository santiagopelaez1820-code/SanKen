import { Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "@/components/RequireAuth"
import { RequireTrainer } from "@/components/RequireTrainer"
import { RequireAdmin } from "@/components/RequireAdmin"
import { LoginPage } from "@/pages/LoginPage"
import { LoginVerifyPage } from "@/pages/LoginVerifyPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { RankingsPage } from "@/pages/RankingsPage"
import { ChallengesPage } from "@/pages/ChallengesPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { TrainerClientsPage } from "@/pages/TrainerClientsPage"
import { TrainerClientDetailPage } from "@/pages/TrainerClientDetailPage"
import { RoutineEditorPage } from "@/pages/RoutineEditorPage"
import { WorkoutPrecheckPage } from "@/pages/WorkoutPrecheckPage"
import { WorkoutSessionPage } from "@/pages/WorkoutSessionPage"
import { MyTrainerPage } from "@/pages/MyTrainerPage"
import { ChatInboxPage } from "@/pages/ChatInboxPage"
import { ChatThreadPage } from "@/pages/ChatThreadPage"
import { NutritionPage } from "@/pages/NutritionPage"
import { NewsPage } from "@/pages/NewsPage"
import { AdminPage } from "@/pages/AdminPage"
import { AdminUsersPage } from "@/pages/AdminUsersPage"
import { AdminExercisesPage } from "@/pages/AdminExercisesPage"
import { AdminReportsPage } from "@/pages/AdminReportsPage"
import { AdminNewsPage } from "@/pages/AdminNewsPage"
import { AdminStatsPage } from "@/pages/AdminStatsPage"
import { AdminAuditLogPage } from "@/pages/AdminAuditLogPage"

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
        path="/rankings"
        element={
          <RequireAuth>
            <RankingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/challenges"
        element={
          <RequireAuth>
            <ChallengesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/calendar"
        element={
          <RequireAuth>
            <CalendarPage />
          </RequireAuth>
        }
      />
      <Route
        path="/my-trainer"
        element={
          <RequireAuth>
            <MyTrainerPage />
          </RequireAuth>
        }
      />
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <ChatInboxPage />
          </RequireAuth>
        }
      />
      <Route
        path="/chat/:conversationId"
        element={
          <RequireAuth>
            <ChatThreadPage />
          </RequireAuth>
        }
      />
      <Route
        path="/nutrition"
        element={
          <RequireAuth>
            <NutritionPage />
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
      <Route
        path="/news"
        element={
          <RequireAuth>
            <NewsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminUsersPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/exercises"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminExercisesPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminReportsPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/news"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminNewsPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminStatsPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminAuditLogPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
