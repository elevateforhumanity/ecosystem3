import React from 'react';
import { supabase } from './supabase/client';
import ExampleComponent from './components/ExampleComponent';

const App = () => {
  // Example usage of Supabase client
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('your_table_name')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Data fetched:', data);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to the New Ecosystem</h1>
      <ExampleComponent />
    </div>
  );
};

export default App;