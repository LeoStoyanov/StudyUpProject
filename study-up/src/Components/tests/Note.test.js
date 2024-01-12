import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import Note from '../Note'

test('Should render note component.', () => { 
    render(<Note />, {wrapper: MemoryRouter});
    const note = screen.getByTestId("NoteID")
    expect(note).toBeInTheDocument()
}) 

