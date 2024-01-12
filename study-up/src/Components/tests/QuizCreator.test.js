import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import QuizCreator from '../QuizCreator'

test('Should render Quiz Creator component.', () => { 
    render(<QuizCreator />, {wrapper: MemoryRouter});
    const quizCreator = screen.getByTestId("QuizCreatorID")
    expect(quizCreator).toBeInTheDocument()
}) 