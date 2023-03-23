// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {render, screen, fireEvent, userEvent} from '@testing-library/react'
import Counter from '../../components/counter'

//MAKES THINGS MORE REFACTOR FRIENDLY
// CAN FIND ROLE AND NAME FROM CSS ACCESIBILTY TAB

test('counter increments and decrements when the buttons are clicked', () => {
  // const {container} = render(<Counter />)
  render(<Counter />) // container no longer needed as screen doing the work
  // 🐨 replace these with screen queries
  // 💰 you can use `getByText` for each of these (`getByRole` can work for the button too)
  // const [decrement, increment] = container.querySelectorAll('button')
  const increment = screen.getByRole('button', {name: 'Increment'}) // can also regex /decremnet/i (so case does not matter)
  const decrement = screen.getByRole('button', {name: 'Decrement'})
  const message = screen.getByText(/current count/i) //regex example

  expect(message).toHaveTextContent('Current count: 0')
  // fireEvent.click(increment)
  userEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  // fireEvent.click(decrement)
  userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
