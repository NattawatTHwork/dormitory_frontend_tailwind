import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function option() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  console.log(selectedOption)
  console.log(options)

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(process.env.API_URL + '/users/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      const result = await response.json();

      if (result.status == 'success') {
        const userOptions = result.message.map((user) => ({
          value: user.user_id,
          label: user.first_name + ' ' + user.last_name,
        }));
        set(userOptions);
      } else {
        console.log('fetch data admin failed')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <Select
        defaultValue={room.user_id}
        onChange={setUserID}
        options={users}
      />
    </div>
  );
}