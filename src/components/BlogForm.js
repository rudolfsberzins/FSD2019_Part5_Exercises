import React from "react";

const BlogForm = ({
  givenSubmit,
  givenTitleValue,
  givenTitleHandle,
  givenAuthorValue,
  givenAuthorHandle,
  givenUrlValue,
  givenUrlHandle
}) => {
  return (
    <div>
      <form onSubmit={givenSubmit}>
        <div>
          title: <input value={givenTitleValue} onChange={givenTitleHandle} />
        </div>
        <div>
          author:
          <input value={givenAuthorValue} onChange={givenAuthorHandle} />
        </div>
        <div>
          url:
          <input value={givenUrlValue} onChange={givenUrlHandle} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
