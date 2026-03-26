
-- 1. Validation trigger on enrollments: cap completed_modules and progress
CREATE OR REPLACE FUNCTION public.validate_enrollment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  max_modules integer;
BEGIN
  SELECT total_modules INTO max_modules FROM public.courses WHERE id = NEW.course_id;
  
  IF max_modules IS NULL THEN
    RAISE EXCEPTION 'Invalid course_id';
  END IF;

  IF NEW.completed_modules < 0 THEN
    NEW.completed_modules := 0;
  END IF;

  IF NEW.completed_modules > max_modules THEN
    NEW.completed_modules := max_modules;
  END IF;

  IF NEW.progress < 0 THEN
    NEW.progress := 0;
  END IF;

  IF NEW.progress > 100 THEN
    NEW.progress := 100;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_enrollment_update
BEFORE INSERT OR UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.validate_enrollment_update();

-- 2. Validation trigger on quiz_scores: score 0-100, must be enrolled in course
CREATE OR REPLACE FUNCTION public.validate_quiz_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.score < 0 OR NEW.score > 100 THEN
    RAISE EXCEPTION 'Score must be between 0 and 100';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id
  ) THEN
    RAISE EXCEPTION 'User must be enrolled in the course to submit a quiz score';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_quiz_score
BEFORE INSERT ON public.quiz_scores
FOR EACH ROW
EXECUTE FUNCTION public.validate_quiz_score();
