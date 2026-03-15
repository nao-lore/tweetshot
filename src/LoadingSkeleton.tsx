export function LoadingSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-avatar skeleton-pulse" />
        <div className="skeleton-author-lines">
          <div className="skeleton-line skeleton-pulse" style={{ width: '120px' }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: '80px', height: '10px' }} />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-pulse" style={{ width: '100%' }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: '90%' }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: '60%' }} />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-line skeleton-pulse" style={{ width: '100px', height: '10px' }} />
      </div>
    </div>
  );
}
