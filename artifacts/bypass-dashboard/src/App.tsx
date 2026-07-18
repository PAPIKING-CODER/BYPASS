import { MusicWidget } from './components/MusicWidget';  // 👈 NUEVA LÍNEA

// ... tus imports originales (BrowserRouter, Routes, Route, etc.) ...

function App() {
  return (
    <div className="app">
      {/* TODO TU CONTENIDO ACTUAL (rutas, layout, etc.) */}
      {/* Ejemplo:
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/executors" element={<Executors />} />
        </Routes>
      </BrowserRouter>
      */}

      {/* 🎵 NUEVO: Widget de música al final */}
      <MusicWidget />  {/* 👈 NUEVA LÍNEA */}
    </div>
  );
}

export default App;
