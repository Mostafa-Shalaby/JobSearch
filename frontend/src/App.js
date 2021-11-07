import { AppProvider } from './components/helper/AppProvider';
import Connector from './Connector';

function App() {
  return (
    <AppProvider>
      <Connector/>
    </AppProvider>
  );
}

export default App;
