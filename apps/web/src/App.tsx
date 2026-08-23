import { Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "@/components/RequireAuth"
import { RequireTrainer } from "@/components/RequireTrainer"
import { RequireAdmin } from "@/components/RequireAdmin"
import { AppShell } from "@/components/layout/AppShell"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { LoginVerifyPage } from "@/pages/LoginVerifyPage"
import { OnboardingPage } from "@/pages/OnboardingPage"
import { LocationSurveyPage } from "@/pages/LocationSurveyPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProgressPage } from "@/pages/ProgressPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { PersonalRecordsPage } from "@/pages/PersonalRecordsPage"
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
import { FeedPage } from "@/pages/FeedPage"
import { AdminPage } from "@/pages/AdminPage"
import { AdminUsersPage } from "@/pages/AdminUsersPage"
import { AdminUserDetailPage } from "@/pages/AdminUserDetailPage"
import { AdminExercisesPage } from "@/pages/AdminExercisesPage"
import { AdminRoutineTemplatesPage } from "@/pages/AdminRoutineTemplatesPage"
import { AdminChallengeTemplatesPage } from "@/pages/AdminChallengeTemplatesPage"
import { AdminPrSubmissionsPage } from "@/pages/AdminPrSubmissionsPage"
import { AdminReportsPage } from "@/pages/AdminReportsPage"
import { AdminNewsPage } from "@/pages/AdminNewsPage"
import { AdminStatsPage } from "@/pages/AdminStatsPage"
import { AdminAuditLogPage } from "@/pages/AdminAuditLogPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/verify" element={<LoginVerifyPage />} />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/ubicacion"
        element={
          <RequireAuth>
            <LocationSurveyPage />
          </RequireAuth>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/prs" element={<PersonalRecordsPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/my-trainer" element={<MyTrainerPage />} />
        <Route path="/chat" element={<ChatInboxPage />} />
        <Route path="/chat/:conversationId" element={<ChatThreadPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/workout/precheck" element={<WorkoutPrecheckPage />} />
        <Route path="/workout/session/:sessionId" element={<WorkoutSessionPage />} />
        <Route path="/feed" element={<FeedPage />} />

        <Route
          path="/trainer"
          element={
            <RequireTrainer>
              <TrainerClientsPage />
            </RequireTrainer>
          }
        />
        <Route
          path="/trainer/clients/:trainerClientId"
          element={
            <RequireTrainer>
              <TrainerClientDetailPage />
            </RequireTrainer>
          }
        />
        <Route
          path="/trainer/clients/:trainerClientId/routine/new"
          element={
            <RequireTrainer>
              <RoutineEditorPage />
            </RequireTrainer>
          }
        />
        <Route
          path="/trainer/routines/:routineId/edit"
          element={
            <RequireTrainer>
              <RoutineEditorPage />
            </RequireTrainer>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsersPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <RequireAdmin>
              <AdminUserDetailPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/exercises"
          element={
            <RequireAdmin>
              <AdminExercisesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/routine-templates"
          element={
            <RequireAdmin>
              <AdminRoutineTemplatesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/:userId/routine/new"
          element={
            <RequireAdmin>
              <RoutineEditorPage scope="admin" />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/:userId/routine/edit"
          element={
            <RequireAdmin>
              <RoutineEditorPage scope="admin" />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RequireAdmin>
              <AdminReportsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/pr-submissions"
          element={
            <RequireAdmin>
              <AdminPrSubmissionsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/challenge-templates"
          element={
            <RequireAdmin>
              <AdminChallengeTemplatesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/news"
          element={
            <RequireAdmin>
              <AdminNewsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <RequireAdmin>
              <AdminStatsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <RequireAdmin>
              <AdminAuditLogPage />
            </RequireAdmin>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
