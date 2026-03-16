import Buscador from '../components/Buscador';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
          Buscador
        </h1>
        
        {/* Aquí es donde aparece la magia */}
        <Buscador />
        
      </div>
    </main>
  );
}