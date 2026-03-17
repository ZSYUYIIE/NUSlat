import Dashboard from "@/components/Dashboard";

// No auth guard — guests can access the dashboard.
// The Dashboard component handles auth state via useMilestones hook:
//   - Authenticated: syncs with MongoDB via /api/milestones
//   - Guest: syncs with localStorage (key: nuslat_guest_progress)
export default function DashboardPage() {
  return <Dashboard />;
}
