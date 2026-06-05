import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, ChevronDown, BarChart3, PieChart as PieChartIcon, Loader, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import api from '../services/apiService';

const Reports = () => {
  const { selectedBrand } = useBrand();
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [detailedResponses, setDetailedResponses] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });


  const [surveySummaryMap, setSurveySummaryMap] = useState({});

  // Pagination for detailed responses
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  const [reportType, setReportType] = useState('monthly');


  const [previewModal, setPreviewModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // Fetch surveys for the selected brand
  const fetchSurveys = async () => {
    if (!selectedBrand?.brandCode && !selectedBrand?.code) {
      console.log('No brand code available:', selectedBrand);
      return;
    }

    const brandCode = selectedBrand?.brandCode || selectedBrand?.code;
    console.log('Fetching surveys for brand code:', brandCode);

    setLoading(true);
    try {
      const response = await api.get(`/survey-config/brand/${brandCode}?page=0&size=100`);
      console.log('Surveys API Response:', response);

      // Extract surveys from response
      let surveysList = [];
      if (response.data && response.data.content) {
        surveysList = response.data.content;
      } else if (response.content) {
        surveysList = response.content;
      } else if (response.data && Array.isArray(response.data)) {
        surveysList = response.data;
      } else if (Array.isArray(response)) {
        surveysList = response;
      }

      console.log('Extracted surveys list:', surveysList);

      if (surveysList && surveysList.length > 0) {
        setSurveys(surveysList);

        fetchSurveySummary(
          surveysList.map((survey) => survey.id)
        );
        // Auto-select first survey
        if (!selectedSurvey) {
          setSelectedSurvey(surveysList[0].id);
        }
      } else {
        setSurveys([]);
        console.log('No surveys found');
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchSurveySummary = async (surveyIds) => {
    if (!selectedBrand?.id || surveyIds.length === 0) return;

    try {
      const response = await api.post(
        `/v1/survey/summary/${selectedBrand.id}`,
        {
          surveyId: surveyIds,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          page: 0,
          size: 100
        }
      );

      const summaryData = response.data?.content || [];

      const summaryMap = {};

      summaryData.forEach((item) => {
        summaryMap[item.surveyId] = item;
      });

      setSurveySummaryMap(summaryMap);
    } catch (error) {
      console.error("Error fetching survey summary:", error);
      setSurveySummaryMap({});
    }
  };

  // Fetch monthly NPS summary
  const fetchMonthlySummary = async () => {
    if (!selectedBrand?.id) {
      console.log('No brand ID available:', selectedBrand);
      return;
    }

    try {
      console.log('Fetching monthly summary for brand ID:', selectedBrand.id);
      const response = await api.post(`/v1/survey/summary/monthly/${selectedBrand.id}`, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      console.log('Monthly Summary API Response:', response);

      let monthlyDataList = [];
      if (response.data && Array.isArray(response.data)) {
        monthlyDataList = response.data;
      } else if (Array.isArray(response)) {
        monthlyDataList = response;
      }

      setMonthlyData(monthlyDataList);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setMonthlyData([]);
    }
  };

  // Fetch detailed responses for selected survey
  const fetchDetailedResponses = async () => {
    if (!selectedSurvey) {
      console.log('No survey selected');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching detailed responses for survey ID:', selectedSurvey);
      console.log('Date range:', dateRange);

      const response = await api.post(`/survey-response/survey-answers/${selectedSurvey}`, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        page: currentPage,
        size: pageSize
      });

      console.log('Detailed Responses API Response:', response);

      let responsesList = [];
      let totalPagesCount = 0;
      let totalElementsCount = 0;

      if (response.data) {
        responsesList = response.data.content || [];
        totalPagesCount = response.data.totalPages || 0;
        totalElementsCount = response.data.totalElements || 0;
      } else if (response.content) {
        responsesList = response.content || [];
        totalPagesCount = response.totalPages || 0;
        totalElementsCount = response.totalElements || 0;
      }

      console.log('Extracted responses:', responsesList);

      setDetailedResponses(responsesList);
      setTotalPages(totalPagesCount);
      setTotalElements(totalElementsCount);
    } catch (error) {
      console.error('Error fetching detailed responses:', error);
      setDetailedResponses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType === "surveys" && surveys.length > 0) {
      fetchSurveySummary(
        surveys.map((survey) => survey.id)
      );
    }
  }, [dateRange, reportType]);

  useEffect(() => {
    if (selectedBrand) {
      console.log('Selected brand changed:', selectedBrand);
      fetchSurveys();
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand?.id) {
      fetchMonthlySummary();
    }
  }, [selectedBrand, dateRange]);

  useEffect(() => {
    if (selectedSurvey && reportType === 'responses') {
      fetchDetailedResponses();
    }
  }, [selectedSurvey, currentPage, dateRange, reportType]);

  // Export to CSV
  const exportToCSV = () => {
    if (reportType === 'monthly') {
      const csvData = [['Month', 'Year', 'NPS Score', 'Total Responses', 'Promoters', 'Passives', 'Detractors', 'Total Surveys']];
      monthlyData.forEach(d => {
        csvData.push([
          getMonthName(d.month),
          d.year,
          d.npsScore?.toFixed(2) || 'N/A',
          d.totalUserSurveyed || 0,
          d.promoterCount || 0,
          d.passiveCount || 0,
          d.detractorsCount || 0,
          d.totalSurvey || 0
        ]);
      });
      downloadCSV(csvData, 'monthly_nps_report');
    } else if (reportType === 'surveys') {
const csvData = [[
  "Created At",
  "Survey Name",
  "Survey ID",
  "Survey Code",
  "Status",
  "Total Responses",
  "Start Date",
  "End Date"
]];

surveys.forEach((survey) => {
  const summary = surveySummaryMap[survey.id] || {};

  csvData.push([
    new Date(survey.createdAt).toLocaleDateString("en-IN"),
    survey.title,
    survey.id,
    survey.surveyCode,
    survey.status,
    summary.totalUserSurveyed ?? 0,
    survey.startDate,
    survey.endDate
  ]);

});
      downloadCSV(csvData, 'surveys_report');
    } else if (reportType === 'responses' && detailedResponses.length > 0) {
      // Dynamic headers based on custom fields and questions
      const firstResponse = detailedResponses[0];
      const customFieldHeaders = firstResponse.customFieldsAnswer?.map(cf => cf.fieldName) || [];
      const questionHeaders = firstResponse.surveyResponseAnswer?.map(q => q.questionText) || [];
      const headers = ['Mobile Number', 'Store ID', 'Address', 'State', 'Check No', ...customFieldHeaders, ...questionHeaders];

      const csvData = [headers];
      detailedResponses.forEach(response => {
        const row = [
          response.mobileNumber || 'N/A',
          response.storeId || 'N/A',
          response.address || 'N/A',
          response.state || 'N/A',
          response.checkNo || 'N/A'
        ];

        // Add custom field answers
        customFieldHeaders.forEach(header => {
          const field = response.customFieldsAnswer?.find(cf => cf.fieldName === header);
          row.push(field?.fieldsAnsRating || 'N/A');
        });

        // Add question answers
        questionHeaders.forEach(header => {
          const question = response.surveyResponseAnswer?.find(q => q.questionText === header);
          row.push(question?.answerRating || question?.commentText || 'N/A');
        });

        csvData.push(row);
      });
      downloadCSV(csvData, 'detailed_responses_report');
    }
  };

  const downloadCSV = (csvData, filename) => {
    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Report downloaded successfully!');
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || month;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Active</span>;
      case 'DRAFT':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Draft</span>;
      case 'PAUSED':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Paused</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and download detailed reports for {selectedBrand?.name}</p>
        </div>
      </div> */}

      {/* Report Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-orange-500" />
          Report Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="monthly">Monthly NPS Summary Report</option>
              <option value="surveys">Survey List Report</option>
              <option value="responses">Detailed Responses Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <span className="text-gray-500 self-center">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {reportType !== 'monthly' && reportType !== 'surveys' && (
            <div
              style={{
                "width": "70%",
                margin: "0 auto"
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Survey</label>
              <select
                value={selectedSurvey}
                onChange={(e) => {
                  setSelectedSurvey(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="">Select a survey</option>
                {surveys.map(survey => (
                  <option key={survey.id} value={survey.id}>{survey.title}</option>
                ))}
              </select>
              {surveys.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-1">No surveys found for this brand</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}

        {!loading && reportType === 'monthly' && (
          <div className="space-y-4">
            {monthlyData.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No data available for the selected date range</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">
                      {(monthlyData.reduce((sum, d) => sum + (d.npsScore || 0), 0) / monthlyData.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Average NPS Score</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">
                      {monthlyData.reduce((sum, d) => sum + (d.totalUserSurveyed || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Responses</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">
                      {monthlyData.reduce((sum, d) => sum + (d.promoterCount || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Promoters</p>
                  </div>
                  {/* <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-2xl font-bold text-orange-600">
                      {monthlyData.length}
                    </p>
                    <p className="text-sm text-gray-600">Months of Data</p>
                  </div> */}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Month</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">NPS Score</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Responses</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Promoters</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Passives</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Detractors</th>
                        {/* <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Surveys</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((data, idx) => (
                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{getMonthName(data.month)}</td>
                          <td className="px-4 py-3">{data.year}</td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{data.npsScore?.toFixed(1) || 'N/A'}</td>
                          <td className="px-4 py-3">{data.totalUserSurveyed || 0}</td>
                          <td className="px-4 py-3 text-green-600">{data.promoterCount || 0}</td>
                          <td className="px-4 py-3 text-yellow-600">{data.passiveCount || 0}</td>
                          <td className="px-4 py-3 text-red-600">{data.detractorsCount || 0}</td>
                          {/* <td className="px-4 py-3">{data.totalSurvey || 0}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {!loading && reportType === 'surveys' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Survey Name
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Survey ID
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Survey Code
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                    </th>

                    {/* <th className="px-4 py-3 text-left font-semibold">
                      Promoters
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Passives
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Detractors
                    </th> */}

                    <th className="px-4 py-3 text-left font-semibold">
                      Total Responses
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      Start Date
                    </th>

                    <th className="px-4 py-3 text-left font-semibold">
                      End Date
                    </th>




                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => {
                    const summary =
                      surveySummaryMap[survey.id] || {};

                    return (


                      <tr
                        key={survey.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {new Date(
                            survey.createdAt
                          ).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {survey.title}
                        </td>

                        <td className="px-4 py-3 font-mono text-xs">
                          {survey.id}
                        </td>

                        <td className="px-4 py-3">
                          {survey.surveyCode}
                        </td>

                        <td className="px-4 py-3">
                          {getStatusBadge(survey.status)}
                        </td>

                        {/* <td className="px-4 py-3 text-green-600 font-medium">
                          {summary.promoterCount ?? 0}
                        </td>

                        <td className="px-4 py-3 text-yellow-600 font-medium">
                          {summary.passiveCount ?? 0}
                        </td>

                        <td className="px-4 py-3 text-red-600 font-medium">
                          {summary.detractorsCount ?? 0}
                        </td> */}

                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {summary.totalUserSurveyed ?? 0}
                        </td>

                        <td className="px-4 py-3">
                          {survey.startDate}
                        </td>

                        <td className="px-4 py-3">
                          {survey.endDate}
                        </td>


                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {surveys.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No surveys found for this brand</p>
              </div>
            )}
          </div>
        )}

        {!loading && reportType === 'responses' && (
          <div className="space-y-4">
            {!selectedSurvey ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Please select a survey to view responses</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Submitted At
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Mobile Number</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Store ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">State</th>
                        {/* <th className="px-4 py-3 text-left font-semibold text-gray-700">Custom Fields</th> */}
                        {/* <th className="px-4 py-3 text-left font-semibold text-gray-700">Responses</th> */}
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                          View Response
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {detailedResponses.map((response, idx) => (
                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {response.createdAt
                              ? new Date(response.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">{response.mobileNumber || 'N/A'}</td>
                          <td className="px-4 py-3">{response.storeId || 'N/A'}</td>
                          <td className="px-4 py-3 max-w-xs truncate" title={response.address}>{response.address || 'N/A'}</td>
                          <td className="px-4 py-3">{response.state || 'N/A'}</td>
                          {/* <td className="px-4 py-3">
                            <div className="space-y-1">
                              {response.customFieldsAnswer?.map((cf, i) => (
                                <div key={i} className="text-xs">
                                  <span className="font-medium">{cf.fieldName}:</span> {cf.fieldsAnsRating}
                                </div>
                              ))}
                              {(!response.customFieldsAnswer || response.customFieldsAnswer.length === 0) && (
                                <span className="text-xs text-gray-400">No custom fields</span>
                              )}
                            </div>
                          </td>
                          {/* <td className="px-4 py-3">
                            <div className="space-y-1">
                              {response.surveyResponseAnswer?.map((q, i) => (
                                <div key={i} className="text-xs">
                                  <span className="font-medium">Q{i + 1}:</span> {q.answerRating !== undefined ? q.answerRating : (q.commentText || 'N/A')}
                                </div>
                              ))}
                              {(!response.surveyResponseAnswer || response.surveyResponseAnswer.length === 0) && (
                                <span className="text-xs text-gray-400">No responses</span>
                              )}
                            </div>
                          </td> */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedResponse(response);
                                setPreviewModal(true);
                              }}
                              className="text-orange-500 hover:text-orange-700"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-3 py-2 text-sm">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {detailedResponses.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No responses found for the selected survey and date range</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download size={20} className="text-orange-500" />
          Download Report
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToCSV}
            disabled={loading || (reportType === 'responses' && (!selectedSurvey || detailedResponses.length === 0))}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            Download as CSV
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Reports include all data based on selected filters and date range
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{surveys.length}</p>
          <p className="text-sm text-gray-500">Total Surveys</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <PieChartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {surveys.filter(s => s.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-500">Active Surveys</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {monthlyData.reduce((sum, d) => sum + (d.totalUserSurveyed || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Feedback</p>
        </div>
      </div>




      {previewModal && selectedResponse && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">

            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold">
                Survey Response Details
              </h3>

              <button
                onClick={() => {
                  setPreviewModal(false);
                  setSelectedResponse(null);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">

              {/* Customer Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-3">
                  Customer Information
                </h4>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <span className="font-medium">Mobile:</span>{" "}
                    {selectedResponse.mobileNumber}
                  </div>

                  <div>
                    <span className="font-medium">Store:</span>{" "}
                    {selectedResponse.storeId}
                  </div>

                  <div>
                    <span className="font-medium">State:</span>{" "}
                    {selectedResponse.state}
                  </div>

                  <div>
                    <span className="font-medium">Check No:</span>{" "}
                    {selectedResponse.checkNo}
                  </div>

                  <div className="col-span-2">
                    <span className="font-medium">Submitted At:</span>{" "}
                    {new Date(
                      selectedResponse.createdAt
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-3">
                  Custom Fields
                </h4>

                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedResponse.customFieldsAnswer?.map(
                    (field, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-2 border-b last:border-b-0"
                      >
                        <span className="font-medium">
                          {field.fieldName}
                        </span>

                        <span>
                          {field.fieldsAnsRating}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Question Responses */}
              <div>
                <h4 className="font-semibold text-lg mb-3">
                  Survey Answers
                </h4>

                <div className="space-y-4">
                  {selectedResponse.surveyResponseAnswer?.map(
                    (question, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl p-4"
                      >
                        <p className="font-medium text-gray-800 mb-2">
                          {question.questionText}
                        </p>

                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-500">
                            Rating:
                          </span>

                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                            {question.answerRating}
                          </span>
                        </div>

                        {question.commentText && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            <span className="font-medium">
                              Comment:
                            </span>{" "}
                            {question.commentText}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;