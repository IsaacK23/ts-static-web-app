import React, { useEffect, useState } from 'react';

const StudentCount: React.FC = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/students/count')
      .then(res => res.text())
      .then(text => setMessage(text))
      .catch(() => setMessage('Error fetching student count.'));
  }, []);

  return <div className="container"><p>{message}</p></div>;
};

export default StudentCount;