import { render, screen, cleanup } from '@testing-library/react'; 
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import CreateAcc from '../CreateAcc';

test('Should render CreateAcc component.', () => { 
    render(<CreateAcc />, {wrapper: MemoryRouter});
    const createAcc = screen.getByTestId("createAccID")
    expect(createAcc).toBeInTheDocument()
}) 