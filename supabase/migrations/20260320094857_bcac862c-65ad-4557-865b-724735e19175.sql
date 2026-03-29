-- ================================================
-- SAFETY CHECK FIRST
-- ================================================
DO $$
BEGIN
  RAISE NOTICE 'Starting Bloom Skills Suite database setup...';
END $$;
-- ================================================
-- STEP 1: TRIGGER FUNCTION
-- ================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
-- ================================================
-- STEP 2: PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- STEP 3: AUTO CREATE PROFILE ON SIGNUP
-- ================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ================================================
-- STEP 4: COURSES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration TEXT,
  level TEXT,
  total_modules INT NOT NULL DEFAULT 1,
  image_url TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  instructor_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- STEP 5: ENROLLMENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_modules INT NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_enrollments_updated_at ON public.enrollments;
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- STEP 6: QUIZ SCORES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  quiz_name TEXT NOT NULL,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
-- ================================================
-- STEP 7: ACTIVITY LOG TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'CheckCircle2',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
-- ================================================
-- STEP 8: LESSONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  cloudinary_public_id TEXT,
  duration INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- STEP 9: LESSON PROGRESS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watched_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
-- ================================================
-- STEP 10: SITE CONTENT TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section)
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
-- ================================================
-- STEP 11: MEDIA LIBRARY TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  url TEXT NOT NULL,
  public_id TEXT,
  type TEXT,
  size BIGINT,
  format TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
-- ================================================
-- STEP 12: HELPER FUNCTION (fixes RLS recursion)
-- ================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;
-- ================================================
-- STEP 13: ALL RLS POLICIES
-- ================================================
-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin reads all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
-- COURSES
DROP POLICY IF EXISTS "Courses are publicly readable" ON public.courses;
DROP POLICY IF EXISTS "Admin insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admin update courses" ON public.courses;
DROP POLICY IF EXISTS "Admin delete courses" ON public.courses;
CREATE POLICY "Courses are publicly readable"
  ON public.courses FOR SELECT
  USING (true);
CREATE POLICY "Admin insert courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() = 'admin');
CREATE POLICY "Admin update courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (public.get_my_role() = 'admin');
CREATE POLICY "Admin delete courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (public.get_my_role() = 'admin');
-- LESSONS
DROP POLICY IF EXISTS "Free lessons visible to all" ON public.lessons;
DROP POLICY IF EXISTS "Enrolled users can view paid lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admin full access to lessons" ON public.lessons;
CREATE POLICY "Free lessons visible to all"
  ON public.lessons FOR SELECT
  USING (is_free = true);
CREATE POLICY "Enrolled users can view paid lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = lessons.course_id
      AND e.user_id = auth.uid()
    )
  );
CREATE POLICY "Admin full access to lessons"
  ON public.lessons FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');
-- ENROLLMENTS
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admin full access to enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Users can insert own enrollments"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments"
  ON public.enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Admin delete enrollments"
  ON public.enrollments FOR DELETE
  TO authenticated
  USING (public.get_my_role() = 'admin');
-- QUIZ SCORES
DROP POLICY IF EXISTS "Users can view own quiz scores" ON public.quiz_scores;
DROP POLICY IF EXISTS "Users can insert own quiz scores" ON public.quiz_scores;
CREATE POLICY "Users can view own quiz scores"
  ON public.quiz_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Users can insert own quiz scores"
  ON public.quiz_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- ACTIVITY LOG
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.activity_log;
CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Users can insert own activity"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- LESSON PROGRESS
DROP POLICY IF EXISTS "Users manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users manage own lesson progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
-- SITE CONTENT
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Only admin can write site content" ON public.site_content;
CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  USING (true);
CREATE POLICY "Only admin can write site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');
-- MEDIA LIBRARY
DROP POLICY IF EXISTS "Only admin manages media" ON public.media_library;
CREATE POLICY "Only admin manages media"
  ON public.media_library FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');
