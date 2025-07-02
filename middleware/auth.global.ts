export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  
  // Public routes that don't require authentication (including language prefixes)
  const publicRoutes = ['/', '/en', '/login', '/register', '/debug', '/en/login', '/en/register', '/en/debug']
  
  // If user is not logged in and trying to access a protected route
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
  
  // If user is logged in and trying to access auth pages, redirect to assessment
  if (user.value && (to.path.includes('/login') || to.path.includes('/register'))) {
    return navigateTo('/assessment')
  }
})