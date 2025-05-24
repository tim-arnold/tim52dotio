import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '../src/components/Navigation'

describe('Navigation', () => {
  it('renders navigation with correct aria labels', () => {
    render(<Navigation />)
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
    
    const skipLink = screen.getByText(/skip to main content/i)
    expect(skipLink).toBeInTheDocument()
    
    const logo = screen.getByRole('link', { name: /tim52\.io - home page/i })
    expect(logo).toBeInTheDocument()
  })

  it('toggles menu when hamburger button is clicked', () => {
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(menuButton)
    
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu')
  })

  it('handles keyboard navigation correctly', () => {
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(menuButton)
    
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    
    // Test escape key closes menu
    fireEvent.keyDown(menu, { key: 'Escape' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes menu when menu item is clicked', () => {
    render(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(menuButton)
    
    const homeLink = screen.getByRole('menuitem', { name: /home/i })
    fireEvent.click(homeLink)
    
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})