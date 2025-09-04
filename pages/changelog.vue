<template>
  <div class="changelog-page">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Product Changelog
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Track product updates, improvements, and upcoming features
        </p>
      </header>

      <!-- Current Status Section -->
      <section
        class="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
      >
        <h2
          class="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Current Status
        </h2>
        <div class="space-y-3">
          <div
            v-for="status in currentStatus"
            :key="status.title"
            class="flex items-start"
          >
            <div
              :class="`w-2 h-2 ${getStatusColor(
                status.color
              )} rounded-full mt-2 mr-3 flex-shrink-0`"
            ></div>
            <p class="text-gray-700 dark:text-gray-300">
              <strong>{{ status.title }}:</strong> {{ status.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Next Steps Section -->
      <section
        class="mb-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
      >
        <h2
          class="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          Next Steps
        </h2>
        <div
          class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          v-html="renderMarkdown(nextSteps)"
        ></div>
      </section>

      <!-- Changelog Entries -->
      <section class="space-y-6">
        <h2
          class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center"
        >
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          Changelog
        </h2>

        <!-- Dynamic Changelog Entries -->
        <div
          v-for="update in updates"
          :key="`${update.date}-${update.title}`"
          class="changelog-entry bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span
                :class="`px-3 py-1 text-xs font-medium rounded-full ${getBadgeClasses(
                  update.type
                )}`"
              >
                {{ update.type }}
              </span>
              <time
                class="text-sm text-gray-500 dark:text-gray-400 font-medium"
              >
                {{ update.date }}
              </time>
            </div>
            <span class="text-sm text-gray-400 dark:text-gray-500">
              {{ update.version }}
            </span>
          </div>

          <h3
            class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
          >
            {{ update.title }}
          </h3>

          <div
            class="prose dark:prose-invert max-w-none"
            v-html="renderMarkdown(update.content)"
          ></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { marked } from "marked";

// Set page meta
definePageMeta({
  title: "Changelog",
  description: "Product updates and feature releases",
});

// Set page title
useHead({
  title: "Changelog - Product Updates",
});

// Current Status Data
const currentStatus = [
  {
    status: "completed",
    color: "green",
    title: "Assessment Platform",
    description: "Core functionality complete with multiple assessment types",
  },
  {
    status: "in-progress",
    color: "yellow",
    title: "Translations",
    description: "Adding SK/CZ variants to various places",
  },
  {
    status: "in-progress",
    color: "yellow",
    title: "Test testing",
    description: "Trying tests 1 by 1",
  },
  {
    status: "development",
    color: "blue",
    title: "Tree of Knowledge",
    description:
      "Tree with Leafs as completed test resuts in Profile to feel accomplishment",
  },
];

// Next Steps Data
const nextSteps = `- **FEEDBACK** Let users try it and get first feedback
- **COMMUNICATIONS** Improve langing page and explain why this is useful
- **TESTS** Evaluate test quality and completeness
- **LEGAL** Check if we use proprietary tests and if we need to remove/rework them`;

// Updates/Changelog Data
const updates = [
  {
    date: "4th September 2025",
    title: "Implemented all tests and improved /profile screen",
    type: "Feature",
    version: "1.1",
    content: `All the current tests shall have implementation and results shall be visible in /profile screen.

**Status:**
- Most tests are English only for now, translation in progress
- Dark / light model shall be ok
- Translated all assessment content to Slovak
- Updated navigation and UI elements`,
  },
  {
    date: "3rd September 2025",
    title: "Sebapoznanie 2.0",
    type: "Major version",
    version: "1.0",
    content: `From single test app => comprehensive self-assessment platform`,
  },
  {
    date: "1st June 2025",
    title: "Moral Maturity test by Kohlberg",
    type: "First version",
    version: "0.1",
    content: `**Key features:**
- 3 out of 24 scenarios 
- AI evaluation of free text answers
- Ability to retake a test
`,
  },
];

// Helper function to get badge color classes
const getBadgeClasses = (type) => {
  const classes = {
    Feature: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Enhancement:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Bug Fix": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Infrastructure:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };
  return classes[type] || classes["Feature"];
};

// Helper function to get status dot color
const getStatusColor = (color) => {
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
  };
  return colors[color] || colors["blue"];
};

// Render markdown content
const renderMarkdown = (content) => {
  return marked(content, {
    breaks: true,
    gfm: true,
  });
};
</script>

<style scoped>
.changelog-entry {
  transition: all 0.2s ease-in-out;
}

.changelog-entry:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .changelog-entry:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar for better aesthetics */
.changelog-page {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.changelog-page::-webkit-scrollbar {
  width: 6px;
}

.changelog-page::-webkit-scrollbar-track {
  background: transparent;
}

.changelog-page::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.dark .changelog-page::-webkit-scrollbar-thumb {
  background-color: #4a5568;
}
</style>
