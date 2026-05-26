import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  Layers,
  ChevronRight,
  ClipboardList,
  Trash2
} from 'lucide-react';

const SurveyQuestionsModal = ({ survey, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [surveyMetadata, setSurveyMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Question deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteConfirm(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    if (!survey?.id || !questionToDelete?.questionId) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch(`https://adminnps.ayursinfotech.com/api/survey-config/questions/${survey.id}/${questionToDelete.questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': accessToken || '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete question (Status: ${response.status})`);
      }

      const resData = await response.json();
      
      // Update local state by filtering out the deleted question
      setQuestions(prev => prev.filter(q => q.questionId !== questionToDelete.questionId));
      setDeleteSuccess(resData.message || "Question deleted successfully!");
      
      // Auto close confirmation popup after 1.5 seconds
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setQuestionToDelete(null);
        setDeleteSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('Error deleting question:', err);
      setDeleteError(err.message || 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  };

  const fetchQuestions = async () => {
    if (!survey?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`https://adminnps.ayursinfotech.com/api/survey-config/questions/${survey.id}`, {
        method: 'GET',
        headers: {
          'Authorization': accessToken || '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions (Status: ${response.status})`);
      }

      const resData = await response.json();
      
      if (resData.status === 'SUCCESS' && resData.data) {
        setQuestions(resData.data.questions || []);
        setSurveyMetadata({
          surveyId: resData.data.survey_id,
          surveyCode: resData.data.survey_code,
          startDate: resData.data.start_date,
          endDate: resData.data.end_date,
          brandId: resData.data.brand_id,
          brandCode: resData.data.brand_code
        });
      } else {
        throw new Error(resData.message || 'Failed to fetch questions.');
      }
    } catch (err) {
      console.error('Error in fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [survey?.id]);

  // Color categorizer for NPS rating scales
  const getRatingColor = (value, max) => {
    if (max <= 5) {
      if (value <= 2) return 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100';
      if (value === 3) return 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100';
      return 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100';
    }
    // NPS 0-10 Scale
    if (value <= 6) return 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100';
    if (value <= 8) return 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100';
    return 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100';
  };

  if (!survey) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300">
      <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-150 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-xs">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ClipboardList size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                  Survey Questions
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {survey.title} • <span className="font-mono text-gray-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{survey.surveyCode}</span>
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-gray-400 hover:text-gray-700 transition-all duration-200 border border-transparent hover:border-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <div className="relative flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
              <HelpCircle className="absolute text-indigo-600 animate-pulse" size={18} />
            </div>
            <p className="text-sm font-semibold text-slate-600">Fetching survey questions...</p>
            <p className="text-xs text-slate-400 mt-1">Contacting Ayurs Infotech API</p>
          </div>
        ) : error ? (
          <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mx-auto mb-4 border border-rose-100 shadow-sm">
              <AlertCircle size={28} />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Failed to Load Questions</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-3xs">{error}</p>
            <button
              onClick={fetchQuestions}
              className="mt-6 flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw size={14} className="animate-hover-spin" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* API Metadata Header */}
            {surveyMetadata && (
              <div className="bg-gradient-to-r from-indigo-50/40 via-purple-50/30 to-slate-50 p-4 rounded-xl border border-indigo-100/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">BRAND CODE</span>
                  <span className="font-mono font-bold text-slate-800">{surveyMetadata.brandCode || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">SURVEY CODE</span>
                  <span className="font-mono font-bold text-slate-800">{surveyMetadata.surveyCode || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">TOTAL QUESTIONS</span>
                  <span className="font-extrabold text-indigo-700">{questions.length} Questions</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">DURATION</span>
                  <span className="font-semibold text-slate-700">{surveyMetadata.startDate} ~ {surveyMetadata.endDate}</span>
                </div>
              </div>
            )}

            {questions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                <HelpCircle className="mx-auto mb-3 text-slate-300" size={36} />
                <p className="font-semibold text-sm text-slate-700">No questions found in this survey.</p>
                <p className="text-xs text-slate-450 mt-1">Configure questions in the administration panel to list them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={13} className="text-slate-400" />
                  <span>Question Flow List ({questions.length})</span>
                </h4>
                
                {questions.map((question, index) => {
                  const hasComments = question.enableComments;
                  const isRequired = question.required;
                  const displayIdx = question.displayOrder || (index + 1);

                  // Create array of rating scale values
                  const ratingOptions = [];
                  const min = question.ratingMin ?? 0;
                  const max = question.ratingMax ?? 10;
                  for (let i = min; i <= max; i++) {
                    ratingOptions.push(i);
                  }

                  return (
                    <div 
                      key={question.questionId || index} 
                      className="group bg-white rounded-2xl border border-slate-150 hover:border-indigo-150 p-5 shadow-3xs hover:shadow-xs transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Top border decor */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Header bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                            {displayIdx}
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-slate-100 text-slate-650 border border-slate-200">
                            {question.questionType || 'RATING'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isRequired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                              <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200/30">
                              Optional
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteClick(question)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200 ml-1"
                            title="Delete Question"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-gray-900 font-bold text-[15px] leading-snug group-hover:text-indigo-950 transition-colors">
                        {question.questionText}
                      </p>

                      {/* Visual components based on Type */}
                      {question.questionType === 'RATING' && (
                        <div className="mt-4 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-0.5">
                            <span>Score: {min} (Lowest)</span>
                            <span>Score: {max} (Highest)</span>
                          </div>
                          
                          {/* Scale Grid */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {ratingOptions.map((val) => (
                              <button
                                key={val}
                                type="button"
                                disabled
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center text-xs font-black shadow-3xs transition-all cursor-default select-none ${getRatingColor(val, max)}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                          
                          {/* Standard NPS hint if 0-10 */}
                          {max === 10 && min === 0 && (
                            <div className="grid grid-cols-3 text-[10px] font-bold text-center gap-1 pt-1">
                              <div className="py-1 rounded bg-rose-50/40 text-rose-700 border border-rose-100/30">Detractors (0-6)</div>
                              <div className="py-1 rounded bg-amber-50/40 text-amber-700 border border-amber-100/30">Passives (7-8)</div>
                              <div className="py-1 rounded bg-emerald-50/40 text-emerald-700 border border-emerald-100/30">Promoters (9-10)</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Comment Box Configuration */}
                      {hasComments ? (
                        <div className="mt-4 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100/80 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
                            <span className="flex items-center gap-1.5 text-indigo-700">
                              <MessageSquare size={12} />
                              COMMENT CONFIGURATION
                            </span>
                            {question.requiredComments ? (
                              <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Comment Mandatory</span>
                            ) : (
                              <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Comment Optional</span>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-[11px] font-bold text-slate-600 block mb-0.5">{question.commentText || 'Comments:'}</span>
                            <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-400 font-medium italic min-h-[50px] shadow-3xs select-none">
                              {question.commentsPlaceholder || 'Tell us why...'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3.5 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                          <MessageSquare size={11} className="text-slate-300" />
                          <span>COMMENTS DISABLED FOR THIS QUESTION</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center shadow-inner">
          <p className="text-[11px] text-slate-400 font-semibold">
            {questions.length > 0 ? `Showing all ${questions.length} active questions` : 'No questions loaded'}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-250 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-3xs"
          >
            Close Viewer
          </button>
        </div>

      </div>

      {/* Question Deletion Confirmation Modal */}
      {showDeleteConfirm && questionToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100/50 space-y-4">
            
            {/* Success state */}
            {deleteSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg">Deleted Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">{deleteSuccess}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100">
                    <Trash2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-gray-900 text-base leading-tight">Delete Question?</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Are you sure you want to permanently delete this question from the survey? This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Preview of the question being deleted */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Question Content</p>
                  <p className="font-bold text-slate-700 italic">"{questionToDelete.questionText}"</p>
                </div>

                {/* Error presentation */}
                {deleteError && (
                  <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 font-medium">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{deleteError}</span>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setQuestionToDelete(null);
                      setDeleteError(null);
                    }}
                    disabled={deleting}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-100 transition-all duration-200"
                  >
                    {deleting ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={12} />
                        Yes, Delete
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default SurveyQuestionsModal;
