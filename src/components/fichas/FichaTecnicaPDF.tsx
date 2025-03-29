import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

interface ProductoDTO {
  idProducto: number;
  codigoProducto: string;
  nombreProducto: string;
  marca?: { nombreMarca: string };
  fabricante?: string;
  paisFabricacion?: string;
  unidadDespacho?: string;
  descripcion?: string;
  caracteristicas?: { nombreCaracteristica: string; valor: string }[];
}

interface Props {
  producto: ProductoDTO;
}

const FichaTecnicaPDF: React.FC<Props> = ({ producto }) => {
  const generarPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // Tamaño A4 en puntos

    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("FICHA TÉCNICA DEL PRODUCTO", {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    const textOptions = { size: 12, font, color: rgb(0, 0, 0) };
    let y = height - 80;

    const drawText = (label: string, value: string) => {
      page.drawText(`${label}: ${value}`, { x: 50, y, ...textOptions });
      y -= 20;
    };

    drawText("Código", producto.codigoProducto);
    drawText("Nombre", producto.nombreProducto);
    drawText("Marca", producto.marca?.nombreMarca || "No especificada");
    drawText("Fabricante", producto.fabricante || "No especificado");
    drawText("País de Fabricación", producto.paisFabricacion || "No especificado");
    drawText("Unidad de Despacho", producto.unidadDespacho || "No especificada");
    drawText("Descripción", producto.descripcion || "Sin descripción");

    y -= 20;
    page.drawText("CARACTERÍSTICAS ESPECÍFICAS", {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;

    producto.caracteristicas?.forEach((c) => {
      drawText(c.nombreCaracteristica, c.valor);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Ficha_${producto.codigoProducto}.pdf`);
  };

  return (
    <button onClick={generarPDF}>📄 Descargar Ficha Técnica</button>
  );
};

export default FichaTecnicaPDF;
