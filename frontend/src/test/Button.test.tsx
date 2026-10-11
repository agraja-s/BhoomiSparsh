import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../components/ui/Button'

describe('Button Component', () => {
  it('renders children text correctly', () => {
    render(<Button>Click Action</Button>)
    const button = screen.getByRole('button', { name: /Click Action/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('Click Action')
  })

  it('renders in disabled state when disabled prop is true', () => {
    render(<Button disabled>Disabled Action</Button>)
    const button = screen.getByRole('button', { name: /Disabled Action/i }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('renders loading state and sets aria-busy', () => {
    render(<Button isLoading>Submit</Button>)
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(button.disabled).toBe(true)
  })
})
