import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BACKEND from  "./config"

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login page if no token found
      }

      try {
        const response = await axios.get(`${BACKEND}/protected`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message);
      } catch (err) {
        navigate('/'); // Redirect to login if token is invalid
      }
    };

    fetchData();
  }, [navigate]);

  return <div>{message}</div>;
};

export default Dashboard;
