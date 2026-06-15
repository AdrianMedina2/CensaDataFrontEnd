import { render, screen } from '@testing-library/react';
import React from 'react';

function Hola() {
    return <h1>Hola Adrian</h1>;
}

test('renderiza saludo', () => {
    render(<Hola />);
    expect(screen.getByText('Hola Adrian')).toBeInTheDocument();
});
