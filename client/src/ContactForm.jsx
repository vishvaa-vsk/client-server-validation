import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage, Flex, Heading } from '@chakra-ui/react';
import axios from 'axios';

export const BASE_URL = import.meta.env.MODE === "development" ? "http://127.0.0.1:5000/submit" : "/submit";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  const validateField = (name, value) => {
    let error = '';
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === 'name') {
      if (!value.trim()) {
        error = 'Name is required';
      } else if (value.length < 5) {
        error = 'Name must be at least 5 characters long';
      } else if (!nameRegex.test(value)) {
        error = 'Name can only contain letters and spaces';
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!emailRegex.test(value)) {
        error = 'Invalid email format';
      }
    }

    if (name === 'message') {
      if (!value.trim()) {
        error = 'Message is required';
      } else if(value.length < 10){
        error = 'Message Should be more than 10 characters';
      }
      else if (value.length > 300) {
        error = 'Message cannot be more than 300 characters';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate each field on change
    const error = validateField(name, value);
    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerMessage('');

    try {
      const response = await axios.post(BASE_URL+'/submit', formData);
      setServerMessage(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      }
    }
  };

  return (
    <Flex justify="center" align="center" minHeight="100vh" bg="gray.100">
      <Box maxW="500px" mx="auto" p={8} boxShadow="lg" borderRadius="md" bg="white">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Contact Form
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={formErrors.name} mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              autoComplete='off'
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={formErrors.email} mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              autoComplete='off'
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {formErrors.email && <FormErrorMessage>{formErrors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={formErrors.message} mb={4}>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              maxLength="300"
            />
            {formErrors.message && <FormErrorMessage>{formErrors.message}</FormErrorMessage>}
          </FormControl>

          {serverMessage && (
            <Box bg="green.100" p={4} mb={4} borderRadius="md">
              {serverMessage}
            </Box>
          )}

          <Button type="submit" colorScheme="blue" width="full" mt={4}>
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default ContactForm;
