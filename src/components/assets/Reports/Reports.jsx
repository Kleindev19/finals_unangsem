import React, { useState } from 'react';
import './Reports.css';

// Inline SVG Icon for the placeholder (Lucide-react inspired)
const BarChartBigIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V6"/><path d="M8 17v4"/>
    </svg>
);

const Reports = () => {
    const [institute, setInstitute] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');
    const [reportData, setReportData] = useState(null); // Will hold the generated report data

    // Placeholder data for dropdowns
    const institutes = ['Institute 1', 'Institute 2', 'Institute 3'];
    const yearLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['Section A', 'Section B', 'Section C'];

    const handleGenerateReport = () => {
        // --- Placeholder Logic for Report Generation ---
        if (!institute || !yearLevel || !section) {
            alert('Please select an Institute, Year Level, and Section before generating the report.');
            return;
        }

        // Simulate fetching/generating report data
        const simulatedData = {
            id: Date.now(),
            filters: { institute, yearLevel, section },
            summary: `Attendance Report Summary for ${institute}, ${yearLevel} - ${section}`,
            details: [
                { name: 'Total Students', value: 85 },
                { name: 'Average Attendance Rate', value: '92.5%' },
                { name: 'Students with low attendance', value: 5 },
            ]
        };
        setReportData(simulatedData);
    };

    const renderReportContent = () => {
        if (!reportData) {
            return (
                <div className="report-placeholder">
                    <BarChartBigIcon className="report-placeholder-icon" />
                    <h3>No Report Generated</h3>
                    <p>Select the filters above and click 'Generate Report' to view the analytics.</p>
                </div>
            );
        }

        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{reportData.summary}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportData.details.map((item, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg shadow-md border-l-4 border-green-500">
                            <p className="text-sm font-medium text-gray-500">{item.name}</p>
                            <p className="text-3xl font-extrabold text-green-700 mt-1">{item.value}</p>
                        </div>
                    ))}
                </div>
                
                {/* Add more detailed report structure here (e.g., tables, charts) */}
                <div className="mt-8 p-4 border rounded-lg bg-gray-50 text-left">
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">Detailed View (Placeholder)</h4>
                    <p className="text-gray-600">
                        This area would display tables, graphs, and detailed student data based on the selected criteria. 
                        Filters: {reportData.filters.institute}, {reportData.filters.yearLevel}, {reportData.filters.section}
                    </p>
                </div>
            </div>
        );
    };


    return (
        <div className="reports-page">
            <div className="reports-header">
                <h1>Reports</h1>
            </div>

            {/* Controls Bar (Filters) */}
            <div className="report-controls-bar">
                
                {/* Institute Dropdown */}
                <select value={institute} onChange={(e) => setInstitute(e.target.value)}>
                    <option value="">Select Institute</option>
                    {institutes.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>

                {/* Year Level Dropdown */}
                <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
                    <option value="">Select Year Level</option>
                    {yearLevels.map(year => <option key={year} value={year}>{year}</option>)}
                </select>

                {/* Section Dropdown */}
                <select value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="">Select Section</option>
                    {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>

                {/* Generate Button */}
                <button className="generate-report-btn" onClick={handleGenerateReport}>
                    Generate Report
                </button>
            </div>

            {/* Main Report Content Area */}
            <div className="report-content-area">
                {renderReportContent()}
            </div>
        </div>
    );
};

export default Reports;