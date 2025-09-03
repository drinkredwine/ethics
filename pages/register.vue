<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t("auth.createAccount") }}
        </h2>
      </div>
      <form
        class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg"
        @submit.prevent="handleRegister"
      >
        <div class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
              >{{ $t("auth.email") }}</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >{{ $t("auth.password") }}</label
            >
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{
              loading
                ? $t("auth.creatingAccount")
                : $t("auth.createAccountButton")
            }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ $t("auth.hasAccount") }}
            <NuxtLink
              :to="$localePath('/login')"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {{ $t("auth.signInLink") }}
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Get the current origin for redirect URL
    const origin = process.client
      ? window.location.origin
      : "http://localhost:3000";

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (authError) {
      error.value = authError.message;
      return;
    }

    // Check if email confirmation is required
    if (data?.user && !data.session) {
      error.value = "Please check your email for a confirmation link.";
      return;
    }

    // If we have a session, user is logged in
    if (data?.session) {
      const localePath = useLocalePath();
      await navigateTo(localePath("/assessment"));
    }
  } catch (err) {
    console.error("Registration navigation error:", err);
    // Try fallback navigation without localization
    try {
      if (data?.session) {
        await navigateTo("/assessment");
      }
    } catch (fallbackErr) {
      console.error("Fallback navigation error:", fallbackErr);
      error.value =
        "Registration successful, but navigation failed. Please manually go to the assessment page.";
    }
  } finally {
    loading.value = false;
  }
};

// Note: Authentication redirect is handled by global middleware

const { t } = useI18n();

useHead({
  title: t("auth.createAccount") + " - Kohlberg Assessment",
});
</script>
