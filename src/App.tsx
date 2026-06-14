import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';

export function App() {
  return (
    <div className="app">
      <div className="bg-gradient" />
      <Header />
      <main className="main">
        <SwapCard />
      </main>
    </div>
  );
}
