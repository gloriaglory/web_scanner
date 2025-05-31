import { useState } from "react";
import { UserCircle } from "lucide-react"; 

type ScanResult = {
  alert: string;
  description: string;
};

function App() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("Enter a URL and click Scan.");
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    if (!url.trim()) {
      setOutput("Please enter a valid URL.");
      setResults(null);
      return;
    }

    setLoading(true);
    setOutput("Starting scan...");
    setResults(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setOutput(`Scan failed: ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.results) {
        setOutput("Scan completed. See results below.");
        setResults(data.results);
      } else {
        setOutput("Scan completed, but no results found.");
        setResults([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setOutput("Error communicating with server: " + err.message);
      } else {
        setOutput("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-700">scannerTZ</div>
        <ul className="flex gap-6 text-gray-700 text-base font-medium">
          <li className="hover:text-indigo-600 cursor-pointer">Home</li>
          <li className="hover:text-indigo-600 cursor-pointer">History</li>
        </ul>
        <div className="text-gray-600 hover:text-indigo-700 cursor-pointer">
          <UserCircle size={28} />
        </div>
      </nav>

      {/* CONTENT */}
      <main className="p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          AI-Assisted Penetration Testing Platform
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter website URL to scan"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-full sm:w-96 text-base rounded shadow"
          />
          <button
            onClick={startScan}
            disabled={loading}
            className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        <div className="bg-white border p-4 rounded shadow w-full max-w-2xl whitespace-pre-wrap mb-6">
          <p className="text-gray-800">{output}</p>
        </div>

        {results && results.length > 0 && (
          <section className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-3 text-indigo-800">
              Scan Results
            </h2>
            <ul className="space-y-4">
              {results.map((r: ScanResult, i: number) => (
                <li key={i} className="bg-white border p-4 rounded shadow">
                  <p className="font-semibold text-red-700">{r.alert}</p>
                  <p className="text-gray-700">{r.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
