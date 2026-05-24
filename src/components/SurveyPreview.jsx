import React, { useState } from 'react';
import { Eye, Edit, Save, X, Star } from 'lucide-react';
import { mockSurveys, mockStores } from '../utils/mockData';

const SurveyPreview = () => {
  const [selectedSurvey, setSelectedSurvey] = useState(mockSurveys[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSurvey, setEditedSurvey] = useState({ ...selectedSurvey });
  const [answers, setAnswers] = useState({});

  const handleSaveEdit = () => {
    // In real app, save to backend
    setSelectedSurvey({ ...editedSurvey });
    setIsEditing(false);
    alert('Survey updated successfully!');
  };

  const handleQuestionEdit = (questionId, field, value) => {
    setEditedSurvey({
      ...editedSurvey,
      questions: editedSurvey.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {question.options?.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'nps':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Not Likely at all</span>
              <span>Extremely likely</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswer(question.id, num)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    answers[question.id] === num
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'text':
        return (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            rows="3"
            placeholder="Tell us here..."
            maxLength="500"
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          ></textarea>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Preview</h1>
          <p className="text-gray-500 mt-1">Preview and edit your customer-facing survey</p>
        </div> */}
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-2">
                <X size={16} />
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="btn-primary flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
              <Edit size={16} />
              Edit Survey
            </button>
          )}
        </div>
      </div>

      {/* Survey Selector */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Survey to Preview</label>
        <select
          value={selectedSurvey.id}
          onChange={(e) => {
            const survey = mockSurveys.find(s => s.id === e.target.value);
            setSelectedSurvey(survey);
            setEditedSurvey({ ...survey });
            setAnswers({});
          }}
          className="input-field"
        >
          {mockSurveys.map(survey => (
            <option key={survey.id} value={survey.id}>{survey.name} - {survey.storeName}</option>
          ))}
        </select>
      </div>

      {/* Customer Facing Survey UI */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{isEditing ? editedSurvey.header : selectedSurvey.header}</h1>
            <p className="text-orange-100">{isEditing ? editedSurvey.headerSubtext : selectedSurvey.headerSubtext}</p>
          </div>


          {/* Survey Questions */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">TELL US ABOUT YOUR EXPERIENCE</h2>
            <p className="text-gray-500 mb-6">How was your experience today?</p>

            <div className="space-y-8">
              {(isEditing ? editedSurvey.questions : selectedSurvey.questions).map((question, idx) => (
                <div key={question.id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-semibold text-gray-900">{idx + 1}.</span>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => handleQuestionEdit(question.id, 'text', e.target.value)}
                          className="input-field"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{question.text}</p>
                      )}
                      {question.required && !isEditing && (
                        <span className="text-xs text-red-500">*Required</span>
                      )}
                    </div>
                    {isEditing && (
                      <select
                        value={question.type}
                        onChange={(e) => handleQuestionEdit(question.id, 'type', e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="rating">Rating</option>
                        <option value="nps">NPS</option>
                        <option value="text">Text</option>
                      </select>
                    )}
                  </div>
                  
                  {renderQuestionPreview(question)}
                </div>
              ))}
            </div>

            <button className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Submit Feedback
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t border-gray-200">
            <p>{isEditing ? editedSurvey.footer : selectedSurvey.footer}</p>
            <div className="flex justify-center gap-6 mt-3 text-xs">
              <span>✓ Your feedback is private</span>
              <span>✓ Better experience</span>
              <span>✓ Exclusive offers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPreview;