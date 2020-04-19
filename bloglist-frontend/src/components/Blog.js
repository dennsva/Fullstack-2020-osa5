import React, { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [long, setLong] = useState(false)

  const whenLong = { display: long ? '' : 'none' }

  const toggleLong = () => {
    setLong(!long)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleLong}>{long ? 'hide' : 'view'}</button>
      <div style={whenLong}>
        {blog.url}<br />
        {blog.likes} likes
        <button onClick={likeBlog}>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog