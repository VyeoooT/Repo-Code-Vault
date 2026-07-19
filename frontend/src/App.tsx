import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CreateSnippetPage from './pages/CreateSnippetPage';
import EditSnippetPage from './pages/EditSnippetPage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import SnippetsPage from './pages/SnippetsPage';
import TestAuth from './pages/TestAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SnippetsPage />} />
        <Route path="/snippets/new" element={<CreateSnippetPage />} />
        <Route path="/snippets/:id" element={<SnippetDetailPage />} />
        <Route path="/snippets/:id/edit" element={<EditSnippetPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/testauth" element={<TestAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
