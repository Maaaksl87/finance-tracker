import "./index.css";
import Layout from "./components/Layout";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <h1>Hello World</h1>
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
