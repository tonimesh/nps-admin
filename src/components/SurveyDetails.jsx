import React from 'react';
import { 
  X, 
  Info, 
  Calendar, 
  Users, 
  Layers, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  ClipboardList
} from 'lucide-react';

const SurveyDetails = ({ survey, onClose, previewLoading, previewError, onRetry }) => {
  if (!survey) return null;

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                {survey.title}
              </h3>
              {getStatusBadge(survey.status)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Survey Code: <span className="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{survey.surveyCode}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {previewLoading ? (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-50/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm font-semibold text-gray-550 animate-pulse">Fetching latest survey details from server...</p>
          </div>
        ) : previewError ? (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto">
              <Info size={36} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Error Loading Survey Details</h4>
              <p className="text-sm text-gray-500 mt-1">{previewError}</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
              >
                Retry Fetch
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
            {/* Description & Core Params */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</h4>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {survey.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Calendar size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Start Date</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{survey.startDate || 'N/A'}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Calendar size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">End Date</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{survey.endDate || 'N/A'}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Users size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Max Target Users</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">
                    {survey.maxUsersLimitForSurvey?.toLocaleString() || 'Unlimited'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                    <Layers size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Questions limit</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{survey.questionsPerPage || 0} Per Page</p>
                </div>
              </div>
            </div>

            {/* Middle Section: Intro / T&C / End screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Introduction Page Configuration */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-55 pb-2.5">
                    <div className="flex items-center gap-2 text-gray-800">
                      <FileText size={16} className="text-blue-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Intro Page</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      survey.introductionPage?.isEnabled 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {survey.introductionPage?.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {survey.introductionPage?.isEnabled ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-gray-400 font-bold">Screen Title</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{survey.introductionPage.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold">Screen Description</p>
                        <p className="text-gray-600 leading-relaxed mt-0.5">{survey.introductionPage.description || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic py-4">Introduction page is disabled. Users will jump directly into the survey.</p>
                  )}
                </div>

                {survey.introductionPage?.isEnabled && (
                  <div className="pt-3 border-t border-gray-50 mt-4 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Button CTA:</span>
                    <span className="font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                      {survey.introductionPage.buttonLabelName || 'Start'}
                      <ArrowRight size={12} />
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions Screen */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-55 pb-2.5">
                    <div className="flex items-center gap-2 text-gray-800">
                      <ClipboardList size={16} className="text-purple-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Terms & Conditions</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      survey.termsAndConditions?.isEnabled 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {survey.termsAndConditions?.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {survey.termsAndConditions?.isEnabled ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-gray-400 font-bold">T&C Statement</p>
                        <p className="text-gray-600 leading-relaxed mt-0.5 italic">"{survey.termsAndConditions.description}"</p>
                      </div>
                      
                      <div className="pt-1">
                        {survey.termsAndConditions.enableSurveyOnlyAfterAcceptingTnC ? (
                          <div className="flex items-center gap-1.5 text-[10px] bg-amber-50 border border-amber-200/50 text-amber-800 p-1.5 rounded-lg font-bold">
                            <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
                            <span>Must Accept T&C to Proceed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-200/50 text-slate-700 p-1.5 rounded-lg font-bold">
                            <CheckCircle2 size={13} className="text-slate-500 flex-shrink-0" />
                            <span>Informational T&C (Optional)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic py-4">No terms or declarations are configured for this survey.</p>
                  )}
                </div>
              </div>

              {/* End Screen Config */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-55 pb-2.5">
                    <div className="flex items-center gap-2 text-gray-800">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">End Screen</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      survey.surveyEndConfigPage?.isEnabled 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {survey.surveyEndConfigPage?.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {survey.surveyEndConfigPage?.isEnabled ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-gray-400 font-bold">Screen Title</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{survey.surveyEndConfigPage.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold">End Message</p>
                        <p className="text-gray-600 leading-relaxed mt-0.5">{survey.surveyEndConfigPage.description || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic py-4">Default "Thank you" screen will be used upon completion.</p>
                  )}
                </div>

                {survey.surveyEndConfigPage?.isEnabled && survey.surveyEndConfigPage.buttonLabelName && (
                  <div className="pt-3 border-t border-gray-50 mt-4 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold">Redirect Button:</span>
                      <span className="font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        {survey.surveyEndConfigPage.buttonLabelName}
                      </span>
                    </div>
                    {survey.surveyEndConfigPage.buttonLink && (
                      <a 
                        href={survey.surveyEndConfigPage.buttonLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-0.5 break-all"
                      >
                        <ExternalLink size={10} />
                        {survey.surveyEndConfigPage.buttonLink}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Custom fields section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-55 pb-3">
                <Layers size={18} className="text-blue-600" />
                <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Custom Fields Gathered</h4>
              </div>

              {(!survey.customFields || survey.customFields.length === 0) ? (
                <div className="text-center py-8 text-gray-400 italic text-xs">
                  No additional demographic or user custom fields are collected by this survey configuration.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {survey.customFields.map((field) => (
                    <div key={field.fieldName} className="flex items-start justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{field.labelName}</span>
                          {field.isRequired ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-red-50 text-red-750 border border-red-200/20">Required</span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gray-200 text-gray-500">Optional</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">Placeholder: <span className="text-slate-550 font-semibold">"{field.placeholder || 'N/A'}"</span></p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold font-mono pt-1">
                          <span>Key: <span className="text-slate-600">{field.fieldName}</span></span>
                          <span>•</span>
                          <span>Type: <span className="text-slate-600 uppercase text-[9px]">{field.type}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer text if available */}
            {survey.footer && (
              <div className="text-center text-xs text-gray-400 font-medium italic pt-2">
                Footer Banner: "{survey.footer}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyDetails;
