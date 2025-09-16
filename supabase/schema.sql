-- Elevate for Humanity LMS Database Schema
-- Superior to LearnWorlds with advanced AI features
-- Copyright (c) 2024 Elevate for Humanity

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'copilot', 'autopilot')),
    license_key TEXT,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    objectives TEXT[],
    prerequisites TEXT[],
    target_audience TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INTEGER,
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES public.profiles(id),
    keywords TEXT[],
    meta_description TEXT,
    seo_optimized BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE public.modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    estimated_hours INTEGER,
    assessment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('video', 'text', 'interactive', 'quiz', 'assignment')),
    order_index INTEGER NOT NULL,
    estimated_minutes INTEGER,
    content JSONB,
    video_url TEXT,
    video_thumbnail TEXT,
    video_duration INTEGER,
    key_points TEXT[],
    practical_exercise TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    script TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE public.assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'quiz' CHECK (type IN ('quiz', 'assignment', 'project')),
    time_limit INTEGER, -- in minutes
    total_points INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 80,
    questions JSONB,
    practical_exercise JSONB,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for modules.assessment_id
ALTER TABLE public.modules 
ADD CONSTRAINT fk_modules_assessment 
FOREIGN KEY (assessment_id) REFERENCES public.assessments(id);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    course_id UUID REFERENCES public.courses(id),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method TEXT,
    amount_paid DECIMAL(10,2),
    UNIQUE(user_id, course_id)
);

-- Progress tracking table
CREATE TABLE public.progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    lesson_id UUID REFERENCES public.lessons(id),
    course_id UUID REFERENCES public.courses(id),
    completed BOOLEAN DEFAULT FALSE,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(user_id, lesson_id)
);

-- Assessment attempts table
CREATE TABLE public.assessment_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    assessment_id UUID REFERENCES public.assessments(id),
    attempt_number INTEGER DEFAULT 1,
    answers JSONB,
    score DECIMAL(5,2),
    passed BOOLEAN,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_taken INTEGER -- in seconds
);

-- Drip content schedule table
CREATE TABLE public.drip_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN DEFAULT FALSE,
    prerequisites UUID[], -- array of module IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Copilot/Autopilot settings
CREATE TABLE public.autopilot_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    enabled BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id)
);

-- Autopilot action logs
CREATE TABLE public.autopilot_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'copilot', 'autopilot')),
    price DECIMAL(10,2) NOT NULL,
    features TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- License management table
CREATE TABLE public.licenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    license_key TEXT UNIQUE NOT NULL,
    domain TEXT NOT NULL,
    licensee TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'sister', 'enterprise')),
    features TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.profiles(id)
);

-- License usage tracking
CREATE TABLE public.license_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    license_key TEXT REFERENCES public.licenses(license_key),
    domain TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    path TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT,
    metadata JSONB
);

-- License violations
CREATE TABLE public.license_violations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    domain TEXT NOT NULL,
    violation_type TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigated', 'resolved')),
    action_taken TEXT
);

-- Course analytics
CREATE TABLE public.course_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL,
    metadata JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated content tracking
CREATE TABLE public.ai_content_generation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('course', 'module', 'lesson', 'assessment', 'video', 'cover')),
    content_id UUID NOT NULL,
    prompt TEXT,
    model_used TEXT,
    generation_time INTEGER, -- in milliseconds
    cost DECIMAL(10,4),
    quality_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_courses_created_by ON public.courses(created_by);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_course_id ON public.progress(course_id);
CREATE INDEX idx_license_usage_license_key ON public.license_usage(license_key);
CREATE INDEX idx_license_usage_timestamp ON public.license_usage(timestamp);
CREATE INDEX idx_course_analytics_course_id ON public.course_analytics(course_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage own courses" ON public.courses
    FOR ALL USING (auth.uid() = created_by);

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON public.enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON public.enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view own progress" ON public.progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
    FOR ALL USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage DECIMAL;
BEGIN
    -- Get total lessons in course
    SELECT COUNT(l.id) INTO total_lessons
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE m.course_id = course_uuid;
    
    -- Get completed lessons for user
    SELECT COUNT(p.id) INTO completed_lessons
    FROM public.progress p
    JOIN public.lessons l ON p.lesson_id = l.id
    JOIN public.modules m ON l.module_id = m.id
    WHERE p.user_id = user_uuid 
    AND m.course_id = course_uuid 
    AND p.completed = TRUE;
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        progress_percentage := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN ROUND(progress_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    course_uuid UUID;
    new_progress DECIMAL;
BEGIN
    -- Get course ID from lesson
    SELECT m.course_id INTO course_uuid
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE l.id = NEW.lesson_id;
    
    -- Calculate new progress
    new_progress := calculate_course_progress(NEW.user_id, course_uuid);
    
    -- Update enrollment progress
    UPDATE public.enrollments
    SET progress = new_progress,
        completed_at = CASE WHEN new_progress >= 100 THEN NOW() ELSE NULL END,
        status = CASE WHEN new_progress >= 100 THEN 'completed' ELSE status END
    WHERE user_id = NEW.user_id AND course_id = course_uuid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update enrollment progress when lesson progress changes
CREATE TRIGGER update_enrollment_progress_trigger
    AFTER INSERT OR UPDATE ON public.progress
    FOR EACH ROW
    WHEN (NEW.completed = TRUE)
    EXECUTE FUNCTION update_enrollment_progress();

-- Insert default data
INSERT INTO public.profiles (id, email, full_name, role, subscription_tier) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@elevateforhumanity.com', 'Elevate Admin', 'admin', 'autopilot');

-- Insert sample license
INSERT INTO public.licenses (license_key, domain, licensee, tier, features, expiry_date) VALUES
    ('EFH-RISE-2024-PROD-XYZ789', 'elevateforhumanity.com', 'Elevate for Humanity', 'enterprise', 
     ARRAY['lms', 'sister-sites', 'ai-tutor', 'analytics', 'compliance', 'admin'], 
     '2025-12-31 23:59:59+00');