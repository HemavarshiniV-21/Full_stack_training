import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import BookList from './BookList';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <h1>hello</h1>
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/books'>BookList</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<BookList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
