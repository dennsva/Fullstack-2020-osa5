import React, { useState } from 'react'

const Blog = ({
  blog,
  likeBlog,
  showRemove = true,
  deleteBlog
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDeleteBlog = (event) => {
    event.preventDefault()
    if (!window.confirm(`Are you sure you want to remove the blog "${blog.title}" by ${blog.author}?`)) return
    deleteBlog()
  }

  const [long, setLong] = useState(false)

  const whenLong = { display: long ? '' : 'none' }
  const whenShowRemove = { display: showRemove ? '' : 'none' }

  const toggleLong = () => {
    setLong(!long)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleLong}>{long ? 'hide' : 'view'}</button>
      <div style={whenLong} className="whenLong">
        {blog.url} <br />
        {blog.likes} likes <button onClick={likeBlog}>like</button> <br />
        {blog.user ? blog.user.name : 'unknown user'}<br/>
        <button style={whenShowRemove} onClick={handleDeleteBlog} color="blue">remove</button>
      </div>
    </div>
  )
}

export default Blog