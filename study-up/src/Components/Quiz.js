import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import '../quiz.scss'

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

const headerAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissable fade show" role="alert">`,
        `   <div style="display: inline-block">${message}</div>`,
        '</div>'
    ].join('')
    document.getElementById('liveAlertPlaceholder').append(wrapper)
}

const Quiz = () => {
    const {email, id} = useParams()
    const [quizQuestions, setQuizQuestions] = useState([])
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizTitle, setQuizTitle] = useState("Untitled")
    const [quizState, setQuizState] = useState("practicing");

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
                for (const quest of quiz.quizQuestions) {
                    const addQuest = {
                        name: quest.name,
                        label: quest.label,
                        type: quest.type,
                        options: quest.options,
                        correctAnswer: quest.correctAnswer,
                        userAnswer: ""
                    }
                    quizAnswers.push(addQuest)
                }
            }
        })
    }

    const tryAgain = () => {
        document.getElementById('liveAlertPlaceholder').innerHTML = ""
        for (const quest of quizAnswers) {
            quest.userAnswer = ""
        }
    }

    const updateChoiceAnswer = (questName) => {
        const questField = [...quizAnswers]
        const questIndex = questField.findIndex(q => q.name === questName)

        if (questIndex !== -1) {
            const radios = document.getElementsByTagName('input');
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].type === 'radio' && radios[i].checked) {
                    questField[questIndex].userAnswer = radios[i].value
                    setQuizAnswers(questField)      
                }
            }
        }
    }

    const updateShortAnswer = (questName, value) => {
        const questField = [...quizAnswers]
        const questIndex = questField.findIndex(q => q.name === questName)
        if (questIndex !== -1) {
            questField[questIndex].userAnswer = value     
            setQuizAnswers(questField)
        }
    }

    const submitQuiz = () => {
        let emptyAnswers = []
        let correctCount = 0
        document.getElementById('liveAlertPlaceholder').innerHTML=''
        for (const quest of quizAnswers) {
            if (quest.userAnswer === "") {
                emptyAnswers.push(quest.name)
            }
            if (quest.userAnswer === quest.correctAnswer) {
                ++correctCount
            }
        }
        if (emptyAnswers.length > 0) {
            let emptyAnswersString = ""
            for (var i = 0; i < emptyAnswers.length; i++) {
                if (i === emptyAnswers.length - 1) {
                    emptyAnswersString += emptyAnswers[i] + "."
                }
                else {
                    emptyAnswersString += emptyAnswers[i] + ", "
                }
            }
            if (emptyAnswers.length === 1) {
                alert(`<i class="bi-exclamation-circle"></i> The following question must be answered: ${emptyAnswersString}`, 'danger')
            }
            else {
                alert(`<i class="bi-exclamation-circle"></i> The following questions must be answered: ${emptyAnswersString}`, 'danger')
            }
        }
        else {
            setQuizState("submitted")
            const percentScore = Number(Math.round((100 * correctCount) / quizAnswers.length + 'e2')+'e-2')
            headerAlert(`<h4> Quiz Score: ${percentScore}% (${correctCount}/${quizAnswers.length}) </h4>`, 'info')
        }
    }

    useEffect(() => {
        getQuizInfo()
    }, [])

    return (
        <div className='container mx-auto px-4 h-screen' data-testid='QuizID'>
            {(() => {
                switch (quizState) {
                    case "return":
                        return (<Navigate to={`/dashboard/${email}`}/>)                        
                    case "submitted":
                        return (
                        <>
                            <div className='row my-2'>
                                <div id="liveAlertPlaceholder"></div>
                            </div>
                            <div className='row'>
                                <div className='rounded-md p-3' id='header-bg'>
                                    <div className='col-11'> <label><h3 id='quiz-title-text'>{quizTitle}</h3></label> </div>
                                </div>
                                {
                                    quizAnswers.map((quest) => {
                                        return (
                                            <div key={quest.name} className='rounded-md p-5 my-15' id='question-bg'>
                                                <div className='flex justify-between items-center space-y-2'>
                                                    <div className="row block text-sm font-medium text-gray-700">
                                                        <div className='col-11'> <label id='quest-title-text'>{quest.name + ": " + quest.label}</label> </div>
                                                    </div>
                                                </div>

                                                <div className='my-4'>
                                                    {
                                                        quest.type === "short answer" &&
                                                        <div>
                                                            <div className='col-11'> <input type="text" className="form-control" id='short-answer-input' placeholder="Type your answer here." value={quest.userAnswer} disabled/> </div>
                                                            {quest.userAnswer === quest.correctAnswer ?
                                                                (
                                                                    <div className="alert alert-success my-2" role="alert">
                                                                        Your answer of "{quest.correctAnswer}" is correct!
                                                                    </div>
                                                                ) : 
                                                                (
                                                                    <div className="alert alert-danger my-2" role="alert">
                                                                        Your answer above is incorrect! The correct answer is "{quest.correctAnswer}."
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    }
                                                    {
                                                        quest.type === "multiple choice" && 
                                                        <div className='my-4 flex flex-col space-y-2'>
                                                            <form>
                                                                {quest.options.map((x) =>
                                                                    <div key={x} className='row'> 
                                                                        <div className="col-11 form-check"> 
                                                                            <input className="form-check-input" type="radio" name="option" id="exampleRadios2" value={x} checked={x === quest.userAnswer ? true : false} disabled/>
                                                                            <label className="form-check-label" htmlFor="exampleRadios2" id='option-text'>
                                                                                {x}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </form>
                                                            {quest.userAnswer === quest.correctAnswer ?
                                                                (
                                                                    <div className="alert alert-success my-2" role="alert">
                                                                        Your answer of "{quest.correctAnswer}" is correct!
                                                                    </div>
                                                                ) : 
                                                                (
                                                                    <div className="alert alert-danger my-2" role="alert">
                                                                        Your answer above is incorrect! The correct answer is "{quest.correctAnswer}."
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='relative w-full my-5'>
                                <button type="button" className="btn mx-4"  id='return-button' onClick={() => setQuizState("return")}>Return to Dashboard</button>
                                <button type="button" className="btn" id='try-again-button' onClick={() => {setQuizState("practicing"); tryAgain()}}>Try Again</button>
                            </div>   
                        </>)
                    case "practicing":
                        return (
                        <>
                            <div className='row my-2'>
                                <div id="liveAlertPlaceholder"></div>
                            </div>
                            <div className='row'>
                                <div className='rounded-md p-3' id='header-bg'>
                                    <div className='col-11'> <label><h3 id='quiz-title-text'>{quizTitle}</h3></label> </div>
                                </div>
                                {
                                    quizQuestions.map((quest) => {
                                        return (
                                            <div key={quest.name} className='rounded-md p-5 my-15' id='question-bg'>
                                                <div className='flex justify-between items-center space-y-2'>
                                                    <div className="row block text-sm font-medium text-gray-700">
                                                        <div className='col-11'> <label id='quest-title-text'>{quest.name + ": " + quest.label}</label> </div>
                                                    </div>
                                                </div>

                                                <div className='my-4'>
                                                    {
                                                        quest.type === "short answer" && <div className='col-11'> <input type="text" className="form-control" id='short-answer-input' placeholder="Type your answer here." onChange={(event) => updateShortAnswer(quest.name, event.target.value)}/> </div>
                                                    }
                                                    {
                                                        quest.type === "multiple choice" && 
                                                        <div className='my-4 flex flex-col space-y-2'>
                                                            <form>
                                                                {quest.options.map((x) =>
                                                                    <div key={x} className='row'> 
                                                                        <div className="col-11 form-check">
                                                                            <input className="form-check-input" type="radio" name="option" id="exampleRadios2" onChange={() => updateChoiceAnswer(quest.name)} value={x}/>
                                                                            <label className="form-check-label" htmlFor="exampleRadios2" id='option-text'>
                                                                                {x}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </form>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='relative w-full my-5'>
                                <button type="button" className="btn" id='submit-quiz-button' onClick={() => submitQuiz()}>Submit Quiz</button>
                            </div>                        
                        </>)
                    default:
                        return null
                }
            })()}
        </div>
    )
}

export default Quiz