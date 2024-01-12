import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login.js';
import CreateAcc from './Components/CreateAcc.js';
import Dashboard from './Components/Dashboard.js';
import QuizCreator from './Components/QuizCreator.js';
import Quiz from './Components/Quiz.js';
import Note from './Components/Note.js';
import FlashCardEdit from './Components/FlashCardEditor.js';
import FlashCard from './Components/FlashCard.js';
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App" id="app-main">
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route path='/createaccount' element={<CreateAcc/>}/>
        <Route path='/dashboard/:email' element={<Dashboard/>}/>
        <Route path='/quizcreator/:email/:id' element={<QuizCreator/>}/>
        <Route path='/quiz/:email/:id' element={<Quiz/>}/>
        <Route path='/note/:email/:id' element={<Note/>}/>
        <Route path='/flashcard/:email/:id' element={<FlashCard/>}/>
        <Route path='/flashcardedit/:email/:id' element={<FlashCardEdit/>}/>
      </Routes>
    </div>
  );
}

export default App;
