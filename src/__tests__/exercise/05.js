// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// const server = setupServer(
//   rest.post(
//     'https://auth-provider.example.com/api/login',
//     async (req, res, ctx) => {
//       if (!req.body.password) {
//         return res(ctx.status(400), ctx.json({message: 'password required'}))
//       }
//       if (!req.body.username) {
//         return res(ctx.status(400), ctx.json({message: 'username required'}))
//       }
//       return res(ctx.json({username: req.body.username}))
//     },
//   ),
// )

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterAll(() => server.close())

afterEach(() => server.resetHandlers()) // we overwrote the handlers in the server error test, doesnt matter
// here as the error is the last test, but if this was higher we would have a problem

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/

// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`
describe('HI IM A DESCRIBE BLOCK', () => {
  test(`logging in displays the user's username`, async () => {
    render(<Login />)
    const {username, password} = buildLoginForm()

    await userEvent.type(screen.getByLabelText(/username/i), username)
    await userEvent.type(screen.getByLabelText(/password/i), password)
    // 🐨 uncomment this and you'll start making the request!
    await userEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
    // screen.debug()

    expect(screen.getByText(username)).toBeInTheDocument() // this was the fake user name

    // as soon as the user hits submit, we render a spinner to the screen. That
    // spinner has an aria-label of "loading" for accessibility purposes, so
    // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved

    // once the login is successful, then the loading spinner disappears and
    // we render the username.
    // 🐨 assert that the username is on the screen
  })

  test('omitting the password results in an error', async () => {
    render(<Login />)
    const {username} = buildLoginForm()

    await userEvent.type(screen.getByLabelText(/username/i), username)
    // no passwords
    await userEvent.click(screen.getByRole('button', {name: /submit/i}))
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
    // screen.debug()

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"password required"`,
    )
  })
})

test('unknown  server error display the error message', async () => {
  const testErrorMessage = 'Oh no, something bad happened'

  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)

  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // screen.debug()

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
