// Esta línea sirve para importar el hook «useEffect» de React.
import { useEffect } from "react"
// Esta línea sirve para importar los componentes de enrutamiento de React Router.
import { Navigate, Route, Routes } from "react-router-dom"
// Esta línea sirve para importar las utilidades de tema.
import { applyThemeToDocument, useThemeStore } from "@/lib/theme-store"
// Esta línea sirve para importar el guardia de ruta «RequireAuth».
import { RequireAuth } from "@/components/RequireAuth"
// Esta línea sirve para importar el guardia de ruta «RequireTrainer».
import { RequireTrainer } from "@/components/RequireTrainer"
// Esta línea sirve para importar el guardia de ruta «RequireAdmin».
import { RequireAdmin } from "@/components/RequireAdmin"
// Esta línea sirve para importar el componente «AppShell».
import { AppShell } from "@/components/layout/AppShell"
// Esta línea sirve para importar la página «LoginPage».
import { LoginPage } from "@/pages/LoginPage"
// Esta línea sirve para importar la página «RegisterPage».
import { RegisterPage } from "@/pages/RegisterPage"
// Esta línea sirve para importar la página «LoginVerifyPage».
import { LoginVerifyPage } from "@/pages/LoginVerifyPage"
// Esta línea sirve para importar la página «ForgotPasswordPage».
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
// Esta línea sirve para importar la página «ResetPasswordPage».
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
// Esta línea sirve para importar la página «OnboardingPage».
import { OnboardingPage } from "@/pages/OnboardingPage"
// Esta línea sirve para importar la página «LocationSurveyPage».
import { LocationSurveyPage } from "@/pages/LocationSurveyPage"
// Esta línea sirve para importar la página «DashboardPage».
import { DashboardPage } from "@/pages/DashboardPage"
// Esta línea sirve para importar la página «ProgressPage».
import { ProgressPage } from "@/pages/ProgressPage"
// Esta línea sirve para importar la página «SettingsPage».
import { SettingsPage } from "@/pages/SettingsPage"
// Esta línea sirve para importar la página «PersonalRecordsPage».
import { PersonalRecordsPage } from "@/pages/PersonalRecordsPage"
// Esta línea sirve para importar la página «ChallengesPage».
import { ChallengesPage } from "@/pages/ChallengesPage"
// Esta línea sirve para importar la página «CalendarPage».
import { CalendarPage } from "@/pages/CalendarPage"
// Esta línea sirve para importar la página «TrainerClientsPage».
import { TrainerClientsPage } from "@/pages/TrainerClientsPage"
// Esta línea sirve para importar la página «TrainerClientDetailPage».
import { TrainerClientDetailPage } from "@/pages/TrainerClientDetailPage"
// Esta línea sirve para importar la página «RoutineEditorPage».
import { RoutineEditorPage } from "@/pages/RoutineEditorPage"
// Esta línea sirve para importar la página «WorkoutPrecheckPage».
import { WorkoutPrecheckPage } from "@/pages/WorkoutPrecheckPage"
// Esta línea sirve para importar la página «WorkoutSessionPage».
import { WorkoutSessionPage } from "@/pages/WorkoutSessionPage"
// Esta línea sirve para importar la página «MyTrainerPage».
import { MyTrainerPage } from "@/pages/MyTrainerPage"
// Esta línea sirve para importar la página «ChatInboxPage».
import { ChatInboxPage } from "@/pages/ChatInboxPage"
// Esta línea sirve para importar la página «ChatThreadPage».
import { ChatThreadPage } from "@/pages/ChatThreadPage"
// Esta línea sirve para importar la página «NutritionPage».
import { NutritionPage } from "@/pages/NutritionPage"
// Esta línea sirve para importar la página «FeedPage».
import { FeedPage } from "@/pages/FeedPage"
// Esta línea sirve para importar la página «AdminAnalyticsPage».
import { AdminAnalyticsPage } from "@/pages/AdminAnalyticsPage"
// Esta línea sirve para importar la página «AdminPage».
import { AdminPage } from "@/pages/AdminPage"
// Esta línea sirve para importar la página «AdminUsersPage».
import { AdminUsersPage } from "@/pages/AdminUsersPage"
// Esta línea sirve para importar la página «AdminUserDetailPage».
import { AdminUserDetailPage } from "@/pages/AdminUserDetailPage"
// Esta línea sirve para importar la página «AdminExercisesPage».
import { AdminExercisesPage } from "@/pages/AdminExercisesPage"
// Esta línea sirve para importar la página «AdminRoutineTemplatesPage».
import { AdminRoutineTemplatesPage } from "@/pages/AdminRoutineTemplatesPage"
// Esta línea sirve para importar la página «AdminChallengeTemplatesPage».
import { AdminChallengeTemplatesPage } from "@/pages/AdminChallengeTemplatesPage"
// Esta línea sirve para importar la página «AdminPrSubmissionsPage».
import { AdminPrSubmissionsPage } from "@/pages/AdminPrSubmissionsPage"
// Esta línea sirve para importar la página «AdminReportsPage».
import { AdminReportsPage } from "@/pages/AdminReportsPage"
// Esta línea sirve para importar la página «AdminNewsPage».
import { AdminNewsPage } from "@/pages/AdminNewsPage"
// Esta línea sirve para importar la página «AdminStatsPage».
import { AdminStatsPage } from "@/pages/AdminStatsPage"
// Esta línea sirve para importar la página «AdminAuditLogPage».
import { AdminAuditLogPage } from "@/pages/AdminAuditLogPage"
// Esta línea sirve para importar la página «AdminProductsPage».
import { AdminProductsPage } from "@/pages/AdminProductsPage"
// Esta línea sirve para importar la página «AdminOrdersPage».
import { AdminOrdersPage } from "@/pages/AdminOrdersPage"
// Esta línea sirve para importar la página «AdminOrderDetailPage».
import { AdminOrderDetailPage } from "@/pages/AdminOrderDetailPage"
// Esta línea sirve para importar la página «StorePage».
import { StorePage } from "@/pages/StorePage"
// Esta línea sirve para importar la página «ProductDetailPage».
import { ProductDetailPage } from "@/pages/ProductDetailPage"
// Esta línea sirve para importar la página «CartPage».
import { CartPage } from "@/pages/CartPage"
// Esta línea sirve para importar la página «CheckoutPage».
import { CheckoutPage } from "@/pages/CheckoutPage"
// Esta línea sirve para importar la página «OrderConfirmationPage».
import { OrderConfirmationPage } from "@/pages/OrderConfirmationPage"
// Esta línea sirve para importar la página «MyOrdersPage».
import { MyOrdersPage } from "@/pages/MyOrdersPage"
// Esta línea sirve para importar la página «MyOrderDetailPage».
import { MyOrderDetailPage } from "@/pages/MyOrderDetailPage"
// Esta línea sirve para importar la página «LegalDocumentPage».
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"
// Esta línea sirve para importar la página «SupportPage».
import { SupportPage } from "@/pages/SupportPage"
// Esta línea sirve para importar la página «SupportTicketPage».
import { SupportTicketPage } from "@/pages/SupportTicketPage"
// Esta línea sirve para importar la página «WeeklyCheckinPage».
import { WeeklyCheckinPage } from "@/pages/WeeklyCheckinPage"
// Esta línea sirve para importar la página «AdminSupportPage».
import { AdminSupportPage } from "@/pages/AdminSupportPage"
// Esta línea sirve para importar la página «AdminSupportTicketPage».
import { AdminSupportTicketPage } from "@/pages/AdminSupportTicketPage"
// Esta línea sirve para importar el componente «CookieBanner».
import { CookieBanner } from "@/components/legal/CookieBanner"
// Esta línea sirve para importar el componente «CookieSettingsDialog».
import { CookieSettingsDialog } from "@/components/legal/CookieSettingsDialog"
// Esta línea sirve para importar las rutas de los documentos legales.
import { LEGAL_PATHS } from "@/lib/legal-paths"

