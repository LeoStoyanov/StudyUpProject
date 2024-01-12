import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import '../quizcreator.scss'

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissable fade show" role="alert">`,
        `   <div style="display: inline-block">${message}</div>`,
            '<button type="button" class="btn-close" style="float: right" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    document.getElementById('liveAlertPlaceholder').append(wrapper)
}

const QuizCreator = () => {
    const {email, id} = useParams()
    const [quizQuestions, setQuizQuestions] = useState([])
    const [questTitleEdited, setQuestTitleEdited] = useState(false)
    const [questTitle, setQuestTitle] = useState("")
    const [quizTitleEdited, setQuizTitleEdited] = useState(false)
    const [quizTitle, setQuizTitle] = useState("Untitled")
    const [onSaved, setOnSaved] = useState(false)

    const addQuestion = () => {
        const questionField = {
            "id": `${uuidv4()}`,
            "name": `Question ${quizQuestions.length + 1}`,
            "label": "Untitled",
            "type": "short answer",
            "correctAnswer" : "",
            "currentOption": "",
            "options": []
        }
        setQuizQuestions([...quizQuestions, questionField])
    }

    // Make sure there is at least one question.
    if (quizQuestions.length === 0) {
        addQuestion()
    }

    const editTitle = (questName, questLabel) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        if (questIndex !== -1) {
            questField[questIndex].label = questLabel
            setQuizQuestions(questField)
        }
    }
    // If the user presses enter when editing the question title, set the question title back to a label using blur (like onBlur).
    const pressedQuestEnter = (e) => {
        if(e.keyCode === 13){
            e.target.blur();
            setQuestTitle("") 
        }
    }

    const pressedQuizEnter = (e) => {
        if(e.keyCode === 13){
            e.target.blur();
            setQuestTitle("") 
        }
    }

    const editType = (questName, questType) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        if (questIndex !== -1) {
            questField[questIndex].type = questType
            setQuizQuestions(questField)
        }
    }
    const editOption = (questName, questCurOption) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        if (questIndex !== -1) {
            questField[questIndex].currentOption = questCurOption
            setQuizQuestions(questField)
        }
    }
    const addNewOption = (questName, newOption) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        const sameOptions = questField[questIndex].options.find(o => o === newOption )
        if (questIndex !== -1) {
            if (newOption && newOption !== "") {
                if (!sameOptions) { // Cannot have questions with the exact same options.
                    questField[questIndex].options.push(newOption)
                    setQuizQuestions(questField)
                }
                else {
                    document.getElementById('liveAlertPlaceholder').innerHTML=''
                    alert('<i class="bi-exclamation-circle"></i> You may not create a duplicate option!', 'danger')
                }
            } 
        }
    }
    const deleteOption = (questName, questOptions, option) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        const copyOptions = [...questOptions]
        if (questIndex !== -1) {
            const optionIndex = copyOptions.indexOf(option, 0)
            if (optionIndex !== -1) {
                copyOptions.splice(optionIndex, 1)
                questField[questIndex].options = copyOptions
                setQuizQuestions(questField)
            }
        }
    }
    const deleteQuestion = (questId) => {
        const questField = [...quizQuestions]
        if (questField.length <= 1) {
            document.getElementById('liveAlertPlaceholder').innerHTML=''
            alert('<i class="bi-exclamation-circle"></i> You may not have 0 questions!', 'danger')
            return
        }
        const questIndex = questField.findIndex(q => q.id === questId)
        if (questIndex !== -1) {
            // If a question that is not the last question must be deleted, renumber the questions accordingly.
            if (questIndex < questField.length - 1) {
                for (var i = questIndex + 1; i < questField.length; i++) {
                    // Set to i because questions are counted from 1, whereas arrays are counted from 0.
                    questField[i].name = `Question ${i}` 
                }
            }
            questField.splice(questIndex, 1)
            setQuizQuestions(questField)
        }
    }

    const updateChoiceAnswer = (questName, value) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)

        if (questIndex !== -1) {
            //const radios = document.getElementsByTagName('input');
            //for (var i = 0; i < radios.length; i++) {
                //if (radios[i].type === 'radio' && radios[i].checked) {
                    questField[questIndex].correctAnswer = value
                    console.log(questName + ": " + questField[questIndex].correctAnswer)
                    setQuizQuestions(questField)      
                //}
            //}
        }
    }

    const updateShortAnswer = (questName, value) => {
        const questField = [...quizQuestions]
        const questIndex = questField.findIndex(q => q.name === questName)
        if (questIndex !== -1) {
            questField[questIndex].correctAnswer = value     
            setQuizQuestions(questField) 
        }
    }

    const getQuizInfo = () => {
        const quiz = {
            id: `${id}`,
            email:`${email}`
        }
        axios.post("http://localhost:4000/app/getquiz", quiz)
        .then(res => {
            if (res.data.status === "ok") {
                let quiz = res.data.quizInfo
                setQuizTitle(quiz.quizTitle)
                setQuizQuestions(quiz.quizQuestions)
            }
        })
    }

    const onSave = () => {
        const updatedQuiz = {
            id: `${id}`,
            email: `${email}`,
            quizTitle: quizTitle,
            quizQuestions: quizQuestions
        }
        axios.post("http://localhost:4000/app/updatequiz", updatedQuiz)
        .then(res => {
            if (res.data.status === "ok") {
                setOnSaved(true)
            }
            else {
                console.log("Error saving quiz!")
            }
        })
    }

    useEffect(() => {
        getQuizInfo()
    }, [])

    return (
        <> 
            {onSaved ? (
                <section>
                    <Navigate to={`/dashboard/${email}`}/>
                </section>
            ) : (
                <section>
                    <div className='container mx-auto px-4 h-screen' data-testid='QuizCreatorID'>
                        <div className='row'>
                            <h1 id='quiz-creator-header'>Quiz Maker!</h1>
                        </div>
                        <div className='row'>
                            <div id="liveAlertPlaceholder"></div>
                        </div>
                        <div className='row'>
                        <div className='rounded-md p-3' id='header-bg'>
                            {quizTitleEdited ?
                            <div className='col-11 input-group mb-3'>
                                <span className="input-group-text" id='quiz-title-extra'>Quiz Title:</span> 
                                <input type="text" className="form-control" id='quiz-title-input' aria-describedby="quiz-title-text" value={quizTitle} onChange={(event) => setQuizTitle(event.target.value)} onBlur={() => setQuizTitleEdited(false)} onKeyDown={(event) => pressedQuizEnter(event)}/>
                            </div> 
                            : <div className='col-11'> <label onClick={() => setQuizTitleEdited(true)}><h3 id="quiz-title-text">{quizTitle === 0 ? "Quiz Title: Untitled" : "Quiz Title: " + quizTitle}</h3></label> </div>}
                        </div>
                            {
                                quizQuestions.map((quest) => {
                                    return (
                                        <div key={quest.id} className='shadow-lg rounded-md p-5 my-15' id='question-bg'>
                                            <div className='flex justify-between items-center space-y-2'>
                                                <div className="row block text-sm font-medium text-gray-700">
                                                    {questTitleEdited && (questTitle === quest.name) ?
                                                    <div className='col-4 input-group mb-3'>
                                                        <span className="input-group-text" id="quest-title-extra">{quest.name + ":"}</span> 
                                                        <input type="text" className="form-control" id='quest-title-input' aria-describedby="quest-title-extra" value={quest.label} onChange={(event) => editTitle(quest.name, event.target.value)} onBlur={() => {setQuestTitleEdited(false); setQuestTitle("")}} onKeyDown={(event) => pressedQuestEnter(event)}/>
                                                    </div> 
                                                    : <div className='col-11'> <label id='quest-title-text' onClick={() => {setQuestTitleEdited(true); setQuestTitle(quest.name)}}>{quest.label.length === 0 ? quest.name + ": " + (quest.label = "Untitled") : quest.name + ": " + quest.label}</label> 
                                                        <button type="button" className="btn btn-danger mx-2" onClick={() => deleteQuestion(quest.id)}><i className="bi bi-x-lg"></i></button></div>}
                                                    </div>

                                                <div className='col-11'>
                                                    <select className="form-select my-3" id='answer-type' onChange={(event) => editType(quest.name, event.target.value)} value={quest.type}>
                                                        <option value="short answer">Short Answer</option>
                                                        <option value="multiple choice">Multiple Choice</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='my-4'>
                                                {
                                                    
                                                    quest.type === "short answer" && <div className='col-11'> <input type="text" className="form-control" id='short-answer-input' placeholder="Type the correct answer here." onChange={(event) => updateShortAnswer(quest.name, event.target.value)} value={quest.correctAnswer}/> </div>
                                                }
                                                {
                                                    quest.type === "multiple choice" && 
                                                    <div className='my-4 flex flex-col space-y-2'>
                                                        <form>
                                                            {quest.options.map((x) =>
                                                                <div key={x} className='row'> 
                                                                    <div className="col-11 form-check">
                                                                    <input className="form-check-input" type="radio" name="option" id={"check_" + x} onChange={(event) => updateChoiceAnswer(quest.name, event.target.value)} value={x} checked={x === quest.correctAnswer ? true : false}/>
                                                                    <label className="form-check-label" id='option-text' htmlFor={"check_" + x}>
                                                                        {x}
                                                                    </label>
                                                                    </div>
                                                                    <div className='col-1 my-1'>
                                                                        <button type="button" className="btn btn-danger mx-1" onClick={() => deleteOption(quest.name, quest.options, x)}><i className="bi bi-x-lg"></i></button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </form>
                                                        <div className='col-11 my-4'>
                                                            <input type="text" className="form-control my-4" id='add-option-input' value={quest.currentOption} onChange={(event) => editOption(quest.name, event.target.value)} placeholder="Type a new option here."/>  
                                                            <button type="button" className="btn" id='add-option-button' onClick={() => {addNewOption(quest.name, quest.currentOption); editOption(quest.name, "")}}>Add Option</button>     
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className='relative w-full p-4'>
                                <button type="button" className="btn" id='add-question-button' onClick={() => addQuestion()}>Add Question</button>
                            </div>
                            <div className='relative w-full'>
                                <button type="button" className="btn" id='save-leave-quiz-button' onClick={() => onSave()}>Save and Leave Quiz</button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
 
export default QuizCreator;