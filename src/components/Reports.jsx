import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Filter, Calendar, ChevronDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { mockSurveys, mockNPSData } from '../utils/mockData';

const Reports = () => {
  const [reportType, setReportType] = useState('nps');
  const [dateRange, setDateRange] = useState('6m');
  const [selectedSurvey, setSelectedSurvey] = useState('all');

  const handleDownload = (format) => {
    // Generate report data
    let reportData = {};
    
    if (reportType === 'nps') {
      reportData = {
        title: 'NPS Performance Report',
        generatedAt: new Date().toISOString(),
        data: mockNPSData,
        summary: {
          averageNPS: Math.round(mockNPSData.reduce((sum, d) => sum + d.score, 0) / mockNPSData.length),
          totalResponses: mockNPSData.reduce((sum, d) => sum + d.responses, 0),
          trend: mockNPSData[mockNPSData.length - 1].score - mockNPSData[0].score,
        }
      };
    } else if (reportType === 'surveys') {
      const filteredSurveys = selectedSurvey === 'all' ? mockSurveys : mockSurveys.filter(s => s.id === selectedSurvey);
      reportData = {
        title: 'Survey Response Report',
        generatedAt: new Date().toISOString(),
        surveys: filteredSurveys.map(s => ({
          name: s.name,
          store: s.storeName,
          status: s.status,
          responses: s.responses,
          npsScore: s.npsScore,
          questions: s.questions.length,
        })),
        totalResponses: filteredSurveys.reduce((sum, s) => sum + s.responses, 0),
      };
    }

    // Create download
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Report downloaded as ${format.toUpperCase()}!`);
  };

  const exportToCSV = () => {
    let csvData = [];
    
    if (reportType === 'nps') {
      csvData = [['Month', 'NPS Score', 'Responses', 'Promoters', 'Passives', 'Detractors']];
      mockNPSData.forEach(d => {
        csvData.push([d.month, d.score, d.responses, d.promoters, d.passives, d.detractors]);
      });
    } else if (reportType === 'surveys') {
      csvData = [['Survey Name', 'Store', 'Status', 'Responses', 'NPS Score', 'Questions']];
      const filtered = selectedSurvey === 'all' ? mockSurveys : mockSurveys.filter(s => s.id === selectedSurvey);
      filtered.forEach(s => {
        csvData.push([s.name, s.storeName, s.status, s.responses, s.npsScore || 'N/A', s.questions.length]);
      });
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('CSV report downloaded!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Generate and download detailed reports</p>
      </div>

      {/* Report Configuration */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Report Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="nps">NPS Trend Report</option>
              <option value="surveys">Survey Performance Report</option>
              <option value="responses">Detailed Responses Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Survey</label>
            <select
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="input-field"
            >
              <option value="all">All Surveys</option>
              {mockSurveys.map(survey => (
                <option key={survey.id} value={survey.id}>{survey.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Report Preview</h3>
        
        {reportType === 'nps' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(mockNPSData.reduce((sum, d) => sum + d.score, 0) / mockNPSData.length)}
                </p>
                <p className="text-sm text-gray-600">Average NPS</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {mockNPSData.reduce((sum, d) => sum + d.responses, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Responses</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {mockNPSData[mockNPSData.length - 1].score - mockNPSData[0].score > 0 ? '+' : ''}
                  {mockNPSData[mockNPSData.length - 1].score - mockNPSData[0].score}
                </p>
                <p className="text-sm text-gray-600">Trend (6 months)</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Month</th>
                    <th className="px-4 py-2 text-left">NPS Score</th>
                    <th className="px-4 py-2 text-left">Responses</th>
                    <th className="px-4 py-2 text-left">Promoters</th>
                    <th className="px-4 py-2 text-left">Passives</th>
                    <th className="px-4 py-2 text-left">Detractors</th>
                  </tr>
                </thead>
                <tbody>
                  {mockNPSData.map((data, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="px-4 py-2">{data.month}</td>
                      <td className="px-4 py-2 font-semibold">{data.score}</td>
                      <td className="px-4 py-2">{data.responses}</td>
                      <td className="px-4 py-2 text-green-600">{data.promoters}</td>
                      <td className="px-4 py-2 text-yellow-600">{data.passives}</td>
                      <td className="px-4 py-2 text-red-600">{data.detractors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'surveys' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Survey Name</th>
                    <th className="px-4 py-2 text-left">Store</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Responses</th>
                    <th className="px-4 py-2 text-left">NPS Score</th>
                    <th className="px-4 py-2 text-left">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedSurvey === 'all' ? mockSurveys : mockSurveys.filter(s => s.id === selectedSurvey)).map((survey) => (
                    <tr key={survey.id} className="border-t border-gray-100">
                      <td className="px-4 py-2 font-medium">{survey.name}</td>
                      <td className="px-4 py-2">{survey.storeName}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          survey.status === 'active' ? 'bg-green-100 text-green-700' :
                          survey.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {survey.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{survey.responses}</td>
                      <td className="px-4 py-2">{survey.npsScore || '—'}</td>
                      <td className="px-4 py-2">{survey.questions.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Download Report</h3>
        <div className="flex flex-wrap gap-4">
          {/* <button
            onClick={() => handleDownload('json')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText size={18} />
            Download as JSON
          </button> */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet size={18} />
            Download as CSV
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText size={18} />
            Download as PDF
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Reports include all data based on selected filters and date range
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{mockSurveys.length}</p>
          <p className="text-sm text-gray-500">Total Surveys</p>
        </div>
        <div className="card text-center">
          <PieChartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {Math.round(mockSurveys.filter(s => s.status === 'active').length / mockSurveys.length * 100)}%
          </p>
          <p className="text-sm text-gray-500">Active Rate</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {mockNPSData.reduce((sum, d) => sum + d.responses, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;