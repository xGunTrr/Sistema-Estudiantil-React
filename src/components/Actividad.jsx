import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Actividad({ role }){
  const { id, aid } = useParams();
  const cursoId = Number(id);
  const storageKey = `curso_${cursoId}_data`;

  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }, [storageKey]);

  // Get latest item directly from localStorage (used to refresh after deletions/updates)
  const getLatestItem = React.useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      for (const w of parsed.tasks || []) {
        const found = w.tasks?.find(t => t.id === aid);
        if (found) return { ...found, type: 'task' };
      }
      for (const w of parsed.forums || []) {
        const found = w.forums?.find(f => f.id === aid);
        if (found) return { ...found, type: 'forum' };
      }
      for (const w of parsed.materials || []) {
        const found = w.materials?.find(m => m.id === aid);
        if (found) return { ...found, type: 'material' };
      }
    } catch {
      return null;
    }
    return null;
  }, [storageKey, aid]);

  const [itemState, setItemState] = React.useState(() => getLatestItem());
  const item = itemState;

  // Refresh item when curso data changes or storage events occur (deletion from another view)
  React.useEffect(() => {
    const onChange = () => setItemState(getLatestItem());
    window.addEventListener('curso_data_changed', onChange);
    window.addEventListener('storage', onChange);
    return () => { window.removeEventListener('curso_data_changed', onChange); window.removeEventListener('storage', onChange); };
  }, [storageKey, getLatestItem]);

  if (!item) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Actividad no encontrada</h2>
        <Link to={`/curso/${cursoId}`} className="text-blue-600">Volver al curso</Link>
      </div>
    );
  }

  const saveStorage = (newData) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newData));
    } catch (e) {
      console.warn('Failed to save', e);
    }
  };

  const handleSubmitTask = () => {
    if (!data) return;
    // Find and update in tasks
    const newData = JSON.parse(JSON.stringify(data));
    for (const w of newData.tasks || []) {
      const found = w.tasks?.find(t => t.id === aid);
      if (found) {
        found.submitted = true;
        found.submittedAt = new Date().toISOString();
        break;
      }
    }
    saveStorage(newData);
    // Notify other components in the same tab to reload data for this course
    try {
      window.dispatchEvent(new CustomEvent('curso_data_changed', { detail: { courseId: cursoId } }));
    } catch (err) { console.warn('couldnt dispatch', err); }
    setItemState(prev => ({ ...prev, submitted: true, submittedAt: new Date().toISOString(), status: 'Entregada' }));
  };

  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
      {item.type && <div className="text-sm text-gray-500 mb-2">Tipo: {item.type}</div>}
      {item.status && <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${{
        'Por entregar': 'bg-yellow-100 text-yellow-800',
        'Entregada': 'bg-green-100 text-green-800',
        'Vencida': 'bg-gray-100 text-gray-600',
        'Programada': 'bg-blue-100 text-blue-800'
      }[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status}</div>}
      {item.description && <p className="text-sm text-gray-600 mb-4">{item.description}</p>}
      {(item.from || item.to) && (
        <div className="mb-4 text-sm text-gray-500">{item.from ? new Date(item.from).toLocaleString() : ''}{item.from && item.to ? ' - ' : ''}{item.to ? new Date(item.to).toLocaleString() : ''}</div>
      )}
      {item.submittedAt && <div className="text-sm text-gray-500 mb-2">Entregado: {new Date(item.submittedAt).toLocaleString()}</div>}
      <div className="mt-6 flex items-center gap-4">
        <Link to={`/curso/${cursoId}`} className="text-blue-600">Volver al curso</Link>
        {item.type === 'task' && role === 'Alumno' && !item.submitted && (
          <button onClick={handleSubmitTask} className="px-3 py-1 bg-green-600 text-white rounded">Marcar como entregado</button>
        )}
        {item.type === 'task' && item.submitted && (
          <div className="text-sm text-gray-500">Entregado: {new Date(item.submittedAt).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}
