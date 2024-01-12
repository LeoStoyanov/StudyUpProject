import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import React from "react"
import '../notes.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    // options here
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['huge', 'large', false, 'small'] }],  // Sizes
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // Colors
    [{ 'align': [] }],

    ['clean']
  ]
}

const Note = () => {
  const { email, id } = useParams()
  const [noteTitleEdited, setNoteTitleEdited] = useState(false)
  const [noteTitle, setNoteTitle] = useState("Untitled")
  const [onSaved, setOnSaved] = useState(false)
  const [text, setText] = useState('')
  const [noteEditor, setNoteEditor] = useState()

  const handleChange = (value, delta, source, editor) => {
    setText(value)
    setNoteEditor(editor.getContents())
  }
  const handleTitle = (html) => {
    setNoteTitle(html)
  }
  const getNoteInfo = () => {
    const note = {
      id: `${id}`,
      email: `${email}`
    }
    axios.post("http://localhost:4000/app/getnote", note)
      .then(res => {
        if (res.data.status === "ok") {
          let note = res.data.noteInfo
          setNoteTitle(note.noteTitle)
          setText(note.noteEditor[0])
        }
      })
  }

  const onSave = () => {
    if (noteTitle === 0) {
      handleTitle("Untitled")
    }

    const updatedNote = {
      id: `${id}`,
      email: `${email}`,
      noteTitle: noteTitle,
      noteEditor: noteEditor
    }
    axios.post("http://localhost:4000/app/updateNote", updatedNote)
      .then(res => {
        if (res.data.status === "ok") {
          setOnSaved(true)
        }
        else {
          console.log("Error saving Notes!")
        }
      })
  }
  useEffect(() => {
    getNoteInfo()
  }, [])
  const pressedEnter = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      setNoteTitle("")
    }
  }

  return (
    <>
      {onSaved ? (
        <section>
          <Navigate to={`/dashboard/${email}`} />
        </section>
      ) : (
        <section id="note-wrap">
          <div id="note-wrap" data-testid='NoteID'>
            <div className="container-fluid justifyContent: flex-end">
              <div id="note-header" className='row'>
                <div className="col-4" />
                <div className="col-4 align-self-center">
                  {/* Title */}
                  {noteTitleEdited ?
                    <div>
                      <input type="text" id="note-title-input" className="form-control" value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} onBlur={() => setNoteTitleEdited(false)} onKeyDown={(event) => pressedEnter(event)} />
                    </div>
                    :
                    <div className='col-11' onClick={() => setNoteTitleEdited(true)}>
                      <label> <h3 id="note-title-text">{noteTitle === 0 ? "Untitled" : " " + noteTitle}</h3> </label>
                    </div>
                  }
                </div>
                {/* Save button */}
                <div className="return-button col-4 align-self-center">
                  <button type="button" id='save-notes-button' className="btn" onClick={() => onSave()}>Save and Leave</button>
                </div>
              </div>
            </div>
            <ReactQuill
              id="note-body-style"
              modules={modules}
              value={text}
              onChange={handleChange}
            />
          </div>          
        </section>
      )}
    </>
  )

}

export default Note;

