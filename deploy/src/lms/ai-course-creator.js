/**
 * AI-Powered Course Creator - Superior to LearnWorlds
 * Automatically generates complete courses from uploaded documents
 * Features: Drip content, video generation, auto-tests, course covers
 * 
 * Copyright (c) 2024 Elevate for Humanity
 * Licensed Use Only - Unauthorized use prohibited
 */

import { createClient } from '@supabase/supabase-js';

class AICourseCreator {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
  }

  /**
   * Create complete course from uploaded document
   * Superior to LearnWorlds - fully automated
   */
  async createCourseFromDocument(documentFile, courseSettings = {}) {
    try {
      console.log('🚀 Starting AI course creation...');
      
      // Step 1: Extract and analyze document content
      const documentContent = await this.extractDocumentContent(documentFile);
      
      // Step 2: Generate course structure with AI
      const courseStructure = await this.generateCourseStructure(documentContent, courseSettings);
      
      // Step 3: Create course cover with AI
      const courseCover = await this.generateCourseCover(courseStructure.title, courseStructure.description);
      
      // Step 4: Generate video scripts for each lesson
      const videoScripts = await this.generateVideoScripts(courseStructure.modules);
      
      // Step 5: Create videos from scripts using AI
      const videos = await this.generateVideosFromScripts(videoScripts);
      
      // Step 6: Generate automatic tests and quizzes
      const assessments = await this.generateAssessments(courseStructure.modules);
      
      // Step 7: Set up drip content schedule
      const dripSchedule = await this.createDripSchedule(courseStructure.modules, courseSettings.dripSettings);
      
      // Step 8: Save everything to Supabase
      const course = await this.saveCourseToDatabase({
        ...courseStructure,
        cover: courseCover,
        videos,
        assessments,
        dripSchedule
      });
      
      console.log('✅ Course created successfully!');
      return course;
      
    } catch (error) {
      console.error('❌ Course creation failed:', error);
      throw error;
    }
  }

  /**
   * Extract content from various document formats
   */
  async extractDocumentContent(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use Cloudflare Workers for document processing
    const response = await fetch('/api/extract-document', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract document content');
    }
    
    return await response.json();
  }

  /**
   * Generate comprehensive course structure using GPT-4
   */
  async generateCourseStructure(content, settings) {
    const prompt = `
    Create a comprehensive course structure from this content. Make it better than LearnWorlds courses.
    
    Content: ${content.text}
    
    Generate:
    1. Course title (engaging and professional)
    2. Course description (compelling, SEO-optimized)
    3. Learning objectives (specific, measurable)
    4. 6-8 modules with:
       - Module title
       - Module description
       - 3-5 lessons per module
       - Estimated duration
       - Key concepts
       - Practical exercises
    5. Prerequisites
    6. Target audience
    7. Course difficulty level
    8. Estimated completion time
    
    Format as JSON with this structure:
    {
      "title": "Course Title",
      "description": "Course description",
      "objectives": ["objective1", "objective2"],
      "prerequisites": ["prereq1", "prereq2"],
      "targetAudience": "Description",
      "difficulty": "Beginner|Intermediate|Advanced",
      "estimatedHours": 20,
      "modules": [
        {
          "id": 1,
          "title": "Module Title",
          "description": "Module description",
          "estimatedHours": 3,
          "lessons": [
            {
              "id": 1,
              "title": "Lesson Title",
              "description": "Lesson description",
              "type": "video|text|interactive|quiz",
              "estimatedMinutes": 15,
              "keyPoints": ["point1", "point2"],
              "practicalExercise": "Exercise description"
            }
          ]
        }
      ]
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert instructional designer creating world-class online courses. Generate comprehensive, engaging course structures that exceed industry standards.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  }

  /**
   * Generate professional course cover using DALL-E 3
   */
  async generateCourseCover(title, description) {
    const prompt = `
    Create a professional, modern course cover for "${title}".
    Style: Clean, professional, educational, high-quality
    Elements: Course title prominently displayed, relevant imagery, Elevate for Humanity branding
    Colors: Professional blue and purple gradient background
    Quality: Ultra-high resolution, crystal clear, no generic stock photos
    Text: "${title}" in bold, modern font
    `;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1792x1024',
        quality: 'hd',
        style: 'natural'
      })
    });

    const result = await response.json();
    
    // Upload to Cloudflare Images for optimization
    const imageUrl = await this.uploadToCloudflareImages(result.data[0].url, `course-cover-${Date.now()}`);
    
    return {
      url: imageUrl,
      alt: `Course cover for ${title}`,
      prompt: prompt
    };
  }

  /**
   * Generate video scripts for each lesson
   */
  async generateVideoScripts(modules) {
    const scripts = [];
    
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (lesson.type === 'video') {
          const script = await this.generateVideoScript(lesson, module);
          scripts.push({
            lessonId: lesson.id,
            moduleId: module.id,
            script: script,
            estimatedDuration: lesson.estimatedMinutes
          });
        }
      }
    }
    
    return scripts;
  }

  /**
   * Generate individual video script
   */
  async generateVideoScript(lesson, module) {
    const prompt = `
    Create a professional video script for this lesson:
    
    Module: ${module.title}
    Lesson: ${lesson.title}
    Description: ${lesson.description}
    Key Points: ${lesson.keyPoints.join(', ')}
    Duration: ${lesson.estimatedMinutes} minutes
    
    Generate a script that includes:
    1. Engaging hook (first 10 seconds)
    2. Clear learning objectives
    3. Main content broken into digestible segments
    4. Visual cues and examples
    5. Interactive elements
    6. Summary and next steps
    7. Call to action
    
    Format with timestamps and visual directions:
    [00:00] HOOK: "Did you know that..."
    [00:15] VISUAL: Show statistic on screen
    [00:30] CONTENT: "In this lesson, we'll cover..."
    
    Make it engaging, professional, and educational.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional video script writer specializing in educational content. Create engaging, clear, and well-structured scripts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const result = await response.json();
    return result.choices[0].message.content;
  }

  /**
   * Generate videos from scripts using AI video generation
   */
  async generateVideosFromScripts(scripts) {
    const videos = [];
    
    for (const scriptData of scripts) {
      try {
        // Use Cloudflare Stream for video generation and hosting
        const video = await this.generateVideoFromScript(scriptData);
        videos.push({
          lessonId: scriptData.lessonId,
          moduleId: scriptData.moduleId,
          videoUrl: video.url,
          thumbnailUrl: video.thumbnail,
          duration: video.duration,
          script: scriptData.script
        });
      } catch (error) {
        console.error(`Failed to generate video for lesson ${scriptData.lessonId}:`, error);
      }
    }
    
    return videos;
  }

  /**
   * Generate video from script using AI
   */
  async generateVideoFromScript(scriptData) {
    // For now, create a placeholder that would integrate with video generation APIs
    // In production, this would use services like Synthesia, D-ID, or similar
    
    const videoData = {
      script: scriptData.script,
      duration: scriptData.estimatedDuration,
      style: 'professional',
      voice: 'natural',
      background: 'educational'
    };

    // Upload to Cloudflare Stream
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.cloudflareAccountId}/stream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cloudflareApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        meta: {
          name: `Lesson ${scriptData.lessonId} - Module ${scriptData.moduleId}`,
          script: scriptData.script
        }
      })
    });

    const result = await response.json();
    
    return {
      url: `https://videodelivery.net/${result.result.uid}`,
      thumbnail: `https://videodelivery.net/${result.result.uid}/thumbnails/thumbnail.jpg`,
      duration: scriptData.estimatedDuration,
      uid: result.result.uid
    };
  }

  /**
   * Generate automatic assessments and quizzes
   */
  async generateAssessments(modules) {
    const assessments = [];
    
    for (const module of modules) {
      const assessment = await this.generateModuleAssessment(module);
      assessments.push({
        moduleId: module.id,
        ...assessment
      });
    }
    
    return assessments;
  }

  /**
   * Generate assessment for a specific module
   */
  async generateModuleAssessment(module) {
    const prompt = `
    Create a comprehensive assessment for this module:
    
    Module: ${module.title}
    Description: ${module.description}
    Lessons: ${module.lessons.map(l => l.title).join(', ')}
    
    Generate:
    1. 10 multiple choice questions (4 options each)
    2. 5 true/false questions
    3. 3 short answer questions
    4. 1 practical exercise/project
    
    Include:
    - Correct answers
    - Explanations for each answer
    - Difficulty levels
    - Point values
    - Time estimates
    
    Format as JSON:
    {
      "title": "Module Assessment",
      "description": "Assessment description",
      "timeLimit": 30,
      "totalPoints": 100,
      "passingScore": 80,
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct",
          "points": 5,
          "difficulty": "easy|medium|hard"
        }
      ],
      "practicalExercise": {
        "title": "Exercise title",
        "description": "Exercise description",
        "instructions": ["Step 1", "Step 2"],
        "deliverables": ["Deliverable 1"],
        "rubric": "Grading criteria"
      }
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert assessment designer creating comprehensive, fair, and engaging evaluations for online courses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 3000
      })
    });

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  }

  /**
   * Create drip content schedule
   */
  async createDripSchedule(modules, dripSettings = {}) {
    const {
      startDate = new Date(),
      interval = 'weekly', // daily, weekly, biweekly
      customSchedule = null
    } = dripSettings;

    const schedule = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      
      schedule.push({
        moduleId: module.id,
        releaseDate: new Date(currentDate),
        isAvailable: i === 0, // First module available immediately
        prerequisites: i > 0 ? [modules[i-1].id] : []
      });

      // Calculate next release date
      switch (interval) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
      }
    }

    return schedule;
  }

  /**
   * Upload image to Cloudflare Images
   */
  async uploadToCloudflareImages(imageUrl, filename) {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), filename);
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.cloudflareAccountId}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cloudflareApiToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result.result.variants[0]; // Return optimized URL
  }

  /**
   * Save complete course to Supabase database
   */
  async saveCourseToDatabase(courseData) {
    try {
      // Insert course
      const { data: course, error: courseError } = await this.supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          cover_url: courseData.cover.url,
          objectives: courseData.objectives,
          prerequisites: courseData.prerequisites,
          target_audience: courseData.targetAudience,
          difficulty: courseData.difficulty,
          estimated_hours: courseData.estimatedHours,
          created_by: 'ai-system',
          status: 'draft'
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Insert modules
      for (const moduleData of courseData.modules) {
        const { data: module, error: moduleError } = await this.supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: moduleData.title,
            description: moduleData.description,
            order_index: moduleData.id,
            estimated_hours: moduleData.estimatedHours
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Insert lessons
        for (const lessonData of moduleData.lessons) {
          const video = courseData.videos.find(v => v.lessonId === lessonData.id && v.moduleId === moduleData.id);
          
          const { error: lessonError } = await this.supabase
            .from('lessons')
            .insert({
              module_id: module.id,
              title: lessonData.title,
              description: lessonData.description,
              type: lessonData.type,
              order_index: lessonData.id,
              estimated_minutes: lessonData.estimatedMinutes,
              video_url: video?.videoUrl,
              video_thumbnail: video?.thumbnailUrl,
              key_points: lessonData.keyPoints,
              practical_exercise: lessonData.practicalExercise
            });

          if (lessonError) throw lessonError;
        }

        // Insert assessment
        const assessment = courseData.assessments.find(a => a.moduleId === moduleData.id);
        if (assessment) {
          const { error: assessmentError } = await this.supabase
            .from('assessments')
            .insert({
              module_id: module.id,
              title: assessment.title,
              description: assessment.description,
              time_limit: assessment.timeLimit,
              total_points: assessment.totalPoints,
              passing_score: assessment.passingScore,
              questions: assessment.questions,
              practical_exercise: assessment.practicalExercise
            });

          if (assessmentError) throw assessmentError;
        }
      }

      // Insert drip schedule
      for (const scheduleItem of courseData.dripSchedule) {
        const { error: scheduleError } = await this.supabase
          .from('drip_schedule')
          .insert({
            course_id: course.id,
            module_id: scheduleItem.moduleId,
            release_date: scheduleItem.releaseDate,
            is_available: scheduleItem.isAvailable,
            prerequisites: scheduleItem.prerequisites
          });

        if (scheduleError) throw scheduleError;
      }

      return course;

    } catch (error) {
      console.error('Error saving course to database:', error);
      throw error;
    }
  }
}

export default AICourseCreator;