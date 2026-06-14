import { FeaturePanel } from './components/FeaturePanel';
import { Header } from './components/Header';

export function App() {
  return (
    <div className="app">
      <div className="bg-gradient" />
      <Header />
      <main className="main">
        <FeaturePanel />
      </main>
    </div>
  );
}
