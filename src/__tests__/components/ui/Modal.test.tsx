import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '@/components/ui/Modal'
import '@testing-library/jest-dom'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Hidden Content</div>
      </Modal>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true with correct title and content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Close Test</div>
      </Modal>
    )
    fireEvent.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies correct width class based on prop', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} width="lg">
        <div>Width Test</div>
      </Modal>
    )
    expect(container.querySelector('.max-w-3xl')).toBeInTheDocument()
  })
})
