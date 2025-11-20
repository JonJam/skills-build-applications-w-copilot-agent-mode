import React, { useEffect, useState } from 'react';

function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const endpoint = codespace ? `https://${codespace}-8000.app.github.dev/api/activities/` : 'http://localhost:8000/api/activities/';
    console.log('[Activities] endpoint:', endpoint);

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log('[Activities] fetched data:', data);
        const list = Array.isArray(data) ? data : (data.results ? data.results : []);
        setItems(list);
      })
      .catch((err) => console.error('[Activities] fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderJsonSnippet = (obj) => {
    try {
      const txt = JSON.stringify(obj);
      return txt.length > 120 ? txt.slice(0, 120) + '…' : txt;
    } catch (e) {
      return String(obj);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        <h3 className="mb-0 me-auto">Activities</h3>
        <button className="btn btn-primary btn-sm" onClick={fetchData} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name / Title</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{it.id || '-'}</td>
                  <td>{it.name || it.title || `Activity ${idx + 1}`}</td>
                  <td><small className="text-muted">{renderJsonSnippet(it)}</small></td>
                  <td>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => { console.log('[Activities] view', it); setSelected(it); }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal fade show" style={{display:'block'}} aria-modal="true" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(selected, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}

export default Activities;
