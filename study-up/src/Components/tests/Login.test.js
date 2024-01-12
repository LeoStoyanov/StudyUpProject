import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login'

test('Should render Login component.', () => { 
    render(<Login />, {wrapper: MemoryRouter});
    const login = screen.getByTestId("LoginID")
    expect(login).toBeInTheDocument()
}) 