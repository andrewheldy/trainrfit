UPDATE exercises
SET image_url = 'https://img.youtube.com/vi/' ||
  substring(video_url from '(?:v=|youtu\.be/|embed/|shorts/)([A-Za-z0-9_-]{11})')
  || '/hqdefault.jpg'
WHERE video_url IS NOT NULL;

UPDATE muscles SET image_url = CASE slug
  WHEN 'chest'      THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80'
  WHEN 'back'       THEN 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=1200&q=80'
  WHEN 'shoulders'  THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80'
  WHEN 'biceps'     THEN 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80'
  WHEN 'triceps'    THEN 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=1200&q=80'
  WHEN 'forearms'   THEN 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=1200&q=80'
  WHEN 'abs'        THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80'
  WHEN 'glutes'     THEN 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80'
  WHEN 'quads'      THEN 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=1200&q=80'
  WHEN 'hamstrings' THEN 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=1200&q=80'
  WHEN 'calves'     THEN 'https://images.unsplash.com/photo-1607962776892-3a35a4be9c1d?w=1200&q=80'
  WHEN 'obliques'   THEN 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80'
END
WHERE slug IN ('chest','back','shoulders','biceps','triceps','forearms','abs','glutes','quads','hamstrings','calves','obliques');