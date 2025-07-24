import { Router } from "../router";
import { Toaster } from "sonner";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />


      <Router />

    </div>
  );
}

export default App;
