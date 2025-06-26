import { useState } from 'react'
import './App.css'

export const rellenoData = [
	{
		cliente: 'EcoPapeleras',
		mes: 'Junio',
		kg: 1200,
		ingreso: 1000,
		tipo_residuo: 'orgánico',
		duracion_min: 40,
		tiradas: 2,
	},
	{
		cliente: 'BasuraCero',
		mes: 'Junio',
		kg: 1400,
		ingreso: 1200,
		tipo_residuo: 'plástico',
		duracion_min: 50,
		tiradas: 3,
	},
	{
		cliente: 'RecolectaMX',
		mes: 'Junio',
		kg: 1000,
		ingreso: 900,
		tipo_residuo: 'papel',
		duracion_min: 35,
		tiradas: 1,
	},
]

function App() {
	const [cliente, setCliente] = useState('Todos')
	const [mes, setMes] = useState('Todos')

	// Obtener clientes y meses únicos
	const clientes = ['Todos', ...new Set(rellenoData.map(d => d.cliente))]
	const meses = ['Todos', ...new Set(rellenoData.map(d => d.mes))]

	// Filtrar datos según selección
	const datosFiltrados = rellenoData.filter(d =>
		(cliente === 'Todos' || d.cliente === cliente) &&
		(mes === 'Todos' || d.mes === mes)
	)

	// Calcular toneladas recibidas
	const toneladas = datosFiltrados.reduce((acc, curr) => acc + curr.kg, 0) / 1000

	// Calcular ingreso total
	const ingresoTotal = datosFiltrados.reduce((acc, curr) => acc + curr.ingreso, 0)

	// Calcular top 3 tipos de residuo por kg
	const residuos = {}
	datosFiltrados.forEach(d => {
		residuos[d.tipo_residuo] = (residuos[d.tipo_residuo] || 0) + d.kg
	})
	const topResiduos = Object.entries(residuos)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)

	// Calcular top 3 clientes por kg
	const clientesKg = {}
	datosFiltrados.forEach(d => {
		clientesKg[d.cliente] = (clientesKg[d.cliente] || 0) + d.kg
	})
	const topClientes = Object.entries(clientesKg)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)

	// Calcular duración promedio
	const duracionPromedio = datosFiltrados.length > 0
		? datosFiltrados.reduce((acc, curr) => acc + curr.duracion_min, 0) / datosFiltrados.length
		: 0

	// Calcular promedio de tiradas por cliente (solo si hay datos filtrados)
	let promedioTiradas = 0;
	if (datosFiltrados.length > 0) {
		const tiradasPorCliente = {};
		datosFiltrados.forEach(d => {
			tiradasPorCliente[d.cliente] = (tiradasPorCliente[d.cliente] || 0) + d.tiradas;
		});
		const clientesFiltrados = Object.keys(tiradasPorCliente).length;
		const totalTiradas = Object.values(tiradasPorCliente).reduce((acc, curr) => acc + curr, 0);
		promedioTiradas = totalTiradas / clientesFiltrados;
	}

	// Calcular kg promedio por entrega
	const kgPromedioEntrega = datosFiltrados.length > 0
		? datosFiltrados.reduce((acc, curr) => acc + curr.kg, 0) / datosFiltrados.length
		: 0

	return (
		<>
			<h1>Relleno Sanitario</h1>
			<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1rem 0' }}>
				<label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
					Cliente
					<select value={cliente} onChange={e => setCliente(e.target.value)} style={{ marginTop: '0.5rem', padding: '0.3rem' }}>
						{clientes.map(c => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				</label>
				<label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
					Mes
					<select value={mes} onChange={e => setMes(e.target.value)} style={{ marginTop: '0.5rem', padding: '0.3rem' }}>
						{meses.map(m => (
							<option key={m} value={m}>{m}</option>
						))}
					</select>
				</label>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'flex-start',
					gap: '2rem',
					margin: '2rem 0',
					flexWrap: 'wrap',
				}}
			>
				<div
					style={{
						background: '#4caf50',
						color: 'white',
						borderRadius: '1rem',
						padding: '2rem 3rem',
						fontSize: '2rem',
						fontWeight: 'bold',
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						minWidth: 220,
					}}
				>
					{toneladas.toLocaleString('es-MX', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{' '}
					t
					<div
						style={{
							fontSize: '1rem',
							fontWeight: 'normal',
							marginTop: '0.5rem',
						}}
					>
						Toneladas recibidas {mes !== 'Todos' ? `en ${mes}` : ''}
					</div>
				</div>
				{/* Indicador ingreso total */}
				<div style={{ background: '#388e3c', color: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: '2rem 3rem', minWidth: 220, fontSize: '2rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					${ingresoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					<div style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
						Ingreso total
					</div>
				</div>
				{/* Indicador duración promedio */}
				<div style={{ background: '#1976d2', color: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: '2rem 3rem', minWidth: 220, fontSize: '2rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{duracionPromedio.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} min
					<div style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
						Duración promedio
					</div>
				</div>
				{/* Indicador promedio de tiradas por cliente */}
				<div style={{ background: '#ff9800', color: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: '2rem 3rem', minWidth: 220, fontSize: '2rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{promedioTiradas.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					<div style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
						Tiradas promedio por cliente
					</div>
				</div>
				{/* Indicador kg promedio por entrega */}
				<div style={{ background: '#009688', color: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: '2rem 3rem', minWidth: 220, fontSize: '2rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{kgPromedioEntrega.toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
					<div style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
						Kg promedio por entrega
					</div>
				</div>
				{/* Top 3 tipos de residuo */}
				<div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem 2rem', minWidth: 220 }}>
					<h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Top 3 tipos de residuo</h2>
					<ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
						{topResiduos.map(([tipo, kg]) => (
							<li key={tipo} style={{ marginBottom: '0.5rem' }}>
								<span style={{ fontWeight: 'bold' }}>{tipo}</span>: {kg.toLocaleString('es-MX')} kg
							</li>
						))}
					</ol>
				</div>
				{/* Top 3 clientes */}
				<div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem 2rem', minWidth: 220 }}>
					<h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Top 3 clientes</h2>
					<ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
						{topClientes.map(([cli, kg]) => (
							<li key={cli} style={{ marginBottom: '0.5rem' }}>
								<span style={{ fontWeight: 'bold' }}>{cli}</span>: {kg.toLocaleString('es-MX')} kg
							</li>
						))}
					</ol>
				</div>
			</div>
		</>
	)
}

export default App
