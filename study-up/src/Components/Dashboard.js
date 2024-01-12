import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { generate } from 'shortid'
import '../dashboard.scss'
import logo from '../main_logo.png'
import noteImg from '../Notes.png'
// import noteImg from '../NotesDesign2.png'
import flashImg from '../FlashCards.png'
// Premade Questions and Answers: https://www.mentimeter.com/blog/audience-energizers/55-free-trivia-and-fun-quiz-question-templates

const Dashboard = () => {

    const { email } = useParams()
    const [itemsAlteration, setItemsAlteration] = useState("")
    const [quizItems, setQuizItems] = useState([])
    const [quizId, setQuizId] = useState("")
    const [username, setUsername] = useState("")
    const [flashItems, setFlashItems] = useState([])
    const [flashId, setFlashId] = useState("")
    const [noteItems, setNoteItems] = useState([])
    const [noteId, setNoteId] = useState("")

    const getUsername = () => {
        axios.post("http://localhost:4000/app/getusername", { email: email })
            .then(res => {
                if (res.data.status === "ok") {
                    setUsername(res.data.username)
                }
            })
    }

    const createNewQuiz = () => {
        const newQuiz = {
            id: `${generate()}`,
            email: `${email}`,
            title: "Untitled",
            questions: []
        }
        axios.post("http://localhost:4000/app/newquiz", newQuiz)
            .then(res => {
                setItemsAlteration(res.data.id) // Id is unique every time, so adding a new a quiz will force useEffect() to run.
            })
    }

    const deleteQuiz = () => {
        const deletedQuiz = {
            id: quizId,
            email: `${email}`
        }
        axios.post("http://localhost:4000/app/deletequiz", deletedQuiz)
            .then(res => {
                if (res.data.status === "ok") {
                    setItemsAlteration(quizId + "1231") // Append some random numbers to force an alteration, so then useEffect() runs to update the dashboard.
                    setQuizId("")
                }
            })
    }

    const createNewFlash = () => {
        const newFlash = {
            id: `${generate()}`,
            email: `${email}`,
            title: "Untitled",
            flashCards: []
        }
        axios.post("http://localhost:4000/app/newflash", newFlash)
            .then(res => {
                setItemsAlteration(res.data.id) // Id is unique every time, so adding a new flashcards will force useEffect() to run.
            })
    }

    const deleteFlash = () => {
        const deletedFlash = {
            id: flashId,
            email: `${email}`
        }
        axios.post("http://localhost:4000/app/deleteflash", deletedFlash)
            .then(res => {
                if (res.data.status === "ok") {
                    setItemsAlteration(flashId + "1231") // Append some random numbers to force an alteration, so then useEffect() runs to update the dashboard.
                    setFlashId("")
                }
            })
    }

    const createNewNote = () => {
        const newNote = {
            id: `${generate()}`,
            email: `${email}`,
            title: "Untitled",
            note: []
        }

        axios.post("http://localhost:4000/app/newNote", newNote)
            .then(res => {
                setItemsAlteration(res.data.id) // Id is unique every time, so adding a new note will force useEffect() to run.
            })
    }

    const deleteNote = () => {
        const deleteNote = {
            id: noteId,
            email: `${email}`
        }
        axios.post("http://localhost:4000/app/deleteNote", deleteNote)
            .then(res => {
                if (res.data.status === "ok") {
                    setItemsAlteration(noteId + "1231") // Append some random numbers to force an alteration, so then useEffect() runs to update the dashboard.
                    setNoteId("")
                }
            })
    }
    const getUserItems = () => {
        const emailInfo = { email: `${email}` }
        axios.post("http://localhost:4000/app/getitems", emailInfo)
            .then(res => {
                if (res.data.status === "ok") {
                    setQuizItems(res.data.quizItems)
                    setFlashItems(res.data.flashItems)
                    setNoteItems(res.data.noteItems)
                }
                else {
                    console.log("Error getting items!")
                }
            })
    }

    const navigate = useNavigate(); // React requires the function be declared outside of a callback.

    useEffect(() => {
        getUserItems()
    }, [itemsAlteration])

    useEffect(() => {
        getUsername()
    }, [])

    return (
        <div className='container mx-auto px-4 h-screen'>
            <div className='row'>
                <div className='col-3'>
                    <img src={logo} alt='Study-Up Logo' width={"200px"} style={{ marginRight: "270px", marginBottom: "20px" }} />
                </div>
                <div className='col-9'>
                    <h1 id='dashboard-header'>{username}'s Dashboard</h1>
                </div>
            </div>
            <div className="row" id='button-outter'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <div className='button-inner'>
                        <button type="button" onClick={() => createNewQuiz()} className="btn" id='create-quiz-button'>Create New Quiz</button>
                    </div>
                    <div className='button-inner'>
                        <button type="button" onClick={() => createNewFlash()} className="btn" id='create-flash-button'>Create New FlashCards</button>
                    </div>
                    <div className='button-inner'>
                        <button type="button" onClick={() => createNewNote()} className="btn" id='create-note-button'>Create New Note</button>
                    </div>
                </div>
                <div className='col-1'></div>
            </div>
            <div className="row row-cols-md-4 g-4 my-2 ">
                {
                    quizItems.map((item) => {
                        return (
                            <div key={item.id} id={item.id} className="wrapper ">
                                <div className="quiz-card">
                                    <div className="quiz-card-image"></div>
                                    <div className="quiz-card-name">{item.quizTitle}</div>
                                    <button type="button" className="btn btn-danger" style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setQuizId(item.id)} data-bs-toggle="modal" data-bs-target="#quizModal"><i className="bi bi-x-lg"></i></button>

                                    <div className="quiz-card-footer clearfix">
                                        <div className="one-half" id='edit-quiz-button' onClick={() => navigate(`/quizcreator/${email}/${item.id}`)}>
                                            <label>Edit Quiz</label>
                                        </div>

                                        <div className="one-half no-border" id='pract-quiz-button' onClick={() => navigate(`/quiz/${email}/${item.id}`)}>
                                            <label>Complete Quiz</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {/* FlashCards */}
                {
                    flashItems.map((item) => {
                        return (
                            <div key={item.id} id={item.id} className="wrapper ">
                                <div className="flash-card">
                                    <img src={flashImg} className="flash-card-image" />
                                    <button type="button" className="btn btn-danger" style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setFlashId(item.id)} data-bs-toggle="modal" data-bs-target="#flashModal"><i className="bi bi-x-lg"></i></button>
                                    <div className="flash-card-name">{item.flashTitle}</div>
                                    <div className="quiz-card-footer clearfix">
                                        <div className="one-half" id='edit-flash-button' onClick={() => navigate(`/flashcardedit/${email}/${item.id}`)}>
                                            <label>Edit FlashCards</label>
                                        </div>
                                        <div className="one-half no-border" id='view-flash-button' onClick={() => navigate(`/flashcard/${email}/${item.id}`)}>
                                            <label>Veiw FlashCards</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {/* Notes */}
                {
                    noteItems.map((item) => {
                        return (
                            <div key={item.id} id={item.id} className="wrapper ">
                                <div className="note-card">
                                    <img src={noteImg} className="note-card-image" />
                                    <button type="button" className="btn btn-danger" style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setNoteId(item.id)} data-bs-toggle="modal" data-bs-target="#noteModal"><i className="bi bi-x-lg"></i></button>
                                    <div className="note-card-name">{item.noteTitle}</div>
                                    <div className="note-card-footer clearfix">
                                        <div className="note-page" id="veiw-note-button" onClick={() => navigate(`/note/${email}/${item.id}`)}>
                                            <label>Notepage</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* Delete Notes */}
            <div className="modal fade" id="noteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Note Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this notepage?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => setNoteId("")}>Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteNote()}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete FlashCards */}
            <div className="modal fade" id="flashModal" tabIndex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm FlashCard Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete these flash cards?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => setFlashId("")}>Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteFlash()}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete Quizzes */}
            {<div className="modal fade" id="quizModal" tabIndex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-white">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Quiz Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-white">
                            Are you sure you want to delete this quiz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => setQuizId("")}>Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteQuiz()}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            </div>}

        </div>

    )
};

export default Dashboard