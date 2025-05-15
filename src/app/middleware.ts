// // File: middleware.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// // Admin routes that need protection
// const adminRoutes = [
//     '/dashboard/portfolio-management',
//     '/dashboard/user-management',
//     '/dashboard/employment-management'
// ];

// // Role ID that is allowed to access admin routes (assuming 3 is admin based on your previous code)
// const ADMIN_ROLE_ID = 3;

// export async function middleware(req: NextRequest) {
//     const path = req.nextUrl.pathname;

//     // Check if the current path is an admin route
//     const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

//     if (isAdminRoute) {
//         // Get the token from the request
//         const token = await getToken({
//             req,
//             secret: process.env.NEXTAUTH_SECRET,
//         });

//         // If no token exists or user doesn't have admin role, redirect to login
//         if (!token || token.roleId !== ADMIN_ROLE_ID) {
//             const url = new URL('/login', req.url);
//             // Add a redirect parameter to return after login
//             url.searchParams.set('callbackUrl', path);
//             return NextResponse.redirect(url);
//         }
//     }

//     // Continue with the request
//     return NextResponse.next();
// }

// // Configure which routes this middleware should run on
// export const config = {
//     matcher: [
//         '/dashboard/:path*', // Apply to all dashboard routes
//     ],
// };