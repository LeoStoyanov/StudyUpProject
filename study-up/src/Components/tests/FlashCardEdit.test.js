import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import FlashCardEdit from '../FlashCardEditor'

test('Should render Flash Card Edit component.', () => { 
    render(<FlashCardEdit />, {wrapper: MemoryRouter});
    const flashCardEdit = screen.getByTestId("FlashCardEditID")
    expect(flashCardEdit).toBeInTheDocument()
}) 

 