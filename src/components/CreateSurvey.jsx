import React, { useState } from 'react';
import api from '../services/apiService';
import { Plus, Trash2, GripVertical, Copy, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { mockSurveys } from '../utils/mockData';
import { useBrand } from '../context/BrandContext';

const CreateSurvey = () => {
  const { selectedBrand } = useBrand();
  const [surveyName, setSurveyName] = useState('');
  const [surveyCode, setSurveyCode] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState('We value your feedback!');
  const [headerSubtext, setHeaderSubtext] = useState('Help us serve you better every day.');
  const [footer, setFooter] = useState('Your feedback is private • Better experience • Exclusive offers • We value your privacy');
  const [questions, setQuestions] = useState([
    { id: Date.now().toString(), text: 'How was the food?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
    { id: (Date.now() + 1).toString(), text: 'How was the service?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good'], required: true },
    { id: (Date.now() + 2).toString(), text: 'How was the ambience?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
    { id: (Date.now() + 3).toString(), text: 'How likely are you to recommend us?', type: 'nps', required: true },
    { id: (Date.now() + 4).toString(), text: 'Any suggestions or additional comments?', type: 'text', required: false },
  ]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

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

  const duplicateQuestion = (id) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: Date.now().toString(),
      text: `${questionToDuplicate.text} (Copy)`,
    };
    const index = questions.findIndex(q => q.id === id);
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
    setExpandedQuestion(duplicatedQuestion.id);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const moveQuestionUp = (index) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const moveQuestionDown = (index) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) return;

    const newQuestions = [...questions];
    const [draggedQuestion] = newQuestions.splice(dragIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedQuestion);
    setQuestions(newQuestions);
    setDragOverIndex(null);
  };

  const renderPreviewQuestion = (question, index) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="space-y-2 mt-2">
            <div className="flex gap-2 flex-wrap">
              {question.options?.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="radio" name={`preview_${question.id}`} className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'nps':
        return (
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Not Likely</span>
              <span>Extremely Likely</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button key={num} className="w-8 h-8 text-sm rounded-lg bg-gray-100 hover:bg-orange-100 transition-colors">
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
            rows="2"
            placeholder="Type your answer here..."
            disabled
          ></textarea>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const surveyPayload = {
        brandId: selectedBrand.id,
        brandCode: selectedBrand.code,

        surveyCode,

        title: surveyName,

        description,

        startDate,

        endDate,

        status: 'DRAFT',

        footer,

        maxUsersLimitForSurvey: 10000,

        questionsPerPage: 5,

        introductionPage: {
          isEnabled: true,
          title: header,
          description: headerSubtext,
          buttonLabelName: 'Start Survey',
        },

        termsAndConditions: {
          isEnabled: true,
          description:
            'Terms and Conditions',
          enableSurveyOnlyAfterAcceptingTnC: true,
        },

        surveyEndConfigPage: {
          isEnabled: true,
          title: 'Thank You',
          description:
            'Thank you for your feedback',
          buttonLabelName:
            selectedBrand.name,
          buttonLink:
            'https://google.com',
        },

        customFields: [
          {
            fieldName: 'mobile_number',
            labelName: 'Mobile Number',
            placeholder:
              'Enter mobile number',
            type: 'text',
            isRequired: true,
          },
          {
            fieldName: 'invoice_number',
            labelName: 'Invoice Number',
            placeholder:
              'Enter invoice number',
            type: 'text',
            isRequired: true,
          },
        ],
      };

      const surveyResponse =
        await api.post(
          '/survey-config',
          surveyPayload
        );

      const surveyId =
        surveyResponse.data.id;

      const questionsPayload =
        questions.map(
          (question, index) => ({
            questionText:
              question.text,

            questionType:
              question.type === 'text'
                ? 'TEXT'
                : 'RATING',

            displayOrder:
              index + 1,

            isRequired:
              question.required,

            status: 'ACTIVE',

            ratingMin:
              question.type === 'nps'
                ? 0
                : 1,

            ratingMax:
              question.type === 'nps'
                ? 10
                : 5,

            enableComments: true,

            requiredComments: false,

            commentsPlaceholder:
              'Tell us why you gave this score',

            commentText:
              'Reason for your rating',
          })
        );

      await api.post(
        `/survey-config/questions/${surveyId}`,
        questionsPayload
      );

      alert(
        'Survey Created Successfully'
      );

      setSurveyName('');
      setSurveyCode('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.log(error);

      // alert(
      //   error?.response?.data?.message ||
      //   'Failed to create survey'
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
          <p className="text-gray-500 mt-1">Design customer feedback surveys for {selectedBrand.name}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Eye size={18} />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div> */}

      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Left Side - Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Name
                  </label>

                  <input
                    type="text"
                    value={surveyName}
                    onChange={(e) =>
                      setSurveyName(e.target.value)
                    }
                    className="input-field"
                    placeholder="Customer Experience Survey"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Code
                  </label>

                  <input
                    type="text"
                    value={surveyCode}
                    onChange={(e) =>
                      setSurveyCode(e.target.value)
                    }
                    className="input-field"
                    placeholder="Survey_NPS_001"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    className="input-field"
                    rows="3"
                    placeholder="Please rate your experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="input-field"
                    required
                  />
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
                <div>
                  <h3 className="font-semibold text-gray-900">Survey Questions</h3>
                  <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder questions</p>
                </div>
                <button type="button" onClick={addQuestion} className="btn-primary flex items-center gap-2 text-sm">
                  <Plus size={16} />
                  Add Question
                </button>
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`border rounded-lg overflow-hidden transition-all ${dragOverIndex === index ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="cursor-move">
                          <GripVertical size={18} className="text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900">Q{index + 1}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{questionTypes.find(t => t.value === question.type)?.label}</span>
                          {question.required && <span className="text-xs text-red-500">*Required</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveQuestionUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestionDown(index)}
                          disabled={index === questions.length - 1}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateQuestion(question.id)}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          {expandedQuestion === question.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="p-1 rounded hover:bg-red-100 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedQuestion === question.id && (
                      <div className="p-3 space-y-3">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          className="input-field text-sm"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="input-field text-sm"
                          >
                            {questionTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Required</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {questions.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500 text-sm">No questions added yet</p>
                  <button type="button" onClick={addQuestion} className="mt-2 text-orange-600 text-sm">
                    + Add your first question
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="btn-secondary">Save as Draft</button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading
                  ? 'Creating Survey...'
                  : 'Create Survey'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Live Preview */}
        {showPreview && (
          <div className="space-y-4">
            <div className="sticky top-6">
              {/* <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <span className="text-xs text-gray-500">Customer facing view</span>
              </div> */}

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedBrand.id === 'kfc' ? 'from-red-600 to-red-700' : selectedBrand.id === 'pizza_hut' ? 'from-blue-600 to-blue-700' : 'from-purple-600 to-purple-700'} text-white p-6 text-center`}>
                  <span className="text-4xl mb-2">{selectedBrand.logo} {selectedBrand.name}</span>

                  <h2 className="text-xl font-bold">{header || 'We value your feedback!'}</h2>
                  <p className="text-sm opacity-90 mt-1">{headerSubtext || 'Help us serve you better'}</p>
                </div>

                {/* Questions */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">How was your experience?</h3>
                  <div className="space-y-6">
                    {questions.map((question, idx) => (
                      <div key={question.id} className="border-b border-gray-100 pb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="font-semibold text-gray-900 text-sm">{idx + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{question.text}</p>
                            {question.required && <span className="text-xs text-red-500">*Required</span>}
                          </div>
                        </div>
                        {renderPreviewQuestion(question, idx)}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 bg-orange-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-orange-700 transition-colors">
                    Submit Feedback
                  </button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
                  <p>{footer || 'Your feedback is private'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSurvey;