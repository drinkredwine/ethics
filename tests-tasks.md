# Assessment Tests Implementation Tasks

## Overview for AI Workers

This document outlines all non-implemented assessment tests in our platform. Each test needs to be implemented following our established patterns and architecture.

### Implementation Architecture Overview

Our assessment platform follows a consistent architecture across all tests:

1. **Test Definition**: Each test is defined in multiple places that need to be kept in sync:
   - `pages/index.vue` (landing page test data)
   - `pages/test/[id].vue` (test detail page data)  
   - `pages/profile.vue` (profile overview data)

2. **Test Implementation Flow**:
   - **Landing page card** → **Test detail page** → **Assessment page** → **Results page**
   - Users click test cards on landing page
   - View detailed description and take CTA on test detail page
   - Complete assessment questions
   - View comprehensive results with insights

3. **Database Schema**:
   - Tests store results in `assessments` and `user_test_results` tables
   - Each test type has a unique `test_type_id`
   - Results include `evaluation` JSON field with test-specific data structure
   - User progress is tracked via `assessment_count` and `last_taken_at`

4. **Existing Implemented Tests** (as reference):
   - **Kohlberg Moral Development**: AI-powered analysis of ethical reasoning
   - **Big Five Personality**: Multiple-choice personality assessment  
   - **Communication Skills**: Scenario-based communication evaluation
   - **Project Management**: Competency-based management assessment

5. **File Structure**:
   ```
   pages/
   ├── index.vue (landing page with all test cards)
   ├── test/[id].vue (dynamic test detail pages)
   ├── profile.vue (user progress overview)
   ├── assessment.vue (generic assessment runner)
   └── [specific-test].vue (dedicated test pages like big-five.vue)
   ```

6. **Implementation Steps for Each Test**:
   1. Create dedicated test page (e.g., `pages/personal-motivation.vue`)
   2. Design question sets appropriate for the evaluation method
   3. Implement evaluation logic (scoring, analysis, insights)  
   4. Create results visualization components
   5. Ensure database integration works properly
   6. Test the complete user flow

---

## 🎯 MOTIVATION CATEGORY

### 1. Personal Motivations Assessment
- **Test ID**: `personal_motivation`
- **Category**: Motivation → Personal Drivers
- **Duration**: 20 minutes, 25 questions
- **Evaluation Method**: Mixed format
- **Description**: Deep dive into fundamental motivational drivers including fears, passions, and core behavioral patterns
- **Implementation Notes**: 
  - Mix of reflective questions and scenario-based choices
  - Should identify intrinsic vs extrinsic motivators
  - Include fear-based vs passion-driven decision patterns
  - Results should provide actionable insights about motivation alignment

### 2. Change Readiness Assessment  
- **Test ID**: `change_readiness`
- **Category**: Motivation → Change Planning
- **Duration**: 15 minutes, 20 questions
- **Evaluation Method**: Reflective questions
- **Description**: Evaluates current life situation, identifies challenges, and assesses readiness for transformation
- **Implementation Notes**:
  - Focus on self-reflection and current state analysis
  - Include readiness stages (precontemplation, contemplation, preparation, action, maintenance)
  - Provide change recommendations and next steps
  - Results should include change readiness score and personalized action plan

---

## 📚 KNOWLEDGE CATEGORY

### 3. Team Leadership Assessment
- **Test ID**: `team_leadership`  
- **Category**: Knowledge → Leadership & Management
- **Duration**: 30 minutes, 40 questions
- **Evaluation Method**: Scenario-based
- **Description**: Comprehensive evaluation of team leadership capabilities including motivation, delegation, conflict resolution
- **Implementation Notes**:
  - Present realistic leadership scenarios with multiple response options
  - Assess key competencies: team motivation, delegation, conflict resolution, performance management
  - Include situational judgment questions
  - Results should provide leadership style profile and development recommendations

### 4. Change Management Mastery
- **Test ID**: `change_management`
- **Category**: Knowledge → Leadership & Management  
- **Duration**: 25 minutes, 35 questions
- **Evaluation Method**: Case studies
- **Description**: Evaluates skills in leading organizational transformation and implementing successful change initiatives
- **Implementation Notes**:
  - Use mini case studies with change management scenarios
  - Cover change frameworks (Kotter, ADKAR, etc.)
  - Include stakeholder management and resistance handling
  - Results should identify change management strengths and areas for improvement

---

## 💪 SKILLS & STRENGTHS CATEGORY

### 5. Strengths Profile Assessment
- **Test ID**: `strengths_finder`
- **Category**: Skills & Strengths → Natural Strengths
- **Duration**: 30 minutes, 45 questions  
- **Evaluation Method**: Forced choice
- **Description**: Identifies top natural talents using StrengthsFinder-like methodology
- **Implementation Notes**:
  - Use forced ranking/choice questions between strength statements
  - Cover 34 strength themes similar to Gallup StrengthsFinder
  - Identify top 5 signature strengths
  - Results should include strength descriptions, development suggestions, and application strategies

