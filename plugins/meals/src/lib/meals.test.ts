import { describe, it, expect } from 'vitest'
import { needsPushLabel, needsPushOutcome } from './meals'

describe('needsPushLabel', () => {
  it('counts the things, singular and plural', () => {
    expect(needsPushLabel(1)).toBe('1 thing needed')
    expect(needsPushLabel(3)).toBe('3 things needed')
  })
})

describe('needsPushOutcome', () => {
  const result = { listId: 'l1', listName: 'Grocery', filed: 0, alreadyOn: 0 }

  it('names the destination, because the push chose it and the person did not', () => {
    expect(needsPushOutcome({ ...result, filed: 2 })).toBe('2 things sent to Grocery')
  })

  it('states both halves — a person who sent four and saw "3 sent" is left guessing', () => {
    expect(needsPushOutcome({ ...result, filed: 3, alreadyOn: 1 })).toBe(
      '3 things sent to Grocery · 1 already on it'
    )
  })

  it('says nothing moved rather than reporting a success of zero', () => {
    expect(needsPushOutcome({ ...result, alreadyOn: 2 })).toBe('Already on Grocery')
  })
})
