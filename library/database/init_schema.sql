-- ==========================================
-- 0. LIMPIEZA INICIAL (Por si había algo previo)
-- ==========================================
DROP TABLE IF EXISTS loans CASCADE;
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

CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  borrower_name TEXT NOT NULL,
  borrowed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  returned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
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
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo los usuarios logueados pueden hacer SELECT, INSERT, UPDATE y DELETE
CREATE POLICY "Acceso logueados" ON authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON publishers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON genres FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON series FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON shelf_modules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON books FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON book_authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON book_genres FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Acceso logueados" ON loans FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 5. EJEMPLOS
-- ==========================================
DO $$
DECLARE
  v_author_1 UUID := gen_random_uuid();
  v_author_2 UUID := gen_random_uuid();
  
  v_publisher_1 UUID := gen_random_uuid();
  v_publisher_2 UUID := gen_random_uuid();
  
  v_genre_1 UUID := gen_random_uuid();
  v_genre_2 UUID := gen_random_uuid();
  
  v_series_1 UUID := gen_random_uuid();
  
  v_module_1 UUID := gen_random_uuid();
  v_module_2 UUID := gen_random_uuid();
  
  v_book_1 UUID := gen_random_uuid();
  v_book_2 UUID := gen_random_uuid();
BEGIN
  -- 1. Insertar entidades independientes
  INSERT INTO authors (id, name) VALUES (v_author_1, 'Autor1'), (v_author_2, 'Autor2');
  INSERT INTO publishers (id, name) VALUES (v_publisher_1, 'Editorial1'), (v_publisher_2, 'Editorial2');
  INSERT INTO genres (id, name) VALUES (v_genre_1, 'Genero1'), (v_genre_2, 'Genero2');
  INSERT INTO series (id, name) VALUES (v_series_1, 'Saga1');
  INSERT INTO shelf_modules (id, name) VALUES (v_module_1, 'Modulo1'), (v_module_2, 'Modulo2');

  -- 2. Insertar Libros
  -- Libro1: Completo (pertenece a Saga1, Modulo1 y está Disponible)
  INSERT INTO books (id, title, isbn, year, publisher_id, edition, language, pages, description, status, series_id, position_in_series, module_id) 
  VALUES (v_book_1, 'Libro1', 'ISBN-0000000001', 2023, v_publisher_1, '1ª Edición', 'Español', 300, 'Descripción ficticia del Libro1', 'Disponible', v_series_1, 1, v_module_1);

  -- Libro2: Suelto (sin saga, Modulo2 y está Prestado)
  INSERT INTO books (id, title, isbn, year, publisher_id, edition, language, pages, description, status, module_id) 
  VALUES (v_book_2, 'Libro2', 'ISBN-0000000002', 2024, v_publisher_2, 'Bolsillo', 'Inglés', 450, 'Descripción ficticia del Libro2', 'Prestado', v_module_2);

  -- 3. Conectar relaciones (Muchos a Muchos)
  INSERT INTO book_authors (book_id, author_id) VALUES (v_book_1, v_author_1);
  INSERT INTO book_authors (book_id, author_id) VALUES (v_book_2, v_author_2);

  INSERT INTO book_genres (book_id, genre_id) VALUES (v_book_1, v_genre_1);
  INSERT INTO book_genres (book_id, genre_id) VALUES (v_book_2, v_genre_2);

  -- 4. Registrar préstamo para Libro2
  INSERT INTO loans (book_id, borrower_name, notes) 
  VALUES (v_book_2, 'Prestatario1', 'Préstamo de prueba para Libro2');
END $$;