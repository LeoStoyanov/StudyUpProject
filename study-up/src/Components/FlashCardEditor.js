import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import React from "react";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import '../flash.scss'

const FlashCardEditor = () => {
  const { email, id } = useParams()
  const [flashCards, setFlashCards] = useState([])
  const [flashTitleEdited, setFlashTitleEdited] = useState(false)
  const [flashTitle, setFlashTitle] = useState("Untitled")
  const [onSaved, setOnSaved] = useState(false)
  const [flashState, setFlashState] = useState("edit")
  
  const addCard = () => {
    const cardContents = {
      "id": `${uuidv4()}`,
      "cardNum": `${flashCards.length + 1}`,
      "cardTitle": "",
      "contents": "",
    }
    setFlashCards([...flashCards, cardContents])
  }

  //Always one card present
  if (flashCards.length === 0) {
    addCard()
  }

  const editTitle = (cardPlace, flashCardTitle) => {
    const cardField = [...flashCards]
    const cardIndex = cardField.findIndex(c => c.cardNum === cardPlace)
    if (cardIndex !== -1) {
      cardField[cardIndex].cardTitle = flashCardTitle
      setFlashCards(cardField)
    }
  }

  const editBody = (cardPlace, cardBody) => {
    const cardField = [...flashCards]
    const cardIndex = cardField.findIndex(c => c.cardNum === cardPlace)
    if (cardIndex !== -1) {
      cardField[cardIndex].contents = cardBody
      setFlashCards(cardField)
     
    }

  }

  const deleteCard = (cardPlace) => {
    const cardField = [...flashCards]
    const cardIndex = cardField.findIndex(c => c.id === cardPlace)

    if (cardIndex !== -1) {
      if (cardIndex < cardField.length - 1) {
        for (var i = cardIndex + 1; i < cardField.length; i++) {
          cardField[i].cardNum = `${i}`
        }
      }
      cardField.splice(cardIndex, 1)
      setFlashCards(cardField)
    }
  }

  const getCardInfo = () => {
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

  const onSave = (v) => {
    const updatedFlash = {
      id: `${id}`,
      email: `${email}`,
      flashTitle: flashTitle,
      flashCards: flashCards
    }
    axios.post("http://localhost:4000/app/updateflash", updatedFlash)
      .then(res => {
        if (res.data.status === "ok") {
          setOnSaved(true)
        }
        else {
          console.log("Error saving flashcards!")
        }
      })
    if (v === "view") {
      setFlashState("view")
    }
    else if (v === "return") {
      setFlashState("return")
    }
  }

  useEffect(() => {
    getCardInfo()
  }, [])

  const pressedFlashEnter = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      setFlashTitle("")
    }
  }




  return (

    <div className='container mx-auto px-4 h-screen'>
      {(() => {
        switch (flashState) {
          case "return":
            return (<Navigate to={`/dashboard/${email}`} />)
          case "view":
            return (<Navigate to={`/flashcard/${email}/${id}`} />)
          case "edit":
            return (
              <section>
                <div className='container' data-testid='FlashCardEditID'>
                  <div className='row'>
                    <h1 id="flash-title-text">Flash Card Editor</h1>
                  </div>
                  {/* Title */}
                  <div className='row'>
                    
                      {flashTitleEdited ?
                        <div className='col-11 input-group mb-3'>
                          <input type="text" id="flash-title-input" className="form-control"  value={flashTitle} onChange={(event) => setFlashTitle(event.target.value)} onBlur={() => setFlashTitleEdited(false)} onKeyDown={(event) => pressedFlashEnter(event)} />
                        </div>
                        : 
                        <div className='col-11' onClick={() => setFlashTitleEdited(true)}> 
                          <label><h3 id="flash-title-text">{flashTitle === 0 ? "Title: Untitled" : "Title: " + flashTitle}</h3></label> 
                        </div>
                      }
                    
                  </div>
                  <br />
                  {/* The buttons up top */}
                  <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group me-2" role="group" aria-label="First group">
                      <button type="button" className="btn" id="flash-button" onClick={() => addCard()}>Add New Card</button>
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Second group">
                      <button type="button" className="btn" id="flash-button" onClick={() => onSave("return")}>Save and Leave</button>
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Third group">
                      <button type="button" className="btn" id="flash-button" onClick={() => onSave("view")}>View</button>
                    </div>
                  </div>
                  <br />
                  {
                    // The Cards them selves 
                    flashCards.map((flash) => {
                      return (
                        <div key={flash.id} className="card my-2" id="flash-card-c">
                          <button type="button" className="btn btn-danger" style={{ width: "120px" }} onClick={() => deleteCard(flash.id)}>Remove Card</button>
                          <div className="text-start">
                            <div className="card-body">
                              <h5 className="card-title">
                                <input type="text" className="form-control" id="flash-cardtitle-input" value={flash.cardTitle} onChange={(event) => editTitle(flash.cardNum, event.target.value)} />
                              </h5>
                              <p className="card-text">
                                <textarea className="form-control" id="flash-cardbody-input" rows="5" value={flash.contents} onChange={(event) => editBody(flash.cardNum, event.target.value)} />
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </section >
            )
          default:
            return null
        }
      })()}
    </div>
  )
};




export default FlashCardEditor; 