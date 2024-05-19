import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { FaTwitter, FaPaperPlane, FaUserCircle, FaTrashAlt, FaRegCommentDots } from 'react-icons/fa';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const [tweetCounter, setTweetCounter] = useState(0);

  const mongodb_url = 'http://localhost:5000';

  useEffect(() => {
    fetchTweets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTweets();
    }, 10000); // Refresh tweets every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await axios.get(`${mongodb_url}/tweets`);
      setTweets(response.data.reverse()); // Reverse the order of tweets array
      setTweetCounter(response.data.length);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const handleTweetChange = (e) => {
    setNewTweet(e.target.value);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (newTweet.trim() === '') {
      return;
    }
    try {
      await axios.post(`${mongodb_url}/tweets`, { content: newTweet });
      setNewTweet('');
      fetchTweets();
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };

  const handleTweetDelete = async (id) => {
    try {
      await axios.delete(`${mongodb_url}/tweets/${id}`);
      fetchTweets();
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <FaTwitter className="app-logo" />
        <h1>JustTweet</h1>
        <div className="tweet-counter-container">
          <div className="tweet-counter-bg"></div>
          <div className="tweet-counter" style={{ width: `${tweetCounter * 10}%` }}>
            <FaRegCommentDots className="tweet-counter-icon" />
            <span>{tweetCounter}</span>
          </div>
        </div>
      </div>
      <div className="tweet-form-container">
        <form onSubmit={handleTweetSubmit} className="tweet-form">
          <textarea
            className="form-control tweet-input"
            placeholder="What's happening?"
            value={newTweet}
            onChange={handleTweetChange}
            rows="3"
          ></textarea>
          <button type="submit" className="btn btn-primary tweet-button">
            <FaPaperPlane className="tweet-icon" /> Tweet
          </button>
        </form>
      </div>
      <div className="tweet-list">
        {tweets.map((tweet, index) => (
          <div key={tweet._id} className={`tweet-card animated bounceIn${index}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="tweet-header">
              <FaUserCircle className="profile-icon" />
            </div>
            <p className="tweet-content">{tweet.content}</p>
            <button
              className="btn btn-danger btn-sm delete-button"
              onClick={() => handleTweetDelete(tweet._id)}
            >
              <FaTrashAlt className="delete-icon" /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
