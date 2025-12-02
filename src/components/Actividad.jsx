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

  React.useEffect(() => {
    const onChange = () => setItemState(getLatestItem());
    window.addEventListener('curso_data_changed', onChange);
    window.addEventListener('storage', onChange);
    return () => { 
      window.removeEventListener('curso_data_changed', onChange);
      window.removeEventListener('storage', onChange); 
    };
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
    window.dispatchEvent(new CustomEvent('curso_data_changed'));
    setItemState(prev => ({ 
      ...prev, 
      submitted: true, 
      submittedAt: new Date().toISOString(), 
      status: 'Entregada' 
    }));
  };


  // ---------------------------------------------------------------
  // ------------- 🟦 SISTEMA DE COMENTARIOS DEL FORO 🟦 -------------
  // ---------------------------------------------------------------

  const commentsKey = `foro_${cursoId}_${aid}_comments`;
  const [comments, setComments] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(commentsKey)) || [];
    } catch {
      return [];
    }
  });

  const [showCommentBox, setShowCommentBox] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");

  const saveComments = (list) => {
    localStorage.setItem(commentsKey, JSON.stringify(list));
  };

  const handlePublishComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      author: "Yo (Estudiante)",
      createdAt: new Date().toISOString()
    };

    const updated = [...comments, newComment];
    setComments(updated);
    saveComments(updated);
    setCommentText("");
    setShowCommentBox(false);
  };


  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
      {item.type && <div className="text-sm text-gray-500 mb-2">Tipo: {item.type}</div>}
      {item.status && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 
          bg-blue-100 text-blue-800">
          {item.status}
        </div>
      )}

      {item.description && (
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
      )}

      {(item.from || item.to) && (
        <div className="mb-4 text-sm text-gray-500">
          {item.from ? new Date(item.from).toLocaleString() : ""}
          {item.from && item.to ? " - " : ""}
          {item.to ? new Date(item.to).toLocaleString() : ""}
        </div>
      )}

      {/* -------------------- ENTREGA DE TAREA -------------------- */}
      {item.type === "task" && role === "Alumno" && !item.submitted && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-[#232f50] mb-2">Entrega tu tarea</h3>

          <p className="text-gray-700 mb-4">
            Puedes mandar tu tarea mediante un texto, video o archivo adjuntado.
          </p>

          <div className="mb-4">
            <label className="block font-medium mb-2">Adjuntar un archivo</label>
            <input type="file" className="border p-2 rounded w-full" />
          </div>

          <p className="text-sm text-gray-600">
            Archivos permitidos: PDF, Word, Imágenes, Videos, Audios, PPT
          </p>
        </div>
      )}

      {/* ---------------------- FORO ---------------------- */}
      {item.type === "forum" && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-[#232f50] mb-4">Comentarios del Foro</h3>

          {/* Botón AGREGAR COMENTARIO */}
          {!showCommentBox && (
            <button
              onClick={() => setShowCommentBox(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
            >
              Agregar Comentario
            </button>
          )}

          {/* Caja de comentario */}
          {showCommentBox && (
            <div className="p-4 border rounded-lg bg-gray-50 mb-4">
              <textarea
                className="w-full border rounded p-2 h-28"
                placeholder="Escribe tu comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setShowCommentBox(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancelar
                </button>

                <button
                  onClick={handlePublishComment}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Publicar comentario
                </button>
              </div>
            </div>
          )}

          {/* Lista de comentarios */}
          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-gray-500">Aún no hay comentarios.</p>
            )}

            {comments.map((c) => (
              <div key={c.id} className="p-3 border rounded-lg bg-white">
                <div className="text-sm font-semibold">{c.author}</div>
                <div className="text-gray-700">{c.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTONES FINALES */}
      <div className="mt-6 flex items-center gap-4">
        <Link to={`/curso/${cursoId}`} className="text-blue-600">Volver al curso</Link>

        {item.type === "task" && role === "Alumno" && !item.submitted && (
          <button
            onClick={handleSubmitTask}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Marcar como entregado
          </button>
        )}
      </div>
    </div>
  );
}
