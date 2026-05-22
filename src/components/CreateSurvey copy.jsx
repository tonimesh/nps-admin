import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { mockStores, mockSurveys } from '../utils/mockData';

const CreateSurvey = () => {
  const [surveyName, setSurveyName] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [header, setHeader] = useState('We value your feedback!');
  const [headerSubtext, setHeaderSubtext] = useState('Help us serve you better every day.');
  const [footer, setFooter] = useState('Your feedback is private • Better experience • Exclusive offers • We value your privacy');
  const [questions, setQuestions] = useState([
    { id: Date.now().toString(), text: 'How was the food?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
    { id: (Date.now() + 1).toString(), text: 'How was the service?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good'], required: true },
    { id: (Date.now() + 2).toString(), text: 'How was the ambience?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
    { id: (Date.now() + 3).toString(), text: 'How likely are you to recommend us to a friend or family?', type: 'nps', required: true },
    { id: (Date.now() + 4).toString(), text: 'Any suggestions or additional comments?', type: 'text', required: false },
  ]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const questionTypes = [
    { value: 'rating', label: 'Rating Scale (1-5)' },
    { value: 'nps', label: 'NPS Scale (0-10)' },
    { value: 'text', label: 'Text Input' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: 'New Question',
      type: 'rating',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!surveyName || !selectedStore) {
      alert('Please fill in survey name and select a store');
      return;
    }

    const store = mockStores.find(s => s.id === selectedStore);
    const newSurvey = {
      id: `survey${mockSurveys.length + 1}`,
      name: surveyName,
      storeId: selectedStore,
      storeName: store.name,
      brand: store.brand,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      responses: 0,
      npsScore: null,
      header: header,
      headerSubtext: headerSubtext,
      footer: footer,
      questions: questions,
    };

    mockSurveys.push(newSurvey);
    alert('Survey created successfully!');
    
    // Reset form
    setSurveyName('');
    setSelectedStore('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
        <p className="text-gray-500 mt-1">Design your customer feedback survey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Survey Name</label>
              <input
                type="text"
                value={surveyName}
                onChange={(e) => setSurveyName(e.target.value)}
                className="input-field"
                placeholder="e.g., Customer Experience Survey"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a store...</option>
                {mockStores.map(store => (
                  <option key={store.id} value={store.id}>{store.name} - {store.location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Header & Footer */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Header & Footer</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Title</label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Subtext</label>
              <input
                type="text"
                value={headerSubtext}
                onChange={(e) => setHeaderSubtext(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
              <textarea
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="input-field"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Survey Questions</h3>
            <button type="button" onClick={addQuestion} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <GripVertical size={20} className="text-gray-400 cursor-move" />
                    <span className="font-medium text-gray-900">Question {index + 1}</span>
                    <span className="text-sm text-gray-500">{questionTypes.find(t => t.value === question.type)?.label}</span>
                    {question.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedQuestion === question.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {expandedQuestion === question.id && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          className="input-field"
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Required question</span>
                        </label>
                      </div>
                    </div>

                    {(question.type === 'multiple_choice' || question.type === 'rating') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        <div className="space-y-2">
                          {question.options?.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(question.id, 'options', newOptions);
                                }}
                                className="input-field"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = question.options.filter((_, i) => i !== optIndex);
                                  updateQuestion(question.id, 'options', newOptions);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...(question.options || []), 'New Option'];
                              updateQuestion(question.id, 'options', newOptions);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn-secondary">Save as Draft</button>
          <button type="submit" className="btn-primary">Create Survey</button>
        </div>
      </form>
    </div>
  );
};

export default CreateSurvey;