// Esta línea sirve para declarar el componente raíz de la aplicación.
function App() {
  // Esta línea sirve para leer el modo de tema guardado en el store.
  const mode = useThemeStore((s) => s.mode)

  // Esta línea sirve para declarar el efecto que aplica el tema.
  useEffect(() => {
    // Esta línea sirve para aplicar el tema actual al documento.
    applyThemeToDocument(mode)

    // En modo 'system', si el usuario cambia la preferencia del SO mientras
    // la app está abierta (sin recargar), esto la sigue en vivo -- el
    // script inline de index.html solo cubre la carga inicial.
    // Esta línea sirve para salir si el modo no es «system» o el navegador no soporta matchMedia.
    if (mode !== "system" || !window.matchMedia) return
    // Esta línea sirve para crear la consulta del esquema de color oscuro del sistema.
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    // Esta línea sirve para declarar el manejador que reaplica el tema del sistema.
    const onChange = () => applyThemeToDocument("system")
    // Esta línea sirve para escuchar los cambios de preferencia de color del sistema.
    media.addEventListener("change", onChange)
    // Esta línea sirve para devolver la función que deja de escuchar al desmontar.
    return () => media.removeEventListener("change", onChange)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el modo.
  }, [mode])

  // Esta línea sirve para devolver el árbol de la interfaz.
  return (
    // Esta línea sirve para abrir un fragmento para agrupar rutas y componentes globales.
    <>
    {/* Esta línea sirve para abrir el contenedor de rutas. */}
    <Routes>
      {/* Documentos legales: públicos, accesibles con o sin sesión. */}
      {/* Esta línea sirve para declarar la ruta pública del documento legal «terms». */}
      <Route path={LEGAL_PATHS.terms} element={<LegalDocumentPage documentId="terms" />} />
      {/* Esta línea sirve para declarar la ruta pública del documento legal «privacy». */}
      <Route path={LEGAL_PATHS.privacy} element={<LegalDocumentPage documentId="privacy" />} />
      {/* Esta línea sirve para declarar la ruta pública del documento legal «cookies». */}
      <Route path={LEGAL_PATHS.cookies} element={<LegalDocumentPage documentId="cookies" />} />
      {/* Esta línea sirve para declarar la ruta «/login» que muestra «LoginPage». */}
      <Route path="/login" element={<LoginPage />} />
      {/* Esta línea sirve para declarar la ruta «/register» que muestra «RegisterPage». */}
      <Route path="/register" element={<RegisterPage />} />
      {/* Esta línea sirve para declarar la ruta «/login/verify» que muestra «LoginVerifyPage». */}
      <Route path="/login/verify" element={<LoginVerifyPage />} />
      {/* Esta línea sirve para declarar la ruta «/forgot-password» que muestra «ForgotPasswordPage». */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Esta línea sirve para declarar la ruta «/reset-password» que muestra «ResetPasswordPage». */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
      <Route
        // Esta línea sirve para indicar la ruta «/onboarding».
        path="/onboarding"
        // Esta línea sirve para indicar el elemento que se muestra en la ruta.
        element={
          // Esta línea sirve para proteger la ruta con el guardia «RequireAuth».
          <RequireAuth>
            {/* Esta línea sirve para mostrar la página «OnboardingPage». */}
            <OnboardingPage />
          </RequireAuth>
        }
      />
      {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
      <Route
        // Esta línea sirve para indicar la ruta «/ubicacion».
        path="/ubicacion"
        // Esta línea sirve para indicar el elemento que se muestra en la ruta.
        element={
          // Esta línea sirve para proteger la ruta con el guardia «RequireAuth».
          <RequireAuth>
            {/* Esta línea sirve para mostrar la página «LocationSurveyPage». */}
            <LocationSurveyPage />
          </RequireAuth>
        }
      />

      {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
      <Route
        // Esta línea sirve para indicar el elemento que se muestra en la ruta.
        element={
          // Esta línea sirve para proteger la ruta con el guardia «RequireAuth».
          <RequireAuth>
            {/* Esta línea sirve para mostrar el diseño general con barra de navegación. */}
            <AppShell />
          </RequireAuth>
        }
      >
        {/* Esta línea sirve para declarar la ruta «/dashboard» que muestra «DashboardPage». */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Esta línea sirve para declarar la ruta «/progress» que muestra «ProgressPage». */}
        <Route path="/progress" element={<ProgressPage />} />
        {/* Esta línea sirve para declarar la ruta «/settings» que muestra «SettingsPage». */}
        <Route path="/settings" element={<SettingsPage />} />
        {/* Esta línea sirve para declarar la ruta «/prs» que muestra «PersonalRecordsPage». */}
        <Route path="/prs" element={<PersonalRecordsPage />} />
        {/* Esta línea sirve para declarar la ruta «/challenges» que muestra «ChallengesPage». */}
        <Route path="/challenges" element={<ChallengesPage />} />
        {/* Esta línea sirve para declarar la ruta «/calendar» que muestra «CalendarPage». */}
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Esta línea sirve para declarar la ruta «/my-trainer» que muestra «MyTrainerPage». */}
        <Route path="/my-trainer" element={<MyTrainerPage />} />
        {/* Esta línea sirve para declarar la ruta «/chat» que muestra «ChatInboxPage». */}
        <Route path="/chat" element={<ChatInboxPage />} />
        {/* Esta línea sirve para declarar la ruta «/chat/:conversationId» que muestra «ChatThreadPage». */}
        <Route path="/chat/:conversationId" element={<ChatThreadPage />} />
        {/* Esta línea sirve para declarar la ruta «/nutrition» que muestra «NutritionPage». */}
        <Route path="/nutrition" element={<NutritionPage />} />
        {/* Esta línea sirve para declarar la ruta «/workout/precheck» que muestra «WorkoutPrecheckPage». */}
        <Route path="/workout/precheck" element={<WorkoutPrecheckPage />} />
        {/* Esta línea sirve para declarar la ruta «/workout/session/:sessionId» que muestra «WorkoutSessionPage». */}
        <Route path="/workout/session/:sessionId" element={<WorkoutSessionPage />} />
        {/* Esta línea sirve para declarar la ruta «/feed» que muestra «FeedPage». */}
        <Route path="/feed" element={<FeedPage />} />

        {/* Esta línea sirve para declarar la ruta «/soporte» que muestra «SupportPage». */}
        <Route path="/soporte" element={<SupportPage />} />
        {/* Esta línea sirve para declarar la ruta «/soporte/check-in» que muestra «WeeklyCheckinPage». */}
        <Route path="/soporte/check-in" element={<WeeklyCheckinPage />} />
        {/* Esta línea sirve para declarar la ruta «/soporte/:ticketId» que muestra «SupportTicketPage». */}
        <Route path="/soporte/:ticketId" element={<SupportTicketPage />} />

        {/* Esta línea sirve para declarar la ruta «/store» que muestra «StorePage». */}
        <Route path="/store" element={<StorePage />} />
        {/* Esta línea sirve para declarar la ruta «/store/cart» que muestra «CartPage». */}
        <Route path="/store/cart" element={<CartPage />} />
        {/* Esta línea sirve para declarar la ruta «/store/checkout» que muestra «CheckoutPage». */}
        <Route path="/store/checkout" element={<CheckoutPage />} />
        {/* Esta línea sirve para declarar la ruta «/store/confirmation/:orderId» que muestra «OrderConfirmationPage». */}
        <Route path="/store/confirmation/:orderId" element={<OrderConfirmationPage />} />
        {/* Esta línea sirve para declarar la ruta «/store/:productId» que muestra «ProductDetailPage». */}
        <Route path="/store/:productId" element={<ProductDetailPage />} />

        {/* Esta línea sirve para declarar la ruta «/pedidos» que muestra «MyOrdersPage». */}
        <Route path="/pedidos" element={<MyOrdersPage />} />
        {/* Esta línea sirve para declarar la ruta «/pedidos/:orderId» que muestra «MyOrderDetailPage». */}
        <Route path="/pedidos/:orderId" element={<MyOrderDetailPage />} />

        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/trainer».
          path="/trainer"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireTrainer».
            <RequireTrainer>
              {/* Esta línea sirve para mostrar la página «TrainerClientsPage». */}
              <TrainerClientsPage />
            </RequireTrainer>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/trainer/clients/:trainerClientId».
          path="/trainer/clients/:trainerClientId"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireTrainer».
            <RequireTrainer>
              {/* Esta línea sirve para mostrar la página «TrainerClientDetailPage». */}
              <TrainerClientDetailPage />
            </RequireTrainer>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/trainer/clients/:trainerClientId/routine/new».
          path="/trainer/clients/:trainerClientId/routine/new"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireTrainer».
            <RequireTrainer>
              {/* Esta línea sirve para mostrar la página «RoutineEditorPage». */}
              <RoutineEditorPage />
            </RequireTrainer>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/trainer/routines/:routineId/edit».
          path="/trainer/routines/:routineId/edit"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireTrainer».
            <RequireTrainer>
              {/* Esta línea sirve para mostrar la página «RoutineEditorPage». */}
              <RoutineEditorPage />
            </RequireTrainer>
          }
        />

        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin».
          path="/admin"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminPage». */}
              <AdminPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/analytics».
          path="/admin/analytics"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminAnalyticsPage». */}
              <AdminAnalyticsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/users».
          path="/admin/users"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminUsersPage». */}
              <AdminUsersPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/users/:userId».
          path="/admin/users/:userId"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminUserDetailPage». */}
              <AdminUserDetailPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/exercises».
          path="/admin/exercises"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminExercisesPage». */}
              <AdminExercisesPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/routine-templates».
          path="/admin/routine-templates"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminRoutineTemplatesPage». */}
              <AdminRoutineTemplatesPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/users/:userId/routine/new».
          path="/admin/users/:userId/routine/new"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «RoutineEditorPage». */}
              <RoutineEditorPage scope="admin" />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/users/:userId/routine/edit».
          path="/admin/users/:userId/routine/edit"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «RoutineEditorPage». */}
              <RoutineEditorPage scope="admin" />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/soporte».
          path="/admin/soporte"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminSupportPage». */}
              <AdminSupportPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/soporte/:ticketId».
          path="/admin/soporte/:ticketId"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminSupportTicketPage». */}
              <AdminSupportTicketPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/reports».
          path="/admin/reports"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminReportsPage». */}
              <AdminReportsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/pr-submissions».
          path="/admin/pr-submissions"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminPrSubmissionsPage». */}
              <AdminPrSubmissionsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/challenge-templates».
          path="/admin/challenge-templates"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminChallengeTemplatesPage». */}
              <AdminChallengeTemplatesPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/news».
          path="/admin/news"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminNewsPage». */}
              <AdminNewsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/stats».
          path="/admin/stats"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminStatsPage». */}
              <AdminStatsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/audit-logs».
          path="/admin/audit-logs"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminAuditLogPage». */}
              <AdminAuditLogPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/products».
          path="/admin/products"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminProductsPage». */}
              <AdminProductsPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/orders».
          path="/admin/orders"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminOrdersPage». */}
              <AdminOrdersPage />
            </RequireAdmin>
          }
        />
        {/* Esta línea sirve para declarar una ruta con sus propiedades en varias líneas. */}
        <Route
          // Esta línea sirve para indicar la ruta «/admin/orders/:orderId».
          path="/admin/orders/:orderId"
          // Esta línea sirve para indicar el elemento que se muestra en la ruta.
          element={
            // Esta línea sirve para proteger la ruta con el guardia «RequireAdmin».
            <RequireAdmin>
              {/* Esta línea sirve para mostrar la página «AdminOrderDetailPage». */}
              <AdminOrderDetailPage />
            </RequireAdmin>
          }
        />
      </Route>

      {/* Esta línea sirve para declarar la ruta comodín que redirige al dashboard. */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    {/* Aviso y panel de cookies: globales, en cualquier ruta (incluidas login y las páginas legales). */}
    {/* Esta línea sirve para mostrar la página «CookieBanner». */}
    <CookieBanner />
    {/* Esta línea sirve para mostrar la página «CookieSettingsDialog». */}
    <CookieSettingsDialog />
    </>
  )
}

// Esta línea sirve para exportar el componente App como valor por defecto.
export default App