### 6. Critical Thinking Assessment
- **Test ID**: `critical_thinking`
- **Category**: Skills & Strengths → 4Cs Framework
- **Duration**: 35 minutes, 30 questions
- **Evaluation Method**: Problem solving
- **Description**: Evaluates analytical and logical reasoning abilities including analysis, evaluation, inference
- **Implementation Notes**:
  - Include logic puzzles, argument analysis, and inference questions
  - Test skills: analysis, evaluation, interpretation, inference, explanation
  - Present problems requiring systematic thinking
  - Results should provide critical thinking skill profile and improvement recommendations

### 7. Creativity & Innovation Assessment
- **Test ID**: `creativity_assessment`
- **Category**: Skills & Strengths → 4Cs Framework
- **Duration**: 30 minutes, 25 questions
- **Evaluation Method**: Creative tasks
- **Description**: Measures creative thinking abilities, divergent thinking patterns, and innovation potential
- **Implementation Notes**:
  - Include open-ended creative challenges
  - Test divergent thinking (multiple solutions) and convergent thinking
  - Use alternative uses tasks, creative problem-solving scenarios
  - Results should identify creativity style and provide enhancement strategies

### 8. Collaboration Excellence
- **Test ID**: `collaboration_skills`
- **Category**: Skills & Strengths → 4Cs Framework  
- **Duration**: 22 minutes, 28 questions
- **Evaluation Method**: Behavioral assessment
- **Description**: Assesses ability to work effectively with others, facilitate cooperation, and build consensus
- **Implementation Notes**:
  - Use behavioral tendency questions and team scenarios
  - Cover cooperation, consensus building, conflict resolution in teams
  - Include virtual collaboration and cross-cultural teamwork aspects
  - Results should provide collaboration style profile and team effectiveness strategies

---

## 🌟 VALUES & MINDSETS CATEGORY

### 9. Character & Integrity Assessment (Charakternosť)
- **Test ID**: `character_assessment`
- **Category**: Values & Mindsets → ChELA Framework
- **Duration**: 25 minutes, 32 questions
- **Evaluation Method**: Ethical scenarios
- **Description**: Evaluates character development including respect, moral courage, and ethical decision-making
- **Implementation Notes**:
  - Present ethical dilemmas and character-testing scenarios
  - Assess integrity, moral courage, respect, and ethical consistency
  - Include workplace and personal ethics situations
  - Results should provide character strengths profile and integrity development recommendations

### 10. Excellence Orientation
- **Test ID**: `excellence_mindset`
- **Category**: Values & Mindsets → ChELA Framework
- **Duration**: 20 minutes, 26 questions  
- **Evaluation Method**: Behavioral assessment
- **Description**: Assesses commitment to excellence, quality standards, and continuous improvement mindset
- **Implementation Notes**:
  - Focus on quality orientation, attention to detail, continuous improvement
  - Include scenarios about standards, perfectionism vs excellence
  - Assess growth mindset and learning orientation
  - Results should identify excellence drivers and provide performance optimization strategies

### 11. Entrepreneurial Mindset (Podnikavosť)
- **Test ID**: `entrepreneurship`
- **Category**: Values & Mindsets → ChELA Framework
- **Duration**: 25 minutes, 30 questions
- **Evaluation Method**: Scenario-based
- **Description**: Evaluates entrepreneurial thinking including opportunity identification, risk-taking, bias for action
- **Implementation Notes**:
  - Present business scenarios requiring entrepreneurial thinking
  - Assess opportunity recognition, risk tolerance, innovation mindset, bias for action
  - Include both startup and intrapreneurship contexts
  - Results should provide entrepreneurial profile and venture readiness assessment

### 12. Engagement & Commitment (Angažovanosť)
- **Test ID**: `engagement_commitment`
- **Category**: Values & Mindsets → ChELA Framework
- **Duration**: 18 minutes, 24 questions
- **Evaluation Method**: Reflective assessment
- **Description**: Measures level of engagement, dedication, and commitment to work and causes
- **Implementation Notes**:
  - Focus on intrinsic motivation, purpose alignment, and sustained commitment
  - Include questions about perseverance, dedication, and cause-driven behavior
  - Assess work engagement and life purpose alignment
  - Results should identify engagement drivers and provide purpose alignment strategies

