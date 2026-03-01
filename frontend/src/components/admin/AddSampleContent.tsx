import React, { useState } from 'react';
import { apiClient } from '../../services/api';

const AddSampleContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const addSampleContent = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await apiClient.post('/api/sample/content');
      setMessage(response.data);
    } catch (error: any) {
      console.error('Error adding sample content:', error);
      setMessage(`Error: ${error.response?.data || error.message || 'Failed to add content'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-dark p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Add Sample Content</h3>
      <p className="text-gray-400 mb-4">
        This will add sample movies with YouTube videos to test the application.
      </p>
      
      {message && (
        <div className={`p-3 rounded mb-4 ${
          message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {message}
        </div>
      )}
      
      <button
        onClick={addSampleContent}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Adding Content...' : 'Add Sample Content'}
      </button>
    </div>
  );
};

export default AddSampleContent;