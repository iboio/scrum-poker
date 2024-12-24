import './App.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/views/home.tsx";
import Error from "@/views/error.tsx"
import SetNewTask from "@/views/setNewTask.tsx";
import Wait from "@/views/wait.tsx";
import PokerRoom from "@/views/poker-room.tsx";
const router = createBrowserRouter([
  {
    path: '',
    element: <Home />
  },
  {
    path: '/:sessionId',
    element: <PokerRoom />
  },
  {
    path:'/error',
    element: <Error></Error>
  },
  {
    path: '/:sessionId/task',
    element: <SetNewTask></SetNewTask>
  },
  {
    path: '/:sessionId/wait',
    element: <Wait></Wait>
  },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
