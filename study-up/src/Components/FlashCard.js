import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const FlashCard = () => {
    const { email, id } = useParams()
    const [flashCards, setFlashCards] = useState([])
    const [flashTitle, setFlashTitle] = useState("Untitled")
    const [flashState, setFlashState] = useState("view")


    const getFlashInfo = () => {
        const flash = {
            id: `${id}`,
            email: `${email}`
        }
        axios.post("http://localhost:4000/app/getflash", flash)
            .then(res => {
                if (res.data.status === "ok") {
                    let flash = res.data.flashInfo
                    setFlashTitle(flash.flashTitle)
                    setFlashCards(flash.flashCards)
                }
            })
    }

    useEffect(() => {
        getFlashInfo()
    }, [])

    return (
        <div className='container mx-auto px-4 h-screen'>
            {(() => {
                switch (flashState) {
                    case "return":

                        return (<Navigate to={`/dashboard/${email}`} />)
                    case "edit":
                        return (<Navigate to={`/flashcardedit/${email}/${id}`} />)
                    case "view":
                        return (
                            <>
                                <section data-testid='FlashCardID'>
                                    <br />
                                    <h1 id="flash-title-text">
                                        {flashTitle}
                                    </h1>

                                    {/* The buttons up top */}
                                    <div className="btn-toolbar  justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                                        <div className="btn-group me-2" role="group" aria-label="First group">
                                            <button type="button" className="btn" id="flash-button" onClick={() => setFlashState("return")}>Return to Dashboard</button>
                                        </div>
                                        <div className="btn-group me-2" role="group" aria-label="Second group">
                                            <button type="button" className="btn" id="flash-button" onClick={() => setFlashState("edit")}>Edit</button>
                                        </div>
                                    </div>
                                    <br />
                                    {
                                        flashCards.map((flash) => {
                                            return (
                                                <div key={flash.id} className="card my-2" id="flash-card-c">
                                                    <                   div id={`carouselID${flash.cardNum}`} className="carousel slide carousel-fade" data-bs-interval="false">
                                                        <div className="carousel-inner">
                                                            <div className="carousel-item active" data-bs-interval="false">
                                                                <div className="container">
                                                                    <div className="col-10 align-self-start" >
                                                                        <h3 id="flash-text-a">{flash.cardTitle}</h3>
                                                                    </div>
                                                                    <div className="col-1 align-self-end" >
                                                                        <button className="carousel-control-next" type="button" data-bs-target={`#carouselID${flash.cardNum}`} data-bs-slide="next">
                                                                            <label className="btn" id="show-content" aria-hidden="true">Q</label>
                                                                            <span className="visually-hidden">Next</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="carousel-item" data-bs-interval="false">
                                                                <div className="container">
                                                                    <div className="col-10 align-self-start" >
                                                                        <textarea disabled id="flash-text-s" value={flash.contents}></textarea>
                                                                    </div>
                                                                    <div className="col-1 align-self-end">
                                                                        <div className="carousel-control-next" type="button" data-bs-target={`#carouselID${flash.cardNum}`} data-bs-slide="next">
                                                                            <label className="btn" id="show-title" aria-hidden="true"> A </label>
                                                                            <span className="visually-hidden">Next</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                </section>
                            </>)
                    default:
                        return null
                }
            })()}
        </div>
    )
}


export default FlashCard; 