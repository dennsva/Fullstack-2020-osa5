import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('blog', () => {
  let component
  let likeHandler

  beforeEach(() => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }
    
    likeHandler = jest.fn()

    component = render(
      <Blog blog={blog} likeBlog={likeHandler}/>
    )
  })

  test('blog renders properly at beginning', () => {
  
    expect(component.container).toHaveTextContent(
      'React patterns'
    )
    expect(component.container).toHaveTextContent(
      'Michael Chan'
    )
    
    const div = component.container.querySelector('.whenLong')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, url and likes are shown', () => {
    
    expect(component.container).toHaveTextContent(
      'https://reactpatterns.com/'
    )
    expect(component.container).toHaveTextContent(
      '7'
    )

    const button = component.getByText('view')
    fireEvent.click(button)
    
    const div = component.container.querySelector('.whenLong')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if like button is pressed twice, event handler is called twice', () => {
    const mockHandler = jest.fn()

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })

})