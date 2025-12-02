// CursoDetalle (main canonical implementation)
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Modal({ title, children, onClose }){
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded shadow p-6 w-full max-w-lg">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-semibold">{title}</h3>
					<button onClick={onClose}>✕</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}

function WeekList({ items, render, title }){
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-white rounded shadow-sm overflow-hidden">
			<button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex justify-between items-center">
				{title}
				<span>{open ? <FaChevronUp/> : <FaChevronDown/>}</span>
			</button>
			{open && <div className="p-4 border-t space-y-3">{items.map(render)}</div>}
		</div>
	);
}

export default function CursoDetalle({ cursos = [], role }){
	const { id } = useParams();
	const location = useLocation();
	const curso = location.state?.curso || cursos.find(c => c.id === Number(id));

	// Call hooks unconditionally; use curso?.id safely
	const [tab, setTab] = useState('materiales');
	const [modalOpen, setModalOpen] = useState(false);
	const [modalType, setModalType] = useState(null);
	const [form, setForm] = useState({title:'', description:'', from:'', to:'', week:1});

	const courseId = curso?.id || null;
	const initialTasks = useMemo(() => {
		if (!courseId) return Array.from({ length: 18 }).map((_, i) => ({ week: i + 1, tasks: [] }));
		return Array.from({length:18}).map((_,i)=>({ week:i+1, tasks:[{ id:`C${courseId}-T-${i+1}`, title:`Semana ${i+1} - Tarea`, status:['Programada','Por entregar','Entregada','Vencida'][i%4], from:'Inicio', to:'Fin' }]}));
	},[courseId]);
	const initialForums = useMemo(() => {
		if (!courseId) return Array.from({ length: 18 }).map((_, i) => ({ week: i + 1, forums: [] }));
		return Array.from({length:18}).map((_,i)=>({ week:i+1, forums:[{ id:`C${courseId}-F-${i+1}`, title:`Foro Semana ${i+1}`, from:'Inicio', to:'Fin' }]}));
	}, [courseId]);
	const initialMaterials = useMemo(()=>Array.from({length:18}).map((_,i)=>({ week:i+1, materials:[] })),[]);

	// state will be initialized after computing storageKey

	// LocalStorage key for this course
	const storageKey = courseId ? `curso_${courseId}_data` : null;

	// Load from localStorage if present (merge with initial mock data)
	// initialize states from storage synchronously so no setState in effects needed
	const parsedStored = (() => {
		if (!storageKey) return null;
		try {
			const raw = localStorage.getItem(storageKey);
			if (!raw) return null;
			return JSON.parse(raw);
		} catch {
			return null;
		}
	})();
	const initialTasksFromStorage = parsedStored?.tasks || initialTasks;
	const initialForumsFromStorage = parsedStored?.forums || initialForums;
	const initialMaterialsFromStorage = parsedStored?.materials || initialMaterials;
	const [weeksWithTasks,setWeeksWithTasks]=useState(() => initialTasksFromStorage);
	const [weeksWithForums,setWeeksWithForums]=useState(() => initialForumsFromStorage);
	const [weeksWithMaterials,setWeeksWithMaterials]=useState(() => initialMaterialsFromStorage);

		// compute and update task statuses (standalone; not inside create handler)
		const computeStatusForTask = useCallback((t) => {
			try {
				const now = Date.now();
				const fromTs = t.from ? Date.parse(t.from) : null;
				const toTs = t.to ? Date.parse(t.to) : null;
				if (t.submitted) {
					// If submittedAt exists, we can check whether it was on time
					if (t.submittedAt) {
						const sTs = Date.parse(t.submittedAt);
						if (toTs && sTs > toTs) return 'Vencida';
					}
					return 'Entregada';
				}
				if (fromTs && now < fromTs) return 'Programada';
				if (toTs && now > toTs) return 'Vencida';
				return 'Por entregar';
			} catch {
				return t.status || 'Por entregar';
			}
		}, []);

		useEffect(() => {
			if (!courseId) return;
			const updateAllStatuses = () => {
				setWeeksWithTasks(prev => prev.map(w => ({ ...w, tasks: w.tasks.map(t => ({ ...t, status: computeStatusForTask(t) })) })));
			};
			// Update right away
			updateAllStatuses();
			// Schedule periodic updates
			const idInterval = setInterval(updateAllStatuses, 30_000);
			return () => clearInterval(idInterval);
		}, [courseId, computeStatusForTask]);

		// Listen for storage update events in the same tab and reload local state
		useEffect(() => {
			const handler = (e) => {
				if (!e?.detail?.courseId || e.detail.courseId !== courseId) return;
				try {
					const raw = localStorage.getItem(storageKey);
					if (!raw) return;
					const parsed = JSON.parse(raw);
					setWeeksWithTasks(parsed.tasks || initialTasks);
					setWeeksWithForums(parsed.forums || initialForums);
					setWeeksWithMaterials(parsed.materials || initialMaterials);
				} catch (err) { console.warn('Error reloading curso data', err); }
			};
			window.addEventListener('curso_data_changed', handler);
			return () => window.removeEventListener('curso_data_changed', handler);
		}, [courseId, storageKey, initialTasks, initialForums, initialMaterials]);

	// Save any changes to localStorage so Docente changes are visible to Alumno
	// (no-op) Saving is handled by the persistent effect below; remove explicit call

	// We persist changes automatically whenever weeks change
	useEffect(() => {
		if (!storageKey) return;
		const data = { tasks: weeksWithTasks, forums: weeksWithForums, materials: weeksWithMaterials };
		try {
			localStorage.setItem(storageKey, JSON.stringify(data));
		} catch {
			console.warn('Failed to save curso data to localStorage');
		}
	}, [storageKey, weeksWithTasks, weeksWithForums, weeksWithMaterials]);

	const openModal=(t)=>{setModalType(t); setModalOpen(true); setForm({title:'', description:'', from:'', to:'', week:1});};
	const closeModal = () => setModalOpen(false);
    const [flash, setFlash] = useState('');

	// Delete an item (material/task/forum) for a week
	const handleDeleteItem = (type, weekNumber, id) => {
		try {
			// compute new arrays synchronously so we can persist immediately
			let newMaterials = weeksWithMaterials;
			let newTasks = weeksWithTasks;
			let newForums = weeksWithForums;
			if (type === 'material') {
				newMaterials = weeksWithMaterials.map(w => w.week === weekNumber ? { ...w, materials: w.materials.filter(m => m.id !== id) } : w);
				setWeeksWithMaterials(newMaterials);
			} else if (type === 'task') {
				newTasks = weeksWithTasks.map(w => w.week === weekNumber ? { ...w, tasks: w.tasks.filter(t => t.id !== id) } : w);
				setWeeksWithTasks(newTasks);
			} else if (type === 'forum') {
				newForums = weeksWithForums.map(w => w.week === weekNumber ? { ...w, forums: w.forums.filter(f => f.id !== id) } : w);
				setWeeksWithForums(newForums);
			}

			// persist immediately
			if (storageKey) {
				try {
					const data = { tasks: newTasks, forums: newForums, materials: newMaterials };
					localStorage.setItem(storageKey, JSON.stringify(data));
				} catch (err) { console.warn('Failed to persist deletion', err); }
			}

			// quick visual confirmation
			setFlash('Elemento eliminado');
			setTimeout(() => setFlash(''), 3000);

			// notify other components in the tab
			try { window.dispatchEvent(new CustomEvent('curso_data_changed', { detail: { courseId } })); } catch (err) { console.warn('dispatch failed', err); }
		} catch (err) {
			console.warn('Failed to delete item', err);
		}
	};
	const handleCreate = () => {
		const wk = Number(form.week);
		if (!curso) return;
		if (modalType === 'material') {
			const item = { id: `C${curso.id}-M-${wk}-${Date.now()}`, title: form.title, description: form.description };
			setWeeksWithMaterials(prev => prev.map(w => w.week === wk ? { ...w, materials: [...w.materials, item] } : w));
		} else if (modalType === 'task') {
			const fromIso = form.from || '';
			const toIso = form.to || '';
			const now = Date.now();
			const fromTs = fromIso ? Date.parse(fromIso) : null;
			const toTs = toIso ? Date.parse(toIso) : null;
			const computeInitialStatus = () => {
				if (fromTs && now < fromTs) return 'Programada';
				if (toTs && now > toTs) return 'Vencida';
				return 'Por entregar';
			};


			const item = { id: `C${curso.id}-T-${wk}-${Date.now()}`, title: form.title, from: fromIso, to: toIso, status: computeInitialStatus(), submitted: false, submittedAt: null };
			setWeeksWithTasks(prev => prev.map(w => w.week === wk ? { ...w, tasks: [...w.tasks, item] } : w));
		} else if (modalType === 'forum') {
			const item = { id: `C${curso.id}-F-${wk}-${Date.now()}`, title: form.title, from: form.from, to: form.to };
			setWeeksWithForums(prev => prev.map(w => w.week === wk ? { ...w, forums: [...w.forums, item] } : w));
		}
		closeModal();
	};

	if(!curso) return (<div className="p-8">Curso no encontrado. <Link to="/">Volver</Link></div>);

	return (
		<div className="p-8 max-w-4xl">
		{flash && (<div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">{flash}</div>)}
			<div className="mb-4"><h2 className="text-2xl font-bold">{curso.nombre}</h2><p className="text-sm text-gray-600">Código: {curso.id}</p></div>
			<div className="mb-4 flex gap-2"><button onClick={()=>setTab('materiales')} className={`px-3 py-1 ${tab==='materiales'?'bg-white border-blue-600':'bg-gray-100'}`}>Materiales</button><button onClick={()=>setTab('tareas')} className={`px-3 py-1 ${tab==='tareas'?'bg-white border-blue-600':'bg-gray-100'}`}>Tareas</button><button onClick={()=>setTab('foros')} className={`px-3 py-1 ${tab==='foros'?'bg-white border-blue-600':'bg-gray-100'}`}>Foros</button></div>

			<div className="bg-white p-4 rounded shadow">
				{tab==='materiales' && (
					<div>
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-semibold">Materiales</h3>
							{role==='Docente'&&<button onClick={()=>openModal('material')} className="bg-blue-600 text-white px-3 py-1 rounded">Añadir</button>}
						</div>
						<div className="space-y-2">
							{weeksWithMaterials.map(w=> (
								<WeekList key={w.week} title={`Semana ${w.week}`} items={w.materials} render={m=>(
									<div key={m.id} className="flex justify-between items-center">
										<div>
											<div className="font-semibold text-[#183a6e]">{m.title}</div>
											<div className="text-sm text-gray-500">{m.description}</div>
										</div>
										{role === 'Docente' && (
											<button onClick={()=>handleDeleteItem('material', w.week, m.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Eliminar</button>
										)}
									</div>
								)} />
							))}
						</div>
					</div>
				)}

								{tab==='tareas' && (
									<div>
										<div className="flex justify-between items-center mb-4">
											<h3 className="font-semibold">Tareas</h3>
											{role==='Docente'&&<button onClick={()=>openModal('task')} className="bg-blue-600 text-white px-3 py-1 rounded">Añadir</button>}
										</div>
										<div className="space-y-2">
											{weeksWithTasks.map(w=> (
												<WeekList key={w.week} title={`Semana ${w.week}`} items={w.tasks} render={t=>(
													<div key={t.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
														<div>
															<div className="font-semibold text-[#183a6e]">{t.title}</div>
															<div className="text-sm text-gray-500">{t.from ? new Date(t.from).toLocaleString() : ''}{t.from && t.to ? ' - ' : ''}{t.to ? new Date(t.to).toLocaleString() : ''}</div>
														</div>
														<div className="flex items-center gap-4">
															<span className={`px-3 py-1 rounded-full text-xs font-medium ${{
																'Por entregar': 'bg-yellow-100 text-yellow-800',
																'Entregada': 'bg-green-100 text-green-800',
																'Vencida': 'bg-gray-100 text-gray-600',
																'Programada': 'bg-blue-100 text-blue-800'
															}[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
															<Link to={`/curso/${curso.id}/actividad/${t.id}`} className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Ir a la actividad</Link>
															{role === 'Docente' && (
																<button onClick={()=>handleDeleteItem('task', w.week, t.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Eliminar</button>
															)}
														</div>
													</div>
												)} />
											))}
										</div>
									</div>
								)}

								{tab==='foros' && (
									<div>
										<div className="flex justify-between items-center mb-4">
											<h3 className="font-semibold">Foros</h3>
											{role==='Docente'&&<button onClick={()=>openModal('forum')} className="bg-blue-600 text-white px-3 py-1 rounded">Añadir</button>}
										</div>
										<div className="space-y-2">
											{weeksWithForums.map(w=> (
												<WeekList key={w.week} title={`Semana ${w.week}`} items={w.forums} render={f=>(
													<div key={f.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
														<div>
															<div className="font-semibold text-[#183a6e]">{f.title}</div>
															<div className="text-sm text-gray-500">{f.from} - {f.to}</div>
														</div>
														<div className="flex items-center gap-4">
															<Link to={`/curso/${curso.id}/actividad/${f.id}`} className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Ir a la actividad</Link>
															{role === 'Docente' && (
																<button onClick={()=>handleDeleteItem('forum', w.week, f.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Eliminar</button>
															)}
														</div>
													</div>
												)} />
											))}
										</div>
									</div>
								)}
			</div>

			<div className="mt-4"><Link to="/">Volver a Mis cursos</Link></div>

			{modalOpen && (
				<Modal title={modalType==='material'?'Crear material':modalType==='task'?'Crear tarea':'Crear foro'} onClose={closeModal}>
					<div className="space-y-2">
						<div>
							<label className="text-sm">Semana</label>
							<select value={form.week} onChange={(e)=>setForm(prev=>({...prev, week:Number(e.target.value)}))} className="block w-full border rounded px-2 py-1">
								{Array.from({length:18}).map((_,i)=><option value={i+1} key={i}>Semana {i+1}</option>)}
							</select>
						</div>
						<div>
							<label className="text-sm">Título</label>
							<input value={form.title} onChange={e=>setForm(prev=>({...prev, title:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
						</div>
						<div>
							<label className="text-sm">Descripción</label>
							<textarea value={form.description} onChange={e=>setForm(prev=>({...prev, description:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
						</div>
						{modalType === 'task' && (
							<div>
								<label className="text-sm">Desde (fecha y hora)</label>
								<input type="datetime-local" value={form.from} onChange={e=>setForm(prev=>({...prev, from:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
							</div>
						)}
						{modalType === 'task' && (
							<div>
								<label className="text-sm">Hasta (fecha y hora)</label>
								<input type="datetime-local" value={form.to} onChange={e=>setForm(prev=>({...prev, to:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
							</div>
						)}
						{modalType === 'forum' && (
							<div>
								<label className="text-sm">Desde</label>
								<input value={form.from} onChange={e=>setForm(prev=>({...prev, from:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
							</div>
						)}
						{modalType === 'forum' && (
							<div>
								<label className="text-sm">Hasta</label>
								<input value={form.to} onChange={e=>setForm(prev=>({...prev, to:e.target.value}))} className="block w-full border rounded px-2 py-1"/>
							</div>
						)}
						<div className="flex justify-end gap-2 mt-2"><button className="px-3 py-1 border rounded" onClick={closeModal}>Cancelar</button><button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleCreate}>Crear</button></div>
					</div>
				</Modal>
			)}
		</div>
	);
}