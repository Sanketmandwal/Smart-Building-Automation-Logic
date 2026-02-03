import { useBuildingContext } from '../../context/BuildingContext';
import { FileDown, Loader } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFExport = () => {
  const { buildings, campusMetrics, automationMode, timeOfDay, calculateRoomPower } = useBuildingContext();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yOffset = 20;

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(37, 99, 235); // Blue
      pdf.text('Smart Campus BMS Report', pageWidth / 2, yOffset, { align: 'center' });
      
      yOffset += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yOffset, { align: 'center' });
      
      yOffset += 15;

      // Campus Overview
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Campus Overview', 15, yOffset);
      yOffset += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      const overviewData = [
        `Automation Mode: ${automationMode === 'none' ? 'No Automation' : automationMode === 'rule-based' ? 'Rule-Based' : 'AI Context-Aware'}`,
        `Time of Day: ${timeOfDay === 'day' ? '☀️ Day' : '🌙 Night'}`,
        `Total Buildings: ${buildings.length}`,
        `Total Rooms: ${buildings.reduce((sum, b) => sum + b.rooms.length, 0)}`,
        `Total Occupancy: ${buildings.reduce((sum, b) => sum + b.rooms.reduce((s, r) => s + r.occupancy, 0), 0)} people`
      ];
      
      overviewData.forEach((line, i) => {
        pdf.text(line, 15, yOffset + (i * 6));
      });
      yOffset += 40;

      // Campus Metrics
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Performance Metrics', 15, yOffset);
      yOffset += 8;

      pdf.setFontSize(10);
      const metrics = [
        { label: 'Total Power Consumption', value: `${campusMetrics.totalPower}W`, color: [234, 179, 8] },
        { label: 'Energy Efficiency', value: `${campusMetrics.efficiency}%`, color: [34, 197, 94] },
        { label: 'Cost Savings (Session)', value: `₹${campusMetrics.totalCostSaved.toFixed(2)}`, color: [59, 130, 246] },
        { label: 'CO₂ Prevented', value: `${campusMetrics.totalCO2Prevented.toFixed(2)} kg`, color: [16, 185, 129] },
        { label: 'Monthly Budget Projection', value: `₹${campusMetrics.monthlyBudget}`, color: [168, 85, 247] },
        { label: 'Session Duration', value: `${Math.floor(campusMetrics.sessionDuration / 60)}m ${campusMetrics.sessionDuration % 60}s`, color: [99, 102, 241] }
      ];

      metrics.forEach((metric, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 15 + (col * 95);
        const y = yOffset + (row * 20);

        // Box
        pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
        pdf.roundedRect(x, y, 90, 15, 2, 2, 'F');
        
        // Text
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(metric.label, x + 3, y + 5);
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(metric.value, x + 3, y + 12);
        pdf.setFont(undefined, 'normal');
      });
      yOffset += 65;

      // Building Details
      buildings.forEach((building, buildingIndex) => {
        if (yOffset > pageHeight - 60) {
          pdf.addPage();
          yOffset = 20;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${building.name}`, 15, yOffset);
        yOffset += 8;

        const buildingPower = building.rooms.reduce((sum, room) => sum + calculateRoomPower(room), 0);
        const buildingOccupancy = building.rooms.reduce((sum, room) => sum + room.occupancy, 0);

        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Total Power: ${buildingPower}W  |  Occupancy: ${buildingOccupancy} people  |  Rooms: ${building.rooms.length}`, 15, yOffset);
        yOffset += 8;

        // Room Table Header
        pdf.setFontSize(8);
        pdf.setFillColor(229, 231, 235);
        pdf.rect(15, yOffset, pageWidth - 30, 6, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text('Room', 17, yOffset + 4);
        pdf.text('Type', 70, yOffset + 4);
        pdf.text('Occupancy', 110, yOffset + 4);
        pdf.text('Temp', 145, yOffset + 4);
        pdf.text('Power', 170, yOffset + 4);
        pdf.setFont(undefined, 'normal');
        yOffset += 6;

        // Room Rows
        building.rooms.forEach((room, roomIndex) => {
          if (yOffset > pageHeight - 20) {
            pdf.addPage();
            yOffset = 20;
          }

          const roomPower = calculateRoomPower(room);
          const bgColor = roomIndex % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
          
          pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          pdf.rect(15, yOffset, pageWidth - 30, 6, 'F');
          
          pdf.setTextColor(60, 60, 60);
          pdf.text(room.name.substring(0, 25), 17, yOffset + 4);
          pdf.text(room.type, 70, yOffset + 4);
          pdf.text(`${room.occupancy}`, 110, yOffset + 4);
          pdf.text(`${room.temperature}°C`, 145, yOffset + 4);
          pdf.text(`${roomPower}W`, 170, yOffset + 4);
          
          yOffset += 6;
        });

        yOffset += 10;
      });

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Smart Campus Building Management System - Automated Report', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save
      pdf.save(`Campus-BMS-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setIsExporting(false);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="card bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isExporting ? (
            <Loader className="animate-spin" size={32} />
          ) : (
            <FileDown size={32} />
          )}
          <div className="text-left">
            <h3 className="text-lg font-bold">
              {isExporting ? 'Generating PDF...' : 'Export Report'}
            </h3>
            <p className="text-sm text-red-100">
              {isExporting ? 'Please wait...' : 'Download campus performance report'}
            </p>
          </div>
        </div>
        <div className="text-3xl">📄</div>
      </div>
    </button>
  );
};

export default PDFExport;
