import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16
  };
  return (
    <div style={footerStyle}>
      <br />
      <em> Blog app, Department of Informatics, Intomics A / S, 2019 </em>
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setTitle] = useState("");
  const [newAuthor, setAuthor] = useState("");
  const [newUrl, setUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showMessage = (inputString, errorSwitch) => {
    setMessage(inputString);
    setIsError(errorSwitch);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleTitleChange = event => setTitle(event.target.value);
  const handleAuthorChange = event => setAuthor(event.target.value);
  const handleUrlChange = event => setUrl(event.target.value);

  const addBlog = async event => {
    event.preventDefault();
    const foundBlog = blogs.filter(blog => blog.url === newUrl);
    if (foundBlog.length !== 0) {
      showMessage(`Blog ${foundBlog[0].title} already added!`, true);
      setTitle("");
      setAuthor("");
      setUrl("");
    } else {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      };

      try {
        const createdBlog = await blogService.create(blogObject);
        setBlogs(blogs.concat(createdBlog));
        showMessage(`Added ${createdBlog.title} from ${createdBlog.author}!`);
        setTitle("");
        setAuthor("");
        setUrl("");
      } catch (exception) {
        showMessage(`Error occurred!`, true);
        setTitle("");
        setAuthor("");
        setUrl("");
      }
    }
  };

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      showMessage("Wrong Credentials!", true);
    }
  };

  const rows = () => blogs.map(blog => <Blog key={blog.id} blog={blog} />);

  const handleLogout = event => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        ></input>
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        ></input>
      </div>
      <button type="submit"> login </button>
    </form>
  );

  const blogSection = () => (
    <div>
      <h1> Blogs </h1>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <p></p>
      <BlogForm
        givenSubmit={addBlog}
        givenTitleValue={newTitle}
        givenTitleHandle={handleTitleChange}
        givenAuthorValue={newAuthor}
        givenAuthorHandle={handleAuthorChange}
        givenUrlValue={newUrl}
        givenUrlHandle={handleUrlChange}
      />
      <ul> {rows()} </ul>
    </div>
  );

  return (
    <div>
      <Notification message={message} isError={isError} />
      {user === null ? (
        <div>
          <h2>Login</h2>
          {loginForm()}
        </div>
      ) : (
        blogSection()
      )}
      <Footer />
    </div>
  );
};

export default App;
