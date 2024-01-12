import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import FlashCard from '../FlashCard'

test('Should render Fash Card component.', () => { 
    render(<FlashCard />, {wrapper: MemoryRouter});
    const flashCard = screen.getByTestId("FlashCardID")
    expect(flashCard).toBeInTheDocument()
}) 