### 13. Values in Action (VIA) Survey
- **Test ID**: `via_values`
- **Category**: Values & Mindsets → Values Assessment
- **Duration**: 45 minutes, 120 questions
- **Evaluation Method**: Likert scale rating
- **Description**: Comprehensive assessment of 24 character strengths representing core values in action
- **Implementation Notes**:
  - Implement full VIA Survey methodology with 240-item questionnaire (5 items per strength)
  - Cover all 24 character strengths across 6 virtues: Wisdom, Courage, Humanity, Justice, Temperance, Transcendence
  - Use 5-point Likert scale rating system
  - Results should rank all 24 strengths and identify top 5 signature strengths
  - **Note**: This is the most complex assessment requiring exact VIA methodology implementation

### 14. Organizational Culture Fit
- **Test ID**: `org_culture_preference`  
- **Category**: Values & Mindsets → Values Assessment
- **Duration**: 25 minutes, 35 questions
- **Evaluation Method**: Preference ranking
- **Description**: Identifies preferred organizational culture using Spiral Dynamics model (Red to Teal spectrum)
- **Implementation Notes**:
  - Use preference ranking between different organizational culture descriptions
  - Cover all Spiral Dynamics levels: Red (power-based), Blue (rule-based), Orange (achievement-based), Green (people-based), Teal (evolutionary)
  - Include questions about hierarchy, decision-making, values alignment
  - Results should identify optimal culture fit and organizational development stage preferences

### 15. Adult Development Stages (Kegan)
- **Test ID**: `kegan_stages`
- **Category**: Values & Mindsets → Values Assessment  
- **Duration**: 30 minutes, 28 questions
- **Evaluation Method**: Developmental assessment
- **Description**: Assesses stage of adult psychological development based on Robert Kegan's meaning-making theory
- **Implementation Notes**:
  - Implement Kegan's Subject-Object Interview methodology in questionnaire form
  - Assess meaning-making complexity across stages: Socialized Mind, Self-Authoring Mind, Self-Transforming Mind
  - Include scenarios requiring different levels of cognitive complexity
  - Results should identify developmental stage and provide growth pathway recommendations
  - **Note**: Requires deep understanding of developmental psychology and Kegan's framework

### 16. Implicit Bias Awareness
- **Test ID**: `implicit_bias`
- **Category**: Values & Mindsets → Values Assessment
- **Duration**: 35 minutes, 40 questions  
- **Evaluation Method**: IAT-style assessment
- **Description**: Explores unconscious biases and develops awareness across various dimensions
- **Implementation Notes**:
  - Implement Implicit Association Test (IAT) methodology for web
  - Cover multiple bias dimensions: race, gender, age, religion, socioeconomic status
  - Include rapid categorization tasks and reaction time measurement
  - Use both reaction time data and explicit bias questionnaires
  - Results should provide bias awareness profile and unconscious bias education
  - **Note**: Requires sophisticated timing measurement and statistical analysis

---

## 📝 IMPLEMENTATION PRIORITIES

### Priority 1 (Easiest to Implement):
1. **Personal Motivations Assessment** - Mixed format, straightforward implementation
2. **Change Readiness Assessment** - Simple reflective questions
3. **Excellence Orientation** - Behavioral assessment similar to existing tests
4. **Engagement & Commitment** - Reflective assessment, straightforward scoring

### Priority 2 (Medium Complexity):
1. **Team Leadership Assessment** - Scenario-based, requires good scenarios
2. **Character & Integrity Assessment** - Ethical scenarios similar to Kohlberg
3. **Entrepreneurial Mindset** - Scenario-based business situations
4. **Collaboration Excellence** - Behavioral assessment with team focus

### Priority 3 (Complex Implementation):
1. **Change Management Mastery** - Requires case study development
2. **Creativity & Innovation Assessment** - Open-ended creative tasks need special evaluation
3. **Strengths Profile Assessment** - Forced choice methodology, complex scoring
4. **Critical Thinking Assessment** - Logic problems need careful design
5. **Organizational Culture Fit** - Preference ranking system implementation

### Priority 4 (Most Complex):
1. **Values in Action (VIA) Survey** - Requires full VIA methodology implementation
2. **Adult Development Stages (Kegan)** - Complex developmental psychology framework  
3. **Implicit Bias Awareness** - IAT implementation with timing measurement

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### Database Schema Updates Needed:
- Ensure `user_test_results` table supports all new test types
- Add any new evaluation data structures to handle complex results (e.g., VIA 24-strength rankings)
- Consider performance implications for tests with large datasets (VIA Survey)

### UI/UX Considerations:
- Tests with creative tasks may need special input methods
- IAT-style tests need precise timing and rapid response interfaces  
- Long tests (VIA Survey) need progress saving and resumption capability
- Results visualization needs to handle complex data structures (strength rankings, development stages)

### Integration Points:
- Ensure all test routes are properly configured in `getTestLink()` function
- Update recommendation algorithms to handle new test categories
- Profile page analytics should account for all test types
- Test detail pages need proper evaluation method descriptions

Each test should follow our established patterns while adapting to its specific evaluation methodology and results structure.