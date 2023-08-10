export const checkLogin = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(process.env.API_URL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      const result = await response.json();

      if (result.decoded.role === 1) {
          window.location = '/admin'
      } else if (result.decoded.role === 2) {
          window.location = '/admin'
      } else if (result.decoded.role === 3) {
          window.location = '/'
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
