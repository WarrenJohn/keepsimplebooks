// npm test
// npm run watch
const u = require('./utils');

test('Always true' ,() => {
    expect(true).toBe(true)
})

// Testing server side user registration validation
test('Check register user validation - object returned', () => {
    const errors = u.registerUser({email: 'testing@abc.com', password:'12345', confirmPassword: '12345'})
    // sends back an array with errors - if any
    expect(typeof errors).toBe('object')
})
test('Check register user validation - no errors', () => {
    const errors = u.registerUser({email: 'testing@abc.com', password:'12345', confirmPassword: '12345'})
    expect(errors.length).toEqual(0)
})

test('Check user invalid email', () => {
    const errors = u.registerUser({email: 'a@a', password:'12345', confirmPassword: '12345'})
    const expected = ['Email is not valid!']
    expect(errors).toEqual(expected)
})

test('Check user password incorrect', () => {
    const errors = u.registerUser({email: 'testing@abc.com', password:'1234-', confirmPassword: '12345'})
    const expected = ['Passwords do not match!']
    expect(errors).toEqual(expected)
})

test('Check user confirmPassword incorrect', () => {
    const errors = u.registerUser({email: 'testing@abc.com', password:'12345', confirmPassword: '1234-'})
    const expected = ['Passwords do not match!']
    expect(errors).toEqual(expected)
})

test('Check user password length', () => {
    const errors = u.registerUser({email: 'testing@abc.com', password:'1234', confirmPassword: '1234'})
    const expected = ['Password must be at least 5 characters!']
    expect(errors).toEqual(expected)
})

test('Check user all fields incorrect', () => {
    const errors = u.registerUser({email: 'a@a', password:'123', confirmPassword: '1234'})
    const expected = ['Email is not valid!', 'Passwords do not match!', 'Password must be at least 5 characters!']
    expect(errors).toEqual(expected)
})
