
INSERT INTO public.muscles (slug, name, region, overview, weekly_sets_min, weekly_sets_max, display_order, image_url)
VALUES (
  'obliques', 'Obliques', 'core',
  'The obliques run along the sides of your torso and drive rotation, anti-rotation, and lateral flexion. Train them with rotational and side-bending patterns — not just crunches.',
  6, 14, 12,
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80'
)
ON CONFLICT (slug) DO NOTHING;

WITH inserted AS (
  INSERT INTO public.exercises (slug, name, description, instructions, form_tips, common_mistakes, difficulty, equipment, exercise_type, image_url)
  VALUES
    ('side-plank', 'Side Plank',
      'Isometric side hold that builds lateral core stability and oblique endurance.',
      '["Lie on your side with forearm under shoulder.", "Stack feet and lift hips so body forms a straight line.", "Hold, keeping hips high and core braced.", "Switch sides and repeat."]'::jsonb,
      '["Drive your elbow down to lift your ribs away from the floor.", "Squeeze glutes to keep hips stacked."]'::jsonb,
      '["Letting the hips sag toward the floor.", "Rotating the shoulders forward."]'::jsonb,
      'beginner', 'Bodyweight', 'isolation',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80'),
    ('russian-twist', 'Russian Twist',
      'Seated rotational core movement targeting the obliques and deep core.',
      '["Sit with knees bent and torso leaned back ~45°.", "Hold a weight or clasp hands at chest.", "Rotate side to side, tapping the floor near your hip.", "Keep the chest tall throughout."]'::jsonb,
      '["Rotate from the ribs, not just the arms.", "Lift feet off the floor for more difficulty."]'::jsonb,
      '["Rounding the lower back.", "Moving only the arms with no torso rotation."]'::jsonb,
      'beginner', 'Dumbbell', 'isolation',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80'),
    ('cable-wood-chop', 'Cable Wood Chop',
      'Standing rotational pull that trains powerful oblique contractions through a full range.',
      '["Set a cable at high pulley with a handle.", "Stand sideways and grip with both hands.", "Pull down and across the body to the opposite hip.", "Control back to start."]'::jsonb,
      '["Pivot the back foot to allow full rotation.", "Lead with the hips, not the arms."]'::jsonb,
      '["Bending the elbows excessively.", "Using only arm motion."]'::jsonb,
      'intermediate', 'Cable', 'isolation',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80'),
    ('hanging-leg-raise-twist', 'Hanging Leg Raise with Twist',
      'Advanced hanging core movement that hits the lower abs and obliques together.',
      '["Hang from a pull-up bar with arms straight.", "Raise knees toward chest while twisting to one side.", "Lower under control.", "Alternate sides."]'::jsonb,
      '["Initiate the twist as your knees come up, not before.", "Keep shoulders engaged — no shrugging."]'::jsonb,
      '["Swinging the body for momentum.", "Only raising the knees without rotating."]'::jsonb,
      'advanced', 'Pull-up Bar', 'isolation',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80')
  ON CONFLICT (slug) DO NOTHING
  RETURNING id, slug
)
INSERT INTO public.exercise_muscles (exercise_id, muscle_id, role)
SELECT i.id, (SELECT id FROM public.muscles WHERE slug='obliques'), 'primary'::muscle_role FROM inserted i
UNION ALL
SELECT i.id, (SELECT id FROM public.muscles WHERE slug='abs'), 'secondary'::muscle_role FROM inserted i
WHERE i.slug IN ('russian-twist', 'hanging-leg-raise-twist', 'cable-wood-chop');
