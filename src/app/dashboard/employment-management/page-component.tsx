'use client';

import { EmploymentData } from "@/app/type/employmentData";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function EmploymentManagementComponent({ employmentData, jobTitles, companies }: { employmentData: EmploymentData[]; jobTitles: any[]; companies: any[] }) {
    const COLORS = ['#0088FE', '#00C49F'];

    const JOB_COLORS = ['#f3f4f6', '#e5e7eb'];

    const COMPANY_COLORS = ['#3b82f6', '#1d4ed8'];

    return (
        <div className="flex flex-col h-full p-8 pb-4 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employment Management</h1>
            <p className="text-lg text-gray-600 mb-4">See the employment data here</p>
            
            <div className='flex justify-between'>
                {/* Employment Rate Chart */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 w-112 h-112">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Employment Rate</h2>
                    <div className="h-96 w-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={employmentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {employmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top 10 Job Titles */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg w-full ml-4">
                    <h2 className="text-lg font-semibold text-gray-800 mt-6 ml-6">
                        Top 10 Job Titles in TalentHub
                    </h2>
                    <div className="h-92 w-full mt-6">
                        <div className="grid grid-cols-2 gap-4 h-full px-6">
                            <div className="flex flex-col space-y-3">
                                {jobTitles.slice(0, 5).map((job, index) => (
                                    <div
                                        key={job.title}
                                        className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-800">{job.title}</span>
                                        <span className="text-sm font-medium text-gray-600">{job.students} students</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col space-y-3">
                                {jobTitles.slice(5, 10).map((job, index) => (
                                    <div
                                        key={job.title}
                                        className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-800">{job.title}</span>
                                        <span className="text-sm font-medium text-gray-600">{job.students} students</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top 10 Companies Chart */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg w-full mt-8 mb-2">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 mt-6 ml-6">Top 10 Companies in TalentHub</h2>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={companies}
                            margin={{
                                top: 30,
                                right: 40,
                                left: 40,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="title"
                                angle={-45}
                                textAnchor="end"
                                height={50}
                                interval={0}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis
                                label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', dy: 20, fontSize: 12, fill: '#6b7280' }}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <Tooltip 
                                formatter={(value) => [`${value} students`]}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{
                                    fontSize: 14,
                                    paddingTop: 30,
                                    bottom: -5,
                                    lineHeight: '40px',
                                    marginTop: '30px',
                                    color: '#374151'
                                }}
                            />
                            <Bar
                                dataKey="students"
                                name="Companies Count"
                                fill="#3b82f6"
                                radius={[2, 2, 0, 0]}
                            >
                                {companies.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COMPANY_COLORS[index % 2]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}