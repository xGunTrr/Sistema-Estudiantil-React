import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function CursoDetalle({ cursos = [] }) {
    const { id } = useParams();
    const location = useLocation();
    const cursoFromState = location.state && location.state.curso;
    const [selectedTab, setSelectedTab] = useState("materiales");

    let curso = cursoFromState;
    if (!curso) {
        const cursoId = Number(id);
        curso = cursos.find((c) => c.id === cursoId) || null;
    }

    // Estado y datos mock para tareas
    const [filter, setFilter] = useState("Todas");
    const weeksWithTasks = [
        { week: 1, tasks: [] },
        {
            week: 2, tasks: [
                { id: 'T-201', title: 'Semana 02 - Tema 01: Tarea', status: 'Por entregar', from: '17/11/25 12:00 p.m.', to: '24/11/25 11:59 p.m.' }
            ]
        },
        {
            week: 3, tasks: [
                { id: 'T-301', title: 'Semana 03 - Tema 02: Tarea', status: 'Entregada', from: '25/08/25 06:00 a.m.', to: '01/09/25 11:59 p.m.' }
            ]
        },
        {
            week: 4, tasks: [
                { id: 'T-401', title: 'Semana 04 - Tema 01: Tarea', status: 'Entregada', from: '01/09/25 06:00 a.m.', to: '08/09/25 11:59 p.m.' }
            ]
        },
        {
            week: 5, tasks: [
                { id: 'T-501', title: 'Semana 05 - Tema 02: Tarea', status: 'Vencida', from: '08/09/25 06:00 a.m.', to: '14/09/25 11:59 p.m.' }
            ]
        },
    ];

    if (!curso) {
        return (
            <div className="p-12">
                <h2 className="text-2xl font-semibold mb-4">Curso no encontrado</h2>
                <p className="text-sm text-gray-600 mb-6">No se pudo localizar la información del curso.</p>
                <Link to="/" className="text-blue-600 hover:underline">Volver</Link>
            </div>
        );
    }

    return (
        <div className="p-12 max-w-4xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#233971]">{curso.nombre}</h2>
                <p className="text-sm text-[#54657c]">Código: {curso.id}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Descripción</h3>
                <p className="text-[#54657c]">{curso.descripcion}</p>
            </div>

            <div className="mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedTab("materiales")}
                        className={`px-4 py-2 rounded-t-lg border-b-2 ${selectedTab === "materiales" ? "bg-white border-blue-600 text-blue-700 font-semibold" : "bg-gray-100 border-transparent text-gray-600"}`}
                    >
                        Materiales
                    </button>
                    <button
                        onClick={() => setSelectedTab("tareas")}
                        className={`px-4 py-2 rounded-t-lg border-b-2 ${selectedTab === "tareas" ? "bg-white border-blue-600 text-blue-700 font-semibold" : "bg-gray-100 border-transparent text-gray-600"}`}
                    >
                        Tareas
                    </button>
                    <button
                        onClick={() => setSelectedTab("foros")}
                        className={`px-4 py-2 rounded-t-lg border-b-2 ${selectedTab === "foros" ? "bg-white border-blue-600 text-blue-700 font-semibold" : "bg-gray-100 border-transparent text-gray-600"}`}
                    >
                        Foros
                    </button>
                </div>

                <div className="bg-white border p-6 rounded-b-lg shadow">
                    {selectedTab === "materiales" && (
                        <div>
                            <h4 className="font-semibold mb-4">Materiales del curso</h4>

                            <div className="bg-gray-50 p-4 rounded">
                                <div className="text-sm text-[#233971] font-semibold mb-3">Total de semanas (18)</div>

                                <div className="space-y-3">
                                    {Array.from({ length: 18 }).map((_, idx) => {
                                        const weekIndex = idx + 1;
                                        return (
                                            <WeekItem key={weekIndex} week={weekIndex} />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedTab === "tareas" && (
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-2xl font-semibold">Todas las tareas <span className="text-base text-gray-500">(20)</span></h4>
                                </div>

                                <div className="w-56">
                                    <label className="text-sm text-gray-600">Filtro por estado</label>
                                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
                                        <option value="Todas">Todas</option>
                                        <option value="Programada">Programada</option>
                                        <option value="Por entregar">Por entregar</option>
                                        <option value="Entregada">Entregada</option>
                                        <option value="Vencida">Vencida</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {weeksWithTasks.map((w) => (
                                    <WeekTasks key={w.week} week={w.week} tasks={w.tasks.filter(t => filter === 'Todas' ? true : t.status === filter)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === "foros" && (
                        <div>
                            <h4 className="font-semibold mb-2">Foros</h4>
                            <p className="text-[#54657c]">Aquí se mostrarán los hilos de discusión del curso.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <Link to="/" className="text-blue-600 hover:underline">Volver a Mis cursos</Link>
            </div>
        </div>
    );
}

export default CursoDetalle;

function WeekItem({ week }) {
    const [open, setOpen] = useState(false);

    const items = [
        { id: 1, title: `Introducción a la semana ${String(week).padStart(2, '0')}` },
        { id: 4, title: `Cierre de la semana ${week}` },
    ];

    return (
        <div className={`bg-white rounded shadow-sm overflow-hidden ${open ? 'border-l-4 border-blue-600' : ''}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3"
            >
                <div className="flex items-center">
                    <div className="w-2 h-10 bg-blue-600 mr-3 hidden md:block" />
                    <div className="text-base font-medium text-[#233971]">Semana {String(week).padStart(2, '0')}</div>
                </div>
                <div className="text-gray-500">
                    {open ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </button>

            {open && (
                <div className="px-6 py-4 border-t">
                    <ul className="space-y-4">
                        {items.map((it) => (
                            <li key={it.id} className="text-[#54657c]">
                                <div className="py-2">{it.title}</div>
                                <hr className="border-t border-gray-200" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function WeekTasks({ week, tasks }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`bg-white rounded shadow-sm overflow-hidden ${open ? 'border-l-4 border-blue-600' : ''}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3"
            >
                <div className="flex items-center">
                    <div className="w-2 h-10 bg-blue-600 mr-3 hidden md:block" />
                    <div className="text-base font-medium text-[#233971]">Semana {String(week).padStart(2, '0')}</div>
                </div>
                <div className="text-gray-500">{open ? <FaChevronUp /> : <FaChevronDown />}</div>
            </button>

            {open && (
                <div className="px-6 py-4 border-t space-y-4">
                    {tasks.length === 0 && (
                        <div className="text-sm text-gray-600">(No tienes tareas)</div>
                    )}

                    {tasks.map((t) => (
                        <TaskCard key={t.id} task={t} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TaskCard({ task }) {
    const statusStyles = {
        'Por entregar': 'bg-yellow-100 text-yellow-800',
        'Entregada': 'bg-green-100 text-green-800',
        'Vencida': 'bg-gray-100 text-gray-600',
        'Programada': 'bg-blue-100 text-blue-800'
    };

    return (
        <div className="bg-white rounded p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-start gap-4">
                <div className="text-2xl text-gray-400 mt-1">📄</div>
                <div>
                    <div className="text-sm text-gray-500 mb-1">No calificada</div>
                    <div className="font-semibold text-[#183a6e]">{task.title}</div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status] || 'bg-gray-100 text-gray-700'}`}>{task.status}</div>

                <div className="text-sm text-gray-500 text-right">
                    <div className="">Desde: {task.from}</div>
                    <div className="">Hasta: {task.to}</div>
                </div>

                <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">Ir a la actividad</button>
            </div>
        </div>
    );
}
