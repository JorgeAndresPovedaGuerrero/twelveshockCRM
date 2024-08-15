import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string; // This will be the path to the logo
  socialMedia: {
    facebook?: string;
    web?: string;
    instagram?: string;
  };
}

interface RecipientData {
  name: string;
  address: string;
  phone: string;
  email: string;
  identification: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private http: HttpClient) {}

  private getImageDataUrl(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(imagePath, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        },
        (error) => reject(error)
      );
    });
  }

  private formatRecipientData(data: RecipientData): string[] {
    return [
      `Nombre: ${data.name}`,
      `Dirección y Ciudad: ${data.address}`,
      `Teléfono: ${data.phone}`,
      `Email: ${data.email}`,
      `Identificación: ${data.identification}`
    ];
  }

  async generatePDF(companyData: CompanyData, recipientData: RecipientData): Promise<void> {
    const doc = new jsPDF();

    // Color de fondo en todo el rótulo (incluyendo la tabla y la parte inferior)
    doc.setFillColor(255, 239, 204); // Color de fondo similar a la imagen
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 65, 'F'); // Rectángulo de fondo en la parte superior

    // Agregar el nombre de la empresa en texto (en lugar del logo)
    doc.setFontSize(20);
    doc.text('Twelve', 14, 15);
    doc.setFontSize(14);
    doc.text('Shock', 14, 20);
    doc.setFontSize(10);
    doc.text(`NIT: 1234567890`, 14, 24);

    // Añadir la fecha actual con un fondo blanco
    const currentDate = new Date().toLocaleDateString();

    // Fondo blanco detrás de la fecha con esquinas ovaladas
    const dateWidth = doc.getTextWidth(`Fecha: ${currentDate}`) + 10; // Añadir un pequeño margen
    doc.setFillColor(255, 255, 255); // Blanco
    doc.roundedRect(90, 10, dateWidth + 10, 10, 3, 3, 'F'); // Rectángulo con esquinas redondeadas detrás de la fecha

    // Fecha con un tamaño de fuente más grande
    doc.setFontSize(12);
    doc.text(`Fecha: ${currentDate}`, 98, 17);

    // Añadir Iconos de Redes Sociales
    let iconX = 70 + doc.getTextWidth(companyData.name) + 65;
    try {
      const facebookIconUrl = companyData.socialMedia.facebook
        ? await this.getImageDataUrl('../../assets/facebook.png')
        : null;
      const webIconUrl = companyData.socialMedia.web
        ? await this.getImageDataUrl('../../assets/whatsapp.png')
        : null;
      const instagramIconUrl = companyData.socialMedia.instagram
        ? await this.getImageDataUrl('../../assets/instagram.png')
        : null;
      if (facebookIconUrl) {
        doc.addImage(facebookIconUrl, 'PNG', iconX+10, 12, 5, 5);
        iconX += 10;
      }
      if (webIconUrl) {
        doc.addImage(webIconUrl, 'PNG', iconX+10, 12, 5, 5);
        iconX += 10;
      }
      if (instagramIconUrl) {
        doc.addImage(instagramIconUrl, 'PNG', iconX+10, 12, 5, 5);
      }
    } catch (error) {
      console.error('Error loading social media icons:', error);
    }

    // Añadir la tabla de Remitente y Destinatario
    const recipientFormattedData = this.formatRecipientData(recipientData);

    (doc as any).autoTable({
      startY: 27, // Ajusta para que la tabla esté encima del fondo beige
      head: [['Remitente', 'Destinatario']],
      body: [
        [
          `${companyData.name}\n${companyData.address}\n${companyData.phone}\n${companyData.email}`,
          recipientFormattedData.join('\n'),
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [42, 135, 207], // Azul de fondo para los encabezados
        textColor: [255, 255, 255], // Blanco para el texto de los encabezados
      },
      columnStyles: {
        0: { cellWidth: 60 }, // Ajusta el ancho de la columna 'Remitente'
        1: { cellWidth: 120 }, // Ajusta el ancho de la columna 'Destinatario'
      },
      margin: { top: 20 },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [0, 0, 0], // Líneas negras
        fontStyle: 'normal', // Asegura que el estilo sea normal por defecto
        textColor: [0, 0, 0], // Color del texto
      },
      tableLineColor: [0, 0, 0], // Líneas negras
      tableLineWidth: 0.1,
      // Cambiar el color de fondo de las celdas de la tabla
      bodyStyles: {
        fillColor: [255, 239, 204], // Color de fondo más claro que el de la tabla
      },
    });

    // Guardar el PDF
    doc.save('shipping-guide.pdf');
  }
}
