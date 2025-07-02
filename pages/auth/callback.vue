<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
          ></div>
          <h2 class="text-2xl font-bold text-gray-900">
            Confirming your email...
          </h2>
          <p class="text-gray-600">Please wait while we verify your account.</p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div
            class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Confirmation Failed</h2>
          <p class="text-gray-600">{{ error }}</p>
          <NuxtLink
            :to="$localePath('/login')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Login
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div
            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Email Confirmed!</h2>
          <p class="text-gray-600">
            Your account has been successfully verified. You can now start
            taking assessments.
          </p>
          <NuxtLink
            :to="$localePath('/assessment')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Assessment
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const supabase = useSupabaseClient();
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    // Get URL parameters
    const { access_token, refresh_token, type } = route.query;

    if (type === "signup" && access_token && refresh_token) {
      // Set the session using the tokens from the URL
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: String(access_token),
        refresh_token: String(refresh_token),
      });

      if (sessionError) {
        error.value = sessionError.message;
      } else {
        // Redirect to assessment page after successful confirmation
        setTimeout(() => {
          navigateTo("/assessment");
        }, 2000);
      }
    } else {
      // Check current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        error.value = sessionError.message;
      } else if (session) {
        // User is already logged in, redirect to assessment
        setTimeout(() => {
          navigateTo("/assessment");
        }, 2000);
      } else {
        error.value =
          "No valid confirmation found. Please try registering again.";
      }
    }
  } catch (err) {
    error.value = "Failed to confirm email. Please try again.";
    console.error("Auth callback error:", err);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: "Email Confirmation - Kohlberg Assessment",
});
</script>
