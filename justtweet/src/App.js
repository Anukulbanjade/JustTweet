import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChakraProvider, Box, Container, Heading, Text, Textarea, Button, Flex, Spacer, IconButton, useToast } from '@chakra-ui/react';
import { FaTwitter, FaPaperPlane, FaUserCircle, FaTrashAlt } from 'react-icons/fa';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const [tweetCounter, setTweetCounter] = useState(0);
  const toast = useToast();

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
      toast({
        title: "Tweet content is empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post(`${mongodb_url}/tweets`, { content: newTweet });
      setNewTweet('');
      fetchTweets();
      toast({
        title: "Tweet posted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating tweet:', error);
      toast({
        title: "Failed to post tweet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTweetDelete = async (id) => {
    try {
      await axios.delete(`${mongodb_url}/tweets/${id}`);
      fetchTweets();
      toast({
        title: "Tweet deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting tweet:', error);
      toast({
        title: "Failed to delete tweet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh">
        <Container maxW="xl" py="8">
          <Box bg="white" p="6" borderRadius="lg" boxShadow="lg">
            <Flex align="center" mb="4">
              <FaTwitter color="blue.500" fontSize="3xl" />
              <Heading as="h1" size="lg" ml="2">JustTweet</Heading>
              <Spacer />
              <Box>
                <Text fontWeight="bold">Tweets: {tweetCounter}</Text>
              </Box>
            </Flex>
            <Textarea
              placeholder="What's happening?"
              value={newTweet}
              onChange={handleTweetChange}
              rows="3"
              mb="4"
            />
            <Button
              colorScheme="blue"
              leftIcon={<FaPaperPlane />}
              onClick={handleTweetSubmit}
              mb="4"
            >
              Tweet
            </Button>
            {tweets.map((tweet, index) => (
              <Box key={tweet._id} bg="white" p="4" mb="4" borderRadius="md" boxShadow="md">
                <Flex align="center">
                  <FaUserCircle color="gray.500" fontSize="xl" />
                  <Text ml="2">{tweet.content}</Text>
                  <Spacer />
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete Tweet"
                    icon={<FaTrashAlt />}
                    onClick={() => handleTweetDelete(tweet._id)}
                  />
                </Flex>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
