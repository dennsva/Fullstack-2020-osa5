import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogList(blogs))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortBlogList = list => {
    return list.sort((a, b) => {
      return b.likes - a.likes || a.title.localeCompare(b.title)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.setVisible(false)
      const addedBlog = await blogService.create(blogObject)
      setBlogs(sortBlogList(blogs.concat(addedBlog)))

      setInfoMessage(`added blog "${addedBlog.title}" by ${addedBlog.author}`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogId, blogObject) => {
    try {
      const newBlog = await blogService.update(blogId, blogObject)
      setBlogs(sortBlogList(blogs.map(blog => blog.id === blogId ? newBlog : blog)))
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (blogId) => {
    try {
      const blog = await blogService.get(blogId)
      await updateBlog(blogId, {
        likes: blog.likes + 1
      })
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to like blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <Notification message={infoMessage} color="green" />
      <Notification message={errorMessage} color="red" />

      {user === null
        ? loginForm()
        : <div>

          <form onSubmit={handleLogout}>
            logged in as {user.name}
            <button type="submit">logout</button>
          </form>
          
          <div>
            <h2>blogs</h2>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                likeBlog={() => likeBlog(blog.id)}
              />
            )}
          </div>
          
          <Togglable buttonLabel="add blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      }
    </div>
  )
}

export default App