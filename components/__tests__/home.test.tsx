import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders hero text', () => {
    render(<HomePage />)
    expect(screen.getByText(/Summit/i)).toBeInTheDocument()
  })
})
