export default function RosterPage() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Roster</h1>
      <p className="text-gray-500 text-sm mb-8">Your players will appear here.</p>
      <div className="text-center text-gray-400 mt-20">
        <div className="text-4xl mb-3">👥</div>
        <p className="text-sm">No players yet. Add them from a session.</p>
      </div>
    </div>
  );
}
