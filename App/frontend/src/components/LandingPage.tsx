

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Välkommen till Poängräknaren!</h1>
                <p className="text-lg mb-6">Skapa ett spel och lägg till dina spelare för att börja räkna poäng.</p>
                <a href={`/creategame`} className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">Skapa Spel</a>
            </div>
        </div>
    );
}

