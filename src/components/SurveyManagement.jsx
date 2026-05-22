import React, { useState } from 'react';
import { Play, StopCircle, Edit, Plus, Trash2, Eye, MoreVertical, Search, Filter } from 'lucide-react';
import { mockSurveys } from '../utils/mockData';

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState(mockSurveys);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'rating', required: false });

  const toggleSurveyStatus = (surveyId) => {
    setSurveys(surveys.map(survey =>
      survey.id === surveyId
        ? { ...survey, status: survey.status === 'active' ? 'paused' : 'active' }
        : survey
    ));
  };

  const addQuestionToSurvey = () => {
    if (selectedSurvey && newQuestion.text) {
      const updatedSurveys = surveys.map(survey =>
        survey.id === selectedSurvey.id
          ? {
              ...survey,
              questions: [
                ...survey.questions,
                {
                  id: Date.now().toString(),
                  text: newQuestion.text,
                  type: newQuestion.type,
                  required: newQuestion.required,
                  options: newQuestion.type === 'rating' ? ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'] : undefined,
                }
              ]
            }
          : survey
      );
      setSurveys(updatedSurveys);
      setNewQuestion({ text: '', type: 'rating', required: false });
      setShowAddQuestion(false);
      alert('Question added successfully!');
    }
  };


  // Add these functions to the SurveyManagement component
const moveQuestionUp = (surveyId, questionIndex) => {
  const survey = surveys.find(s => s.id === surveyId);
  if (questionIndex > 0) {
    const newQuestions = [...survey.questions];
    [newQuestions[questionIndex], newQuestions[questionIndex - 1]] = 
      [newQuestions[questionIndex - 1], newQuestions[questionIndex]];
    
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, questions: newQuestions } : s
    ));
  }
};

const moveQuestionDown = (surveyId, questionIndex, totalQuestions) => {
  const survey = surveys.find(s => s.id === surveyId);
  if (questionIndex < totalQuestions - 1) {
    const newQuestions = [...survey.questions];
    [newQuestions[questionIndex], newQuestions[questionIndex + 1]] = 
      [newQuestions[questionIndex + 1], newQuestions[questionIndex]];
    
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, questions: newQuestions } : s
    ));
  }
};

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>;
      case 'paused':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Paused</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Survey Management</h1>
        <p className="text-gray-500 mt-1">Manage, monitor, and control your active surveys</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="card hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{survey.name}</h3>
                  {getStatusBadge(survey.status)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Store</p>
                    <p className="font-medium text-gray-900">{survey.storeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{survey.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Responses</p>
                    <p className="font-medium text-gray-900">{survey.responses}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">NPS Score</p>
                    <p className="font-medium text-gray-900">{survey.npsScore || '—'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Questions: {survey.questions.length}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleSurveyStatus(survey.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    survey.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {survey.status === 'active' ? <StopCircle size={16} /> : <Play size={16} />}
                  {survey.status === 'active' ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setShowAddQuestion(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <Plus size={16} />
                  Add Question
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <Eye size={16} />
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add Question to "{selectedSurvey.name}"</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <input
                  type="text"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="input-field"
                  placeholder="Enter your question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                  className="input-field"
                >
                  <option value="rating">Rating Scale</option>
                  <option value="nps">NPS Scale</option>
                  <option value="text">Text Input</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newQuestion.required}
                  onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Required question</span>
              </label>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={addQuestionToSurvey}
                className="btn-primary"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement;