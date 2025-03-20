import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Gemini Chat</h1>
        <Chat />
      </div>
    </main>
  );
}
