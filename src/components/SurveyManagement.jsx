import React, { useState, useEffect } from 'react';
import { 
  Play, 
  StopCircle, 
  Plus, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  Info, 
  Smartphone, 
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import SurveyDetails from './SurveyDetails';

const SurveyManagement = () => {
  const { selectedBrand } = useBrand();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewStep, setPreviewStep] = useState('intro'); // 'intro' or 'end'

  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({ labelName: '', type: 'text', isRequired: false });

  const [mockAcceptedTnC, setMockAcceptedTnC] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem('accessToken');
        const brandCode = selectedBrand?.code || 'PIZZ-0001';
        
        const response = await fetch(`https://adminnps.ayursinfotech.com/api/survey-config/brand/${brandCode}?page=0&size=50`, {
          method: 'GET',
          headers: {
            'Authorization': accessToken || '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch survey configurations');
        }

        const data = await response.json();
        
        if (data && data.content) {
          setSurveys(data.content);
        } else {
          setSurveys([]);
        }
      } catch (err) {
        console.error('Error fetching surveys:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [selectedBrand]);

  const toggleSurveyStatus = (surveyId) => {
    setSurveys(surveys.map(survey =>
      survey.id === surveyId
        ? { ...survey, status: survey.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE' }
        : survey
    ));
  };

  const handlePreviewClick = async (survey) => {
    setSelectedSurvey(survey); // Quick visual fallback
    setPreviewStep('intro');
    setShowPreview(true);
    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const brandCode = selectedBrand?.code || survey.brandCode || 'PIZZ-0001';
      
      const response = await fetch(`https://adminnps.ayursinfotech.com/api/survey-config/${brandCode}/${survey.id}`, {
        method: 'GET',
        headers: {
          'Authorization': accessToken || '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch detailed survey configurations');
      }

      const data = await response.json();
      setSelectedSurvey(data);
    } catch (err) {
      console.error('Error fetching survey details:', err);
      setPreviewError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const addFieldToSurvey = () => {
    if (selectedSurvey && newField.labelName) {
      const fieldName = newField.labelName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
      const updatedSurveys = surveys.map(survey =>
        survey.id === selectedSurvey.id
          ? {
              ...survey,
              customFields: [
                ...(survey.customFields || []),
                {
                  fieldName,
                  labelName: newField.labelName,
                  placeholder: `Enter ${newField.labelName.toLowerCase()}`,
                  type: newField.type,
                  isRequired: newField.isRequired
                }
              ]
            }
          : survey
      );
      setSurveys(updatedSurveys);
      
      const currentSelected = updatedSurveys.find(s => s.id === selectedSurvey.id);
      setSelectedSurvey(currentSelected);
      
      setNewField({ labelName: '', type: 'text', isRequired: false });
      setShowAddField(false);
    }
  };

  const deleteFieldFromSurvey = (surveyId, fieldName) => {
    const updatedSurveys = surveys.map(survey =>
      survey.id === surveyId
        ? {
            ...survey,
            customFields: (survey.customFields || []).filter(f => f.fieldName !== fieldName)
          }
        : survey
    );
    setSurveys(updatedSurveys);
    const currentSelected = updatedSurveys.find(s => s.id === surveyId);
    setSelectedSurvey(currentSelected);
  };

  const filteredSurveys = surveys.filter(survey => {
    const title = survey.title || '';
    const code = survey.surveyCode || '';
    const description = survey.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || survey.status?.toUpperCase() === statusFilter.toUpperCase();
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && (survey.startDate >= startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && (survey.endDate <= endDate);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">{status || 'Draft'}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        {loading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
            <Info className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!loading && !error && filteredSurveys.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400 shadow-sm">
            <Info className="mx-auto mb-2 text-gray-300" size={36} />
            <p className="font-medium text-sm">No survey configurations found matching filters.</p>
          </div>
        )}

        {!loading && !error && filteredSurveys.map((survey) => (
          <div key={survey.id} className="card hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 bg-white p-6 rounded-xl space-y-4 shadow-sm">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-gray-50 pb-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{survey.title}</h3>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-blue-50 text-blue-700 border border-blue-100">{survey.surveyCode}</span>
                  {getStatusBadge(survey.status)}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">{survey.description || 'No description provided.'}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 lg:self-start">
                <button
                  onClick={() => toggleSurveyStatus(survey.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    survey.status === 'ACTIVE'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {survey.status === 'ACTIVE' ? <StopCircle size={14} /> : <Play size={14} />}
                  {survey.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setShowAddField(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all"
                >
                  <Plus size={14} />
                  Add Field
                </button>
                <button
                  onClick={() => handlePreviewClick(survey)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all"
                >
                  <Eye size={14} />
                  Preview
                </button>
              </div>
            </div>

            {/* Core configuration metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400 font-medium mb-0.5">Brand Code</p>
                <p className="font-bold text-gray-800 font-mono text-[13px]">{survey.brandCode || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400 font-medium mb-0.5">Questions Limit</p>
                <p className="font-bold text-gray-800 text-[13px]">{survey.questionsPerPage || 0} Per Page</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-gray-400 font-medium mb-0.5">Max Target Users</p>
                <p className="font-bold text-gray-800 text-[13px]">{survey.maxUsersLimitForSurvey?.toLocaleString() || 'Unlimited'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-gray-400 font-medium mb-0.5">Duration</p>
                <div className="flex items-center gap-1.5 font-bold text-gray-855 text-[12px] mt-0.5">
                  <Calendar size={13} className="text-gray-400" />
                  <span>{survey.startDate} ~ {survey.endDate}</span>
                </div>
              </div>
            </div>

            {/* Enabled modules checklist */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${survey.introductionPage?.isEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${survey.introductionPage?.isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                Intro Screen: <span className="font-bold">{survey.introductionPage?.isEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${survey.termsAndConditions?.isEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${survey.termsAndConditions?.isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                T&C Screen: <span className="font-bold">{survey.termsAndConditions?.isEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${survey.surveyEndConfigPage?.isEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${survey.surveyEndConfigPage?.isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                End Screen: <span className="font-bold">{survey.surveyEndConfigPage?.isEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            {/* Custom fields configured */}
            {survey.customFields && survey.customFields.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Collected Customer Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {survey.customFields.map((field, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-3xs">
                      <span className="font-mono text-slate-400 text-[10px] uppercase">[{field.type}]</span>
                      <span>{field.labelName}</span>
                      {field.isRequired && <span className="text-red-500 font-bold text-sm leading-none">*</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {survey.footer && (
              <div className="text-[11px] text-gray-400 font-medium italic pt-2 border-t border-gray-55 flex items-center gap-1.5">
                <Info size={12} className="text-gray-300" />
                <span>Footer: {survey.footer}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Survey Config Details Modal */}
      {showPreview && selectedSurvey && (
        <SurveyDetails 
          survey={selectedSurvey} 
          onClose={() => {
            setShowPreview(false);
            setSelectedSurvey(null);
          }}
          previewLoading={previewLoading}
          previewError={previewError}
          onRetry={() => handlePreviewClick(selectedSurvey)}
        />
      )}

      {/* Add Custom Field Modal */}
      {showAddField && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-55 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-150">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} />
              <span>Add Custom Field</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Field Label Name</label>
                <input
                  type="text"
                  value={newField.labelName}
                  onChange={(e) => setNewField({ ...newField, labelName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Invoice Number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Input Type</label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                  className="input-field"
                >
                  <option value="text">Single Line Text</option>
                  <option value="email">Email Address</option>
                  <option value="tel">Telephone / Mobile</option>
                  <option value="number">Numeric Input</option>
                </select>
              </div>
              
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newField.isRequired}
                  onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700 font-medium">This field is mandatory (Required)</span>
              </label>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-55">
              <button
                onClick={() => {
                  setShowAddField(false);
                  setNewField({ labelName: '', type: 'text', isRequired: false });
                }}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFieldToSurvey}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
                disabled={!newField.labelName.trim()}
              >
                Create Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement;