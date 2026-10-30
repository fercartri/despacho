-- ==========================================
-- 0. LIMPIEZA INICIAL (Por si había algo previo)
-- ==========================================
DROP TABLE IF EXISTS book_genres CASCADE;
DROP TABLE IF EXISTS book_authors CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS shelf_modules CASCADE;

-- ==========================================
-- 1. TABLAS INDEPENDIENTES
-- ==========================================
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE shelf_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. TABLA PRINCIPAL
-- ==========================================
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  isbn TEXT,
  year INTEGER,
  publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  edition TEXT,
  language TEXT,
  pages INTEGER,
  description TEXT,
  cover_url TEXT,
  status TEXT CHECK (status IN ('Disponible', 'Prestado')) DEFAULT 'Disponible',
  
  -- Relaciones 1 a N
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  position_in_series INTEGER,
  module_id UUID REFERENCES shelf_modules(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TABLAS DEPENDIENTES
-- ==========================================
CREATE TABLE book_authors (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_genres (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, genre_id)
);

-- ==========================================
-- 4. SEGURIDAD (ROW LEVEL SECURITY)
-- ==========================================
-- Activamos RLS en todas las tablas
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_genres ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo los usuarios logueados pueden hacer SELECT, INSERT, UPDATE y DELETE
CREATE POLICY "Acceso logueados" ON authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON publishers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON genres FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON series FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON shelf_modules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON books FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON book_authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON book_genres FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- EJEMPLOS DE AUTORES
-- ==========================================
INSERT INTO authors (name) VALUES
('J.R.R. Tolkien'),
('Brandon Sanderson'),
('George Orwell'),
('Isaac Asimov'),
('J.K. Rowling'),
('Mary Shelley'),
('Frank Herbert')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- EJEMPLOS DE EDITORIALES
-- ==========================================
INSERT INTO publishers (name) VALUES
('Minotauro'),
('Nova'),
('Debolsillo'),
('Alianza Editorial'),
('Salamandra')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- EJEMPLOS DE GÉNEROS
-- ==========================================
INSERT INTO genres (name) VALUES
('Fantasía'),
('Ciencia Ficción'),
('Distopía'),
('Terror'),
('Clásico'),
('Aventura')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- EJEMPLOS DE SAGAS / COLECCIONES
-- ==========================================
INSERT INTO series (name) VALUES
('El Señor de los Anillos'),
('Nacidos de la Bruma'),
('Fundación'),
('Harry Potter')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- EJEMPLOS DE MÓDULOS DE ESTANTERÍA 
-- (Coincidentes con tu layout visual: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1)
-- ==========================================
INSERT INTO shelf_modules (name) VALUES
('1.1'),
('1.2'),
('1.3'),
('2.1'),
('2.2'),
('3.1');

-- ==========================================
-- EJEMPLOS DE LIBROS
-- (Variados con saga, posición, estado Disponible/Prestado y módulos)
-- ==========================================
INSERT INTO books (title, isbn, year, publisher_id, edition, language, pages, description, cover_url, status, series_id, position_in_series, module_id) VALUES
(
  'La Comunidad del Anillo', 
  '978-8445073797', 
  1954, 
  (SELECT id FROM publishers WHERE name = 'Minotauro'), 
  '1ª', 
  'Español', 
  432, 
  'Primera parte de la gran epopeya de la Tierra Media.', 
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'El Señor de los Anillos'), 
  1, 
  (SELECT id FROM shelf_modules WHERE name = '1.1' LIMIT 1)
),
(
  'Las Dos Torres', 
  '978-8445073803', 
  1954, 
  (SELECT id FROM publishers WHERE name = 'Minotauro'), 
  '1ª', 
  'Español', 
  352, 
  'Segunda parte de El Señor de los Anillos.', 
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'El Señor de los Anillos'), 
  2, 
  (SELECT id FROM shelf_modules WHERE name = '1.1' LIMIT 1)
),
(
  'El Retorno del Rey', 
  '978-8445073810', 
  1955, 
  (SELECT id FROM publishers WHERE name = 'Minotauro'), 
  '1ª', 
  'Español', 
  448, 
  'Desenlace de la guerra del Anillo.', 
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600', 
  'Prestado', 
  (SELECT id FROM series WHERE name = 'El Señor de los Anillos'), 
  3, 
  (SELECT id FROM shelf_modules WHERE name = '1.1' LIMIT 1)
),
(
  'El Imperio Final', 
  '978-8417347029', 
  2006, 
  (SELECT id FROM publishers WHERE name = 'Nova'), 
  '3ª', 
  'Español', 
  688, 
  'En un mundo donde los tiránicos dominan, un grupo planea un golpe imposible.', 
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'Nacidos de la Bruma'), 
  1, 
  (SELECT id FROM shelf_modules WHERE name = '1.2' LIMIT 1)
),
(
  'El Pozo de la Ascensión', 
  '978-8417347036', 
  2007, 
  (SELECT id FROM publishers WHERE name = 'Nova'), 
  '2ª', 
  'Español', 
  792, 
  'Segunda entrega de Nacidos de la Bruma.', 
  'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'Nacidos de la Bruma'), 
  2, 
  (SELECT id FROM shelf_modules WHERE name = '1.2' LIMIT 1)
),
(
  '1984', 
  '978-8499890944', 
  1949, 
  (SELECT id FROM publishers WHERE name = 'Debolsillo'), 
  '5ª', 
  'Español', 
  352, 
  'Novela política de distopía y control absoluto del Gran Hermano.', 
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600', 
  'Prestado', 
  NULL, 
  NULL, 
  (SELECT id FROM shelf_modules WHERE name = '1.3' LIMIT 1)
),
(
  'Fundación', 
  '978-8435011983', 
  1951, 
  (SELECT id FROM publishers WHERE name = 'Alianza Editorial'), 
  '4ª', 
  'Español', 
  230, 
  'La caída del Imperio Galáctico y el plan de Hari Seldon.', 
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'Fundación'), 
  1, 
  (SELECT id FROM shelf_modules WHERE name = '2.1' LIMIT 1)
),
(
  'Harry Potter y la Piedra Filosofal', 
  '978-8478884452', 
  1997, 
  (SELECT id FROM publishers WHERE name = 'Salamandra'), 
  '10ª', 
  'Español', 
  256, 
  'El inicio de la magia en Hogwarts.', 
  'https://images.unsplash.com/photo-1618666012174-8b6c1404d227?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  (SELECT id FROM series WHERE name = 'Harry Potter'), 
  1, 
  (SELECT id FROM shelf_modules WHERE name = '2.2' LIMIT 1)
),
(
  'Frankenstein', 
  '978-8420674218', 
  1818, 
  (SELECT id FROM publishers WHERE name = 'Alianza Editorial'), 
  '2ª', 
  'Español', 
  256, 
  'El monstruo creado por el científico Victor Frankenstein.', 
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  NULL, 
  NULL, 
  (SELECT id FROM shelf_modules WHERE name = '3.1' LIMIT 1)
),
(
  'Dune', 
  '978-8466351743', 
  1965, 
  (SELECT id FROM publishers WHERE name = 'Debolsillo'), 
  '8ª', 
  'Español', 
  704, 
  'Las intrigas en el planeta desértico Arrakis y la especia.', 
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600', 
  'Disponible', 
  NULL, 
  NULL, 
  (SELECT id FROM shelf_modules WHERE name = '3.1' LIMIT 1)
);

-- ==========================================
-- 7. ASOCIAR LIBROS CON AUTORES (book_authors)
-- ==========================================
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'La Comunidad del Anillo' AND a.name = 'J.R.R. Tolkien'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'Las Dos Torres' AND a.name = 'J.R.R. Tolkien'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'El Retorno del Rey' AND a.name = 'J.R.R. Tolkien'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'El Imperio Final' AND a.name = 'Brandon Sanderson'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'El Pozo de la Ascensión' AND a.name = 'Brandon Sanderson'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = '1984' AND a.name = 'George Orwell'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'Fundación' AND a.name = 'Isaac Asimov'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'Harry Potter y la Piedra Filosofal' AND a.name = 'J.K. Rowling'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'Frankenstein' AND a.name = 'Mary Shelley'
ON CONFLICT DO NOTHING;

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a 
WHERE b.title = 'Dune' AND a.name = 'Frank Herbert'
ON CONFLICT DO NOTHING;

-- ==========================================
-- 8. ASOCIAR LIBROS CON GÉNEROS (book_genres)
-- ==========================================
INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g 
WHERE b.title IN ('La Comunidad del Anillo', 'Las Dos Torres', 'El Retorno del Rey', 'El Imperio Final', 'El Pozo de la Ascensión', 'Harry Potter y la Piedra Filosofal') 
  AND g.name = 'Fantasía'
ON CONFLICT DO NOTHING;

INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g 
WHERE b.title IN ('Fundación', 'Dune') 
  AND g.name = 'Ciencia Ficción'
ON CONFLICT DO NOTHING;

INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g 
WHERE b.title = '1984' 
  AND g.name = 'Distopía'
ON CONFLICT DO NOTHING;

INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g 
WHERE b.title = 'Frankenstein' 
  AND g.name = 'Clásico'
ON CONFLICT DO NOTHING;

INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g 
WHERE b.title = 'Frankenstein' 
  AND g.name = 'Terror'
ON CONFLICT DO NOTHING;