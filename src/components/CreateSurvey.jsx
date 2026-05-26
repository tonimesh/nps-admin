import React, { useState } from 'react';
import api from '../services/apiService';
import { 
  Plus, Trash2, GripVertical, Copy, ChevronDown, ChevronUp, 
  ArrowUp, ArrowDown, Eye, X, CheckCircle, FileText, Calendar,
  Users, Settings, Star, Phone, Mail, Hash, AlertCircle
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const CreateSurvey = () => {
  const { selectedBrand } = useBrand();
  
  // Basic Info
  const [surveyName, setSurveyName] = useState('');
  const [surveyCode, setSurveyCode] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxUsers, setMaxUsers] = useState(10000);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSurvey, setCreatedSurvey] = useState(null);
  
  // Introduction Page
  const [introTitle, setIntroTitle] = useState('We value your feedback!');
  const [introDescription, setIntroDescription] = useState('Help us serve you better every day.');
  const [introButtonLabel, setIntroButtonLabel] = useState('Start Survey');
  
  // Terms & Conditions
  const [termsDescription, setTermsDescription] = useState('By participating in this survey, you agree to our terms and conditions. Your feedback will be used to improve our services.');
  const [requireTerms, setRequireTerms] = useState(true);
  
  // End Page
  const [endTitle, setEndTitle] = useState('Thank You!');
  const [endDescription, setEndDescription] = useState('Thank you for your valuable feedback. We appreciate your time and effort in helping us improve.');
  const [endButtonLabel, setEndButtonLabel] = useState(selectedBrand?.name || 'Visit Website');
  const [endButtonLink, setEndButtonLink] = useState('');
  
  // Footer
  const [footer, setFooter] = useState('Your feedback is private • Better experience • Exclusive offers • We value your privacy');
  
  // Custom Fields
  const [customFields, setCustomFields] = useState([
    { 
      id: Date.now().toString(), 
      fieldName: 'full_name', 
      labelName: 'Full Name', 
      placeholder: 'Enter your full name',
      type: 'text',
      isRequired: false,
      enabled: true
    },
    { 
      id: (Date.now() + 1).toString(), 
      fieldName: 'email', 
      labelName: 'Email Address', 
      placeholder: 'Enter your email',
      type: 'email',
      isRequired: false,
      enabled: true
    },
    { 
      id: (Date.now() + 2).toString(), 
      fieldName: 'mobile_number', 
      labelName: 'Mobile Number', 
      placeholder: 'Enter your mobile number',
      type: 'tel',
      isRequired: true,
      enabled: true
    },
  ]);
  
  // Questions - Only NPS type
  const [questions, setQuestions] = useState([
    { id: Date.now().toString(), text: 'How likely are you to recommend our food quality to friends and family?', type: 'nps', required: true },
    { id: (Date.now() + 1).toString(), text: 'How likely are you to recommend our service speed to others?', type: 'nps', required: true },
    { id: (Date.now() + 2).toString(), text: 'How likely are you to recommend our staff behavior to friends?', type: 'nps', required: true },
    { id: (Date.now() + 3).toString(), text: 'How likely are you to recommend our store ambience to others?', type: 'nps', required: true },
    { id: (Date.now() + 4).toString(), text: 'Overall, how likely are you to recommend our brand to friends and family?', type: 'nps', required: true },
  ]);
  
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [expandedCustomField, setExpandedCustomField] = useState(null);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
  ];

  // Question Management
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: 'How likely are you to recommend our service to others?',
      type: 'nps',
      required: true,
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

  // Custom Field Management
  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      fieldName: `custom_field_${customFields.length + 1}`,
      labelName: 'New Field',
      placeholder: 'Enter value',
      type: 'text',
      isRequired: false,
      enabled: true
    };
    setCustomFields([...customFields, newField]);
    setExpandedCustomField(newField.id);
  };

  const removeCustomField = (id) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateCustomField = (id, field, value) => {
    setCustomFields(customFields.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Drag and Drop for Questions
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

  // Preview Rendering for NPS
  const renderPreviewQuestion = (question, index) => {
    return (
      <div className="space-y-3 mt-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Not Likely at all</span>
          <span>Extremely likely</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              className="w-9 h-9 text-sm rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white transition-all duration-200"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!surveyName || !surveyCode || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const surveyPayload = {
        brandId: selectedBrand.id,
        brandCode: selectedBrand.code,
        surveyCode: surveyCode,
        title: surveyName,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: 'ACTIVE',
        footer: footer,
        maxUsersLimitForSurvey: maxUsers,
        questionsPerPage: questionsPerPage,
        introductionPage: {
          isEnabled: true,
          title: introTitle,
          description: introDescription,
          buttonLabelName: introButtonLabel,
        },
        termsAndConditions: {
          isEnabled: true,
          description: termsDescription,
          enableSurveyOnlyAfterAcceptingTnC: requireTerms,
        },
        surveyEndConfigPage: {
          isEnabled: true,
          title: endTitle,
          description: endDescription,
          buttonLabelName: endButtonLabel,
          buttonLink: endButtonLink || 'https://google.com',
        },
        customFields: customFields
          .filter(field => field.enabled && field.fieldName)
          .map(field => ({
            fieldName: field.fieldName,
            labelName: field.labelName,
            placeholder: field.placeholder,
            type: field.type,
            isRequired: field.isRequired,
          })),
      };

      const surveyResponse = await api.post('/survey-config', surveyPayload);
      const surveyId = surveyResponse.data.id;

      const questionsPayload = questions.map((question, index) => ({
        questionText: question.text,
        questionType: 'NPS',
        displayOrder: index + 1,
        isRequired: question.required,
        status: 'ACTIVE',
        ratingMin: 0,
        ratingMax: 10,
        enableComments: true,
        requiredComments: false,
        commentsPlaceholder: 'Tell us why you gave this score',
        commentText: 'Reason for your rating',
      }));

      await api.post(`/survey-config/questions/${surveyId}`, questionsPayload);

      setCreatedSurvey({
        id: surveyId,
        name: surveyName,
        code: surveyCode,
        questionsCount: questions.length,
        customFieldsCount: customFields.filter(f => f.enabled).length,
        startDate: startDate,
        endDate: endDate,
        status: 'ACTIVE',
      });
      
      setShowSuccessModal(true);
      
      // Reset form
      setSurveyName('');
      setSurveyCode('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      
    } catch (error) {
      console.error('Error creating survey:', error);
      alert(error?.response?.data?.message || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Left Side - Form */}
        <div className="space-y-6  overflow-y-auto pr-4 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-orange-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Survey Name *</label>
                  <input type="text" value={surveyName} onChange={(e) => setSurveyName(e.target.value)} className="input-field" placeholder="e.g., Customer Experience Survey" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Survey Code *</label>
                  <input type="text" value={surveyCode} onChange={(e) => setSurveyCode(e.target.value)} className="input-field" placeholder="e.g., SURVEY_001" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows="2" placeholder="Describe the purpose of this survey" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
                  <input type="number" value={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Questions Per Page</label>
                  <input type="number" value={questionsPerPage} onChange={(e) => setQuestionsPerPage(e.target.value)} className="input-field" />
                </div>
              </div>
            </div>

            {/* Introduction Page */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={20} className="text-orange-500" />
                Introduction Page
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input type="text" value={introTitle} onChange={(e) => setIntroTitle(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea value={introDescription} onChange={(e) => setIntroDescription(e.target.value)} className="input-field" rows="2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Label</label>
                  <input type="text" value={introButtonLabel} onChange={(e) => setIntroButtonLabel(e.target.value)} className="input-field" />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={20} className="text-orange-500" />
                  Custom Fields
                </h3>
                <button type="button" onClick={addCustomField} className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Field
                </button>
              </div>
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">{field.labelName || 'New Field'}</span>
                        {field.isRequired && <span className="text-xs text-red-500">*Required</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setExpandedCustomField(expandedCustomField === field.id ? null : field.id)} className="p-1 rounded hover:bg-gray-200">
                          <ChevronDown size={14} />
                        </button>
                        <button type="button" onClick={() => removeCustomField(field.id)} className="p-1 rounded hover:bg-red-100 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {expandedCustomField === field.id && (
                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                            <input type="text" value={field.fieldName} onChange={(e) => updateCustomField(field.id, 'fieldName', e.target.value)} className="input-field text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Label Name</label>
                            <input type="text" value={field.labelName} onChange={(e) => updateCustomField(field.id, 'labelName', e.target.value)} className="input-field text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
                            <input type="text" value={field.placeholder} onChange={(e) => updateCustomField(field.id, 'placeholder', e.target.value)} className="input-field text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
                            <select value={field.type} onChange={(e) => updateCustomField(field.id, 'type', e.target.value)} className="input-field text-sm">
                              {fieldTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                            </select>
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={field.isRequired} onChange={(e) => updateCustomField(field.id, 'isRequired', e.target.checked)} className="rounded" />
                          <span className="text-sm text-gray-700">Required field</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {customFields.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">No custom fields added. Click "Add Field" to create one.</div>
              )}
            </div>

            {/* Questions Builder - NPS Only */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Survey Questions (NPS Scale 0-10)</h3>
                  <p className="text-xs text-gray-500 mt-1">All questions use NPS scale (0 = Not Likely, 10 = Extremely Likely)</p>
                </div>
                <button type="button" onClick={addQuestion} className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Question
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
                    className={`border rounded-lg overflow-hidden transition-all ${dragOverIndex === index ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="cursor-move"><GripVertical size={18} className="text-gray-400" /></div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900">Q{index + 1}</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">NPS Scale (0-10)</span>
                          {question.required && <span className="text-xs text-red-500">*Required</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveQuestionUp(index)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"><ArrowUp size={14} /></button>
                        <button type="button" onClick={() => moveQuestionDown(index)} disabled={index === questions.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"><ArrowDown size={14} /></button>
                        <button type="button" onClick={() => duplicateQuestion(question.id)} className="p-1 rounded hover:bg-gray-200"><Copy size={14} /></button>
                        <button type="button" onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)} className="p-1 rounded hover:bg-gray-200">{expandedQuestion === question.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                        <button type="button" onClick={() => removeQuestion(question.id)} className="p-1 rounded hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {expandedQuestion === question.id && (
                      <div className="p-3 space-y-3">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          className="input-field text-sm"
                          placeholder="Enter your question here..."
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Required question</span>
                        </label>
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-xs text-blue-600">This question uses NPS scale (0-10)</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {questions.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500 text-sm">No questions added yet</p>
                  <button type="button" onClick={addQuestion} className="mt-2 text-orange-500 text-sm">+ Add your first question</button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-orange-500" />
                Footer
              </h3>
              <textarea value={footer} onChange={(e) => setFooter(e.target.value)} className="input-field" rows="2" />
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-500" />
                Terms & Conditions
              </h3>
              <div className="space-y-4">
                <textarea value={termsDescription} onChange={(e) => setTermsDescription(e.target.value)} className="input-field" rows="3" />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={requireTerms} onChange={(e) => setRequireTerms(e.target.checked)} className="rounded" />
                  <span className="text-sm text-gray-700">Require acceptance of terms before starting survey</span>
                </label>
              </div>
            </div>

            {/* End Page */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-orange-500" />
                End Page
              </h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={endTitle} onChange={(e) => setEndTitle(e.target.value)} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={endDescription} onChange={(e) => setEndDescription(e.target.value)} className="input-field" rows="2" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Button Label</label><input type="text" value={endButtonLabel} onChange={(e) => setEndButtonLabel(e.target.value)} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label><input type="url" value={endButtonLink} onChange={(e) => setEndButtonLink(e.target.value)} className="input-field" placeholder="https://..." /></div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">Save as Draft</button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Survey'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Live Preview */}
        {showPreview && (
          <div className="space-y-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className={`${selectedBrand.name === 'KFC' ? 'bg-red-600' : selectedBrand.name === 'PIZZAHUT' ?  'bg-red-500' : ""} text-white p-6 text-center`}>
                  <div className="text-4xl mb-2 flex items-center justify-center gap-2">
                    {selectedBrand.logo ? (
                      <img src={`https://ayursinfotech.com${selectedBrand.logo}`} alt={selectedBrand.name} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      '🍔'
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{introTitle || 'We value your feedback!'}</h2>
                  <p className="text-sm opacity-90 mt-1">{introDescription || 'Help us serve you better'}</p>
                </div>

                {/* Custom Fields Section */}
                {customFields.filter(f => f.enabled).length > 0 && (
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users size={16} className="text-orange-500" />
                      Tell us about yourself
                    </h3>
                    <div className="space-y-4">
                      {customFields.filter(f => f.enabled).map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.labelName} {field.isRequired && <span className="text-red-500">*</span>}
                          </label>
                          <input type={field.type} placeholder={field.placeholder} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" disabled />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions - NPS Preview */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Rate your experience</h3>
                  <div className="space-y-8">
                    {questions.map((question, idx) => (
                      <div key={question.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-start gap-2 mb-3">
                          <span className="font-semibold text-orange-500 text-sm bg-orange-50 w-6 h-6 rounded-full flex items-center justify-center">{idx + 1}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{question.text}</p>
                            {question.required && <span className="text-xs text-red-500">*Required</span>}
                          </div>
                        </div>
                        {renderPreviewQuestion(question, idx)}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md">
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

      {/* Success Modal */}
      {showSuccessModal && createdSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Survey Created Successfully!</h3>
              <p className="text-gray-500 mb-6">Your NPS survey has been created and is ready to use.</p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Survey Name:</span>
                  <span className="text-sm font-medium text-gray-900">{createdSurvey.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Survey Code:</span>
                  <span className="text-sm font-medium text-gray-900">{createdSurvey.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">NPS Questions:</span>
                  <span className="text-sm font-medium text-gray-900">{createdSurvey.questionsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Custom Fields:</span>
                  <span className="text-sm font-medium text-gray-900">{createdSurvey.customFieldsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">{createdSurvey.startDate} to {createdSurvey.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm font-medium text-yellow-600">{createdSurvey.status}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setShowSuccessModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  Close
                </button>
                <button onClick={() => { setShowSuccessModal(false); window.location.href = '/survey-management'; }} className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-colors">
                  View Surveys
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSurvey;