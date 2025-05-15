'use client';

import { EmploymentData } from "@/app/type/employmentData";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function EmploymentManagementComponent({employmentData, jobTitles, companies}: { employmentData: EmploymentData[]; jobTitles: any[] ; companies: any[] }) {
    const COLORS = ['#0088FE', '#00C49F'];

    const JOB_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#7ED321', '#50E3C2', '#D0021B', '#4A90E2'];

    const COMPANY_COLORS = ['#FF6384', '#36A2EB',];

    // const [jobTitles] = useState([
    //     { title: 'Software Engineer', students: 130 },
    //     { title: 'Data Scientist', students: 118 },
    //     { title: 'Frontend Developer', students: 105 },
    //     { title: 'Backend Developer', students: 95 },
    //     { title: 'Product Manager', students: 82 },
    //     { title: 'UX/UI Designer', students: 76 },
    //     { title: 'DevOps Engineer', students: 64 },
    //     { title: 'Full Stack Developer', students: 58 },
    //     { title: 'QA Engineer', students: 53 },
    //     { title: 'Business Analyst', students: 47 },
    // ]);

    // const [companies] = useState([
    //     { title: 'Google', students: 130 },
    //     { title: 'Microsoft', students: 118 },
    //     { title: 'Amazon', students: 105 },
    //     { title: 'Facebook', students: 95 },
    //     { title: 'Apple', students: 82 },
    //     { title: 'IBM', students: 76 },
    //     { title: 'Intel', students: 64 },
    //     { title: 'NVIDIA', students: 58 },
    //     { title: 'Tesla', students: 53 },
    //     { title: 'Samsung', students: 47 },
    // ]);

    return (
        <div className="flex flex-col h-full p-8">
            <h1 className="text-2xl font-bold mb-4">Employment Management</h1>
            <div className='flex justify-between'>
                <div className="justify-center bg-white shadow-md rounded-lg p-4 w-112 h-112 hover:scale-105 transition-transform duration-300 group">
                    <h2 className="text-xl font-semibold mb-4 text-start">Employment Rate</h2>
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
                <div className="bg-white shadow-md rounded-lg w-full ml-4 hover:scale-103 transition-transform duration-300 group">
                    <h2 className="text-xl font-semibold text-start mt-4 ml-4 text-gray-900">
                        Top 10 Job Titles in TalentHub
                    </h2>
                    <div className="h-92 w-full mt-8">
                        <div className="grid grid-cols-2 gap-4 h-full px-4">
                            <div className="flex flex-col space-y-4">
                                {jobTitles.slice(0, 5).map((job, index) => (
                                    <div
                                        key={job.title}
                                        className={`flex justify-between items-center p-4 rounded-md shadow-lg transition-all duration-300
                                        ${index % 2 === 0 ? 'bg-blue-100' : 'bg-purple-100'}
                                        hover:scale-105 hover:shadow-xl animate-fade-in-up`}
                                    >
                                        <span className="text-sm font-medium text-gray-800 group-hover:animate-text-pop">{job.title}</span>
                                        <span className="text-sm font-medium text-gray-700 group-hover:animate-text-pop">{job.students} students</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col space-y-4">
                                {jobTitles.slice(5, 10).map((job, index) => (
                                    <div
                                        key={job.title}
                                        className={`flex justify-between items-center p-4 rounded-md shadow-lg transition-all duration-300
                                        ${index % 2 === 0 ? 'bg-blue-100' : 'bg-purple-100'}
                                        hover:scale-105 hover:shadow-xl animate-fade-in-up`}
                                    >
                                        <span className="text-sm font-medium text-gray-800">{job.title}</span>
                                        <span className="text-sm font-medium text-gray-700">{job.students} students</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg w-full hover:scale-103 transition-transform duration-300 group mt-8">
                <h2 className="text-xl font-semibold mb-4 text-start mt-4 ml-4">Top 10 Companies in TalentHub</h2>
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="title"
                                angle={-45}
                                textAnchor="end"
                                height={50}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', dy: 20, fontSize: 12 }}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip formatter={(value) => [`${value} students`]} />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{
                                    fontSize: 16,
                                    paddingTop: 30,
                                    bottom: -5,
                                    lineHeight: '40px',
                                    marginTop: '30px'
                                }}
                            />
                            <Bar
                                dataKey="students"
                                name="Companies Count"
                                fill={COMPANY_COLORS[0]}
                            >
                                {companies.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COMPANY_COLORS[index % 2]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="h-4 w-full">

            </div>
            
        </div>
    );

}