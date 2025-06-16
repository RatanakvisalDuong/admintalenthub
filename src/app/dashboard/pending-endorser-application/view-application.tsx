// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import axios from 'axios';

// interface EndorserApplication {
//     id: number;
//     name: string;
//     email: string;
//     contact: string;
//     created_at: string;
// }

// interface EndorserApplicationDetail {
//     id: number;
//     name: string;
//     contact: string;
//     email: string;
//     company: string;
//     working_position: string;
//     student_name: string[];
//     image: string;
//     status: number;
//     created_at: string;
//     updated_at: string;
//     image_url: string;
// }

// interface EndorserRequestResponse {
//     success: boolean;
//     count: number;
//     data: EndorserApplication[];
// }

// export default function ViewApplicationDialog() {
//     const { data: session } = useSession();
//     const [applications, setApplications] = useState<EndorserApplication[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string>('');
    
//     // Dialog states
//     const [selectedApplication, setSelectedApplication] = useState<EndorserApplicationDetail | null>(null);
//     const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
//     const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
//     const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null);
//     const [detailLoading, setDetailLoading] = useState<boolean>(false);
//     const [actionLoading, setActionLoading] = useState<boolean>(false);
//     const [successMessage, setSuccessMessage] = useState<string>('');

//     useEffect(() => {
//         const fetchApplications = async () => {
//             if (!session?.user?.accessToken) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get<EndorserRequestResponse>(
//                     'https://talenthub.newlinkmarketing.com/api/admin_view_all_endorser_request',
//                     {
//                         headers: {
//                             Authorization: `Bearer ${session.user.accessToken}`,
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );

//                 if (response.data.success) {
//                     setApplications(response.data.data);
//                 } else {
//                     setError('Failed to fetch applications');
//                 }
//             } catch (err) {
//                 console.error('Error fetching endorser applications:', err);
//                 setError('An error occurred while fetching applications');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchApplications();
//     }, [session?.user?.accessToken]);

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const handleViewDetail = async (application: EndorserApplication) => {
//         if (!session?.user?.accessToken) return;
        
//         setDetailLoading(true);
//         setShowDetailDialog(true);
        
//         try {
//             const response = await axios.get(
//                 `https://talenthub.newlinkmarketing.com/api/admin_view_endorser_request_detail/${application.id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${session.user.accessToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
            
//             if (response.data.success) {
//                 setSelectedApplication(response.data.data);
//             } else {
//                 setError('Failed to fetch application details');
//                 setShowDetailDialog(false);
//             }
//         } catch (err) {
//             console.error('Error fetching application details:', err);
//             setError('An error occurred while fetching application details');
//             setShowDetailDialog(false);
//         } finally {
//             setDetailLoading(false);
//         }
//     };

//     const handleAction = (type: 'approve' | 'decline') => {
//         setActionType(type);
//         setShowConfirmDialog(true);
//     };

//     const confirmAction = async () => {
//         if (!selectedApplication || !actionType || !session?.user?.accessToken) return;
        
//         setActionLoading(true);
        
//         try {
//             const response = await axios.post(
//                 `https://talenthub.newlinkmarketing.com/api/admin_update_endorser_request/${selectedApplication.id}`,
//                 {
//                     status: actionType === 'approve' ? 1 : 0
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${session.user.accessToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
            
//             if (response.data.success) {
//                 setSuccessMessage(`Application ${actionType === 'approve' ? 'approved' : 'declined'} successfully!`);
                
//                 // Remove the application from the list
//                 setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
                
//                 // Close dialogs
//                 setShowConfirmDialog(false);
//                 setShowDetailDialog(false);
//                 setSelectedApplication(null);
//                 setActionType(null);
                
//                 // Clear success message after 4 seconds
//                 setTimeout(() => setSuccessMessage(''), 4000);
//             } else {
//                 setError(`Failed to ${actionType} application`);
//             }
//         } catch (err) {
//             console.error(`Error ${actionType}ing application:`, err);
//             setError(`An error occurred while ${actionType}ing the application`);
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 mb-4"></div>
//                 <p className="text-lg text-gray-600">Loading applications...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4 text-base">
//                     {error}
//                 </div>
//                 <button 
//                     onClick={() => window.location.reload()} 
//                     className="bg-blue-500 text-white px-6 py-3 rounded-lg text-base hover:bg-blue-600 transition-colors duration-200"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col h-screen p-8 bg-gray-50">
//             {/* Success Message */}
//             {successMessage && (
//                 <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 border-l-4 border-green-700">
//                     <div className="flex items-center">
//                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                         </svg>
//                         {successMessage}
//                     </div>
//                 </div>
//             )}
            
//             <div className="mb-6">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Endorser Applications</h1>
//                 <p className="text-lg text-gray-600 mb-4">Review and manage endorser application requests</p>
                
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-center">
//                         <div className="bg-blue-100 rounded-full p-2 mr-3">
//                             <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                         <div>
//                             <p className="text-base font-semibold text-blue-800">Total Applications: {applications.length}</p>
//                             <p className="text-sm text-blue-600">Applications pending review and approval</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//                 {/* Table Header */}
//                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex-shrink-0">
//                     <div className="grid grid-cols-12 gap-4 px-6 py-4">
//                         <div className="col-span-3 text-base font-semibold text-gray-700">
//                             <div className="flex items-center">
//                                 <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                                 </svg>
//                                 Applicant Name
//                             </div>
//                         </div>
//                         <div className="col-span-4 text-base font-semibold text-gray-700">
//                             <div className="flex items-center">
//                                 <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//                                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                                 </svg>
//                                 Email Address
//                             </div>
//                         </div>
//                         <div className="col-span-3 text-base font-semibold text-gray-700">
//                             <div className="flex items-center">
//                                 <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//                                     <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                 </svg>
//                                 Contact Number
//                             </div>
//                         </div>
//                         <div className="col-span-2 text-base font-semibold text-gray-700">Actions</div>
//                     </div>
//                 </div>

//                 {/* Table Body */}
//                 <div className="overflow-y-auto flex-1">
//                     {applications && applications.length > 0 ? (
//                         applications.map((application, index) => (
//                             <div 
//                                 key={application.id || index} 
//                                 className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
//                             >
//                                 {/* Applicant Name */}
//                                 <div className="col-span-3 flex items-center">
//                                     <div className="flex items-center">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
//                                             <span className="text-white font-semibold text-base">
//                                                 {application.name ? application.name.charAt(0).toUpperCase() : 'N'}
//                                             </span>
//                                         </div>
//                                         <div>
//                                             <div className="font-medium text-base text-gray-900">
//                                                 {application.name || 'N/A'}
//                                             </div>
//                                             <div className="text-sm text-gray-500">
//                                                 {application.created_at ? formatDate(application.created_at) : ''}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Email */}
//                                 <div className="col-span-4 flex items-center">
//                                     <div className="text-base text-gray-700 truncate">
//                                         {application.email || 'N/A'}
//                                     </div>
//                                 </div>

//                                 {/* Contact */}
//                                 <div className="col-span-3 flex items-center">
//                                     <div className="text-base text-gray-700">
//                                         {application.contact || 'N/A'}
//                                     </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="col-span-2 flex items-center space-x-2">
//                                     <button
//                                         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                         onClick={() => handleViewDetail(application)}
//                                     >
//                                         View Details
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                                         onClick={() => console.log('Approve:', application)}
//                                     >
//                                         Approve
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                                         onClick={() => console.log('Reject:', application)}
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="p-12 text-center">
//                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Found</h3>
//                             <p className="text-base text-gray-500">
//                                 There are currently no pending endorser applications to review.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Application Detail Dialog */}
//             {showDetailDialog && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//                         {/* Dialog Header */}
//                         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-xl font-bold">Endorser Application Details</h3>
//                                 <button
//                                     onClick={() => {
//                                         setShowDetailDialog(false);
//                                         setSelectedApplication(null);
//                                     }}
//                                     className="text-white hover:text-gray-200 transition-colors"
//                                 >
//                                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Dialog Body */}
//                         <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//                             {detailLoading ? (
//                                 <div className="flex items-center justify-center py-12">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//                                     <span className="ml-3 text-lg text-gray-600">Loading application details...</span>
//                                 </div>
//                             ) : selectedApplication ? (
//                                 <div className="space-y-6">
//                                     {/* Personal Information */}
//                                     <div className="bg-gray-50 rounded-lg p-6">
//                                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                             <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                                             </svg>
//                                             Personal Information
//                                         </h4>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{selectedApplication.name}</p>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{selectedApplication.email}</p>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{selectedApplication.contact}</p>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{formatDate(selectedApplication.created_at)}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Professional Information */}
//                                     <div className="bg-gray-50 rounded-lg p-6">
//                                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                             <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                             Professional Information
//                                         </h4>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{selectedApplication.company}</p>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//                                                 <p className="text-base text-gray-900 bg-white p-3 rounded-md border">{selectedApplication.working_position}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Student Endorsements */}
//                                     <div className="bg-gray-50 rounded-lg p-6">
//                                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                             <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//                                                 <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//                                             </svg>
//                                             Student Endorsements ({selectedApplication.student_name.length})
//                                         </h4>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                                             {selectedApplication.student_name.map((student, index) => (
//                                                 <div key={index} className="bg-white p-3 rounded-md border flex items-center">
//                                                     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
//                                                         <span className="text-purple-600 font-semibold text-sm">{student.charAt(0)}</span>
//                                                     </div>
//                                                     <span className="text-base text-gray-900">{student}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     {/* Profile Image */}
//                                     {selectedApplication.image_url && (
//                                         <div className="bg-gray-50 rounded-lg p-6">
//                                             <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                                 <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                                                 </svg>
//                                                 Profile Image
//                                             </h4>
//                                             <div className="flex justify-center">
//                                                 <img 
//                                                     src={selectedApplication.image_url} 
//                                                     alt={`${selectedApplication.name}'s profile`}
//                                                     className="max-w-xs max-h-64 object-cover rounded-lg shadow-md border"
//                                                     onError={(e) => {
//                                                         e.currentTarget.style.display = 'none';
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-8">
//                                     <p className="text-gray-500">No application details available</p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Dialog Footer */}
//                         {selectedApplication && !detailLoading && (
//                             <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
//                                 <button
//                                     onClick={() => {
//                                         setShowDetailDialog(false);
//                                         setSelectedApplication(null);
//                                     }}
//                                     className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
//                                 >
//                                     Close
//                                 </button>
//                                 <button
//                                     onClick={() => handleAction('decline')}
//                                     className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//                                 >
//                                     Decline
//                                 </button>
//                                 <button
//                                     onClick={() => handleAction('approve')}
//                                     className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//                                 >
//                                     Approve
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Confirmation Dialog */}
//             {showConfirmDialog && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
//                         <div className="p-6">
//                             <div className="flex items-center mb-4">
//                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
//                                     actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
//                                 }`}>
//                                     {actionType === 'approve' ? (
//                                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     ) : (
//                                         <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-900">
//                                         {actionType === 'approve' ? 'Approve Application' : 'Decline Application'}
//                                     </h3>
//                                     <p className="text-sm text-gray-600">
//                                         Are you sure you want to {actionType} this endorser application?
//                                     </p>
//                                 </div>
//                             </div>
                            
//                             {selectedApplication && (
//                                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                                     <p className="text-sm text-gray-600">Applicant:</p>
//                                     <p className="font-medium text-gray-900">{selectedApplication.name}</p>
//                                     <p className="text-sm text-gray-600">{selectedApplication.email}</p>
//                                 </div>
//                             )}

//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     onClick={() => {
//                                         setShowConfirmDialog(false);
//                                         setActionType(null);
//                                     }}
//                                     disabled={actionLoading}
//                                     className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={confirmAction}
//                                     disabled={actionLoading}
//                                     className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 ${
//                                         actionType === 'approve' 
//                                             ? 'bg-green-600 hover:bg-green-700' 
//                                             : 'bg-red-600 hover:bg-red-700'
//                                     }`}
//                                 >
//                                     {actionLoading ? (
//                                         <div className="flex items-center">
//                                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Processing...
//                                         </div>
//                                     ) : (
//                                         `${actionType === 'approve' ? 'Approve' : 'Decline'}`
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }