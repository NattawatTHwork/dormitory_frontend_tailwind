export const checkLogin = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(process.env.API_URL + '/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    const result = await response.json();

    if (result.status === 'success' && result.decoded.role === 3) {
      return result.decoded;
    } else {
      localStorage.removeItem('token');
      window.location = '/signin';
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
