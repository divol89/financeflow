// // pages/api/twitter.js
// import axios from 'axios';

// export default async function handler(req, res) {
//   const bearerToken = process.env.NEXT_TWITTER_BEARER_TOKEN;
//   const username = req.query.username;

//   try {
//     const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`
//       }
//     });

//     const userId = userResponse.data.data.id;

//     const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`
//       }
//     });

//     res.status(200).json(tweetsResponse.data);
//   } catch (error) {
//     console.error('Error fetching data from Twitter API:', error.message);
//     res.status(500).json({ error: 'Error fetching data from Twitter API' });
//   }
// }
import axios from 'axios';

export default async function handler(req, res) {
  const bearerToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;
  const username = req.query.username;

  try {
    const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    const userId = userResponse.data.data.id;

    const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    res.status(200).json(tweetsResponse.data);
  } catch (error) {
    console.error('Error fetching data from Twitter API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ error: 'Error fetching data from Twitter API', details: error.message });
  }
}



// import axios from 'axios';

// export default async function handler(req, res) {
//   const userId = req.query.userId;
//   const accessToken = req.headers.authorization;

//   try {
//     const response = await axios.get(`https://api.twitter.com/2/users/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching data from Twitter API:', error.message);
//     res.status(error.response?.status || 500).json({ error: 'Error fetching data from Twitter API', details: error.message });
//   }
// }
