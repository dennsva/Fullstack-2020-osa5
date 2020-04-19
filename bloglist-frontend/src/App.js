import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const blog = {
      title,
      author,
      url,
    }

    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(blogs.concat(createdBlog))
      setInfoMessage(`added blog "${createdBlog.title}" by ${createdBlog.author}`)
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
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
          
          <div>
            <h2>create new</h2>
            <form onSubmit={handleCreateBlog}>
              <div>
                title:
                <input
                  type="text"
                  value={title}
                  name="Title"
                  onChange={({ target }) => setTitle(target.value)}
                />
              </div>
              <div>
                author:
                <input
                  type="text"
                  value={author}
                  name="Author"
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </div>
              <div>
                url:
                <input
                  type="text"
                  value={url}
                  name="URL"
                  onChange={({ target }) => setUrl(target.value)}
                />
              </div>
              <button type="submit">create</button>
            </form>
          </div>
        </div>
      }
    </div>
  )
}

export default App