-- ================================================
-- STEP 14: SEED COURSES (skip if already exist)
-- ================================================
INSERT INTO public.courses
  (title, description, category, duration, level, total_modules)
VALUES
  ('UI/UX Design Fundamentals',   'Master user-centered design principles and create beautiful interfaces.', 'Design',    '8 weeks',  'Beginner',     12),
  ('Full-Stack Web Development',  'Build modern web applications with React, Node.js, and databases.',      'Coding',    '12 weeks', 'Intermediate', 16),
  ('Digital Marketing Essentials','Learn SEO, social media marketing, and paid advertising strategies.',    'Marketing', '6 weeks',  'Beginner',      8),
  ('Data Analytics with Python',  'Analyze data, build dashboards, and gain insights using Python.',        'Data',      '10 weeks', 'Intermediate', 14),
  ('React & TypeScript Bootcamp', 'Deep dive into React with TypeScript for production-ready apps.',        'Coding',    '8 weeks',  'Advanced',     10),
  ('Graphics Design Masterclass', 'From logos to full brand identity design using modern tools.',           'Design',    '6 weeks',  'Beginner',     10)
ON CONFLICT DO NOTHING;
-- ================================================
-- STEP 15: SEED LESSONS
-- ================================================
INSERT INTO public.lessons
  (course_id, title, description, order_index, is_free, duration)
SELECT c.id, v.title, v.description, v.order_index, v.is_free, v.duration
FROM public.courses c
JOIN (VALUES
  ('UI/UX Design Fundamentals',   'Introduction to UX Design',     'What is UX and why it matters',                1, true,  600),
  ('UI/UX Design Fundamentals',   'User Research Methods',          'Interviews, surveys, usability testing',       2, false, 900),
  ('UI/UX Design Fundamentals',   'Wireframing Basics',             'Low and high fidelity wireframes',             3, false, 750),
  ('UI/UX Design Fundamentals',   'Prototyping with Figma',         'Interactive prototypes step by step',          4, false, 1020),
  ('Full-Stack Web Development',  'HTML & CSS Fundamentals',        'Building the web from scratch',                1, true,  1200),
  ('Full-Stack Web Development',  'JavaScript Essentials',          'Variables, functions, DOM manipulation',       2, false, 1500),
  ('Full-Stack Web Development',  'React Basics',                   'Components, props, and state',                 3, false, 1800),
  ('Full-Stack Web Development',  'Node.js & Express',              'Building REST APIs',                           4, false, 1600),
  ('Digital Marketing Essentials','Intro to Digital Marketing',     'Overview of channels and strategy',            1, true,  540),
  ('Digital Marketing Essentials','SEO Fundamentals',               'On-page and off-page SEO',                     2, false, 780),
  ('Digital Marketing Essentials','Social Media Strategy',          'Content and growth tactics',                   3, false, 660),
  ('Data Analytics with Python',  'Python for Data Science',        'Pandas, NumPy basics',                         1, true,  900),
  ('Data Analytics with Python',  'Data Visualization',             'Matplotlib and Seaborn charts',                2, false, 840),
  ('Data Analytics with Python',  'Building Dashboards',            'Plotly and Dash for interactive dashboards',   3, false, 1080),
  ('React & TypeScript Bootcamp', 'TypeScript Fundamentals',        'Types, interfaces, generics',                  1, true,  720),
  ('React & TypeScript Bootcamp', 'React Hooks Deep Dive',          'useState, useEffect, useContext, custom hooks', 2, false, 960),
  ('React & TypeScript Bootcamp', 'State Management',               'Zustand and React Query',                      3, false, 1140),
  ('Graphics Design Masterclass', 'Design Principles',              'Color, typography, layout basics',             1, true,  600),
  ('Graphics Design Masterclass', 'Logo Design',                    'Creating professional logos',                  2, false, 900),
  ('Graphics Design Masterclass', 'Brand Identity',                 'Full brand kit from scratch',                  3, false, 1200)
) AS v(course_title, title, description, order_index, is_free, duration)
ON c.title = v.course_title
ON CONFLICT DO NOTHING;