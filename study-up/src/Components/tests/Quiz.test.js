import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import Quiz from '../Quiz'

test('Should render Quiz component.', () => { 
    render(<Quiz />, {wrapper: MemoryRouter});
    const quiz = screen.getByTestId("QuizID")
    expect(quiz).toBeInTheDocument()
}) 