interface InstagramAnalytics {
  // ... existing fields ...
  changes?: {
    postsGrowth: number;
    followersGrowth: number;
    followingGrowth: number;
  } | null;
}

// In your component:
{/* Growth Stats */}
{data.changes && (
  <Card className="bg-gray-900/60 border border-gray-800">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-4">30 Day Growth</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            data.changes.postsGrowth >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.changes.postsGrowth > 0 ? '+' : ''}{data.changes.postsGrowth}
          </div>
          <div className="text-gray-300">New Posts</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            data.changes.followersGrowth >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.changes.followersGrowth > 0 ? '+' : ''}{data.changes.followersGrowth}
          </div>
          <div className="text-gray-300">Followers Growth</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            data.changes.followingGrowth >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.changes.followingGrowth > 0 ? '+' : ''}{data.changes.followingGrowth}
          </div>
          <div className="text-gray-300">Following Growth</div>
        </div>
      </div>
    </div>
  </Card>
)} 