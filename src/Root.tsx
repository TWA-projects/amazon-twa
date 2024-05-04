import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { MainScreen, FormScreen } from './pages';

export const Root = () => {
  // No useLocation here, the Router provides the context now
  return (
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          {/* Index route for the nested routes */}
          <Route index element={<MainScreen />} />
          <Route path='/form' element={<FormScreen />} />
          {/* <Route path='/nutrition' element={<ScreenThree />} /> */}
          {/* <Route path='/tasks' element={<ScreenFour />} /> */}
          {/* Add more nested routes as needed */}
        </Route>
        {/* Other routes can be added here if necessary */}
      </Routes>
    </Router>
  );
};
