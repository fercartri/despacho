import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format") || "csv"; // xlsx, csv, json

  // Consulta directa de todos los libros con sus relaciones
  const { data: books, error } = await supabase.from("books").select(`
    id,
    title,
    isbn,
    year,
    edition,
    language,
    pages,
    status,
    position_in_series,
    publishers (name),
    series (name),
    shelf_modules (name),
    book_authors (authors (name)),
    book_genres (genres (name))
  `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ordenación jerárquica: Módulo > Saga > Posición > Título
  const sortedBooks = (books || []).sort((a: any, b: any) => {
    const modA = a.shelf_modules?.name || "";
    const modB = b.shelf_modules?.name || "";
    if (modA !== modB) return !modA ? 1 : !modB ? -1 : modA.localeCompare(modB);

    const serA = a.series?.name || "";
    const serB = b.series?.name || "";
    if (serA !== serB) return !serA ? 1 : !serB ? -1 : serA.localeCompare(serB);

    const posA = a.position_in_series ?? 999999;
    const posB = b.position_in_series ?? 999999;
    if (posA !== posB) return posA - posB;

    return (a.title || "").localeCompare(b.title || "");
  });

  const today = new Date().toISOString().split("T")[0];

  // 1. FORMATO JSON
  if (format === "json") {
    return new NextResponse(JSON.stringify(sortedBooks, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="biblioteca_completa_${today}.json"`,
      },
    });
  }

  // Preparamos los datos planos para Excel y CSV
  const formattedData = sortedBooks.map((book: any) => ({
    Título: book.title,
    Autores: book.book_authors?.map((ba: any) => ba.authors?.name).filter(Boolean).join(", ") || "",
    Saga: book.series?.name || "",
    Posición: book.position_in_series ?? "",
    Módulo: book.shelf_modules?.name || "",
    Editorial: book.publishers?.name || "",
    Géneros: book.book_genres?.map((bg: any) => bg.genres?.name).filter(Boolean).join(", ") || "",
    Año: book.year ?? "",
    Edición: book.edition || "",
    Idioma: book.language || "",
    Páginas: book.pages ?? "",
    ISBN: book.isbn || "",
    Estado: book.status,
  }));

  // 2. FORMATO EXCEL (.xlsx)
  if (format === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libros");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="catalogo_completo_${today}.xlsx"`,
      },
    });
  }

  // 3. FORMATO CSV (.csv) por defecto
  const headers = Object.keys(formattedData[0] || {});
  const escapeCsv = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = formattedData.map((row: any) =>
    headers.map((h) => escapeCsv(row[h])).join(";")
  );

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="catalogo_completo_${today}.csv"`,
    },
  });